import { DB } from './DB';

importScripts('./libs/jszip.min.js');

type MimeTypeMap = {
	json: string;
	js: string;
	css: string;
	png: string;
	jpg: string;
	html: string;
	bin: string;
	mp3: string;
	// 如果需要，可以添加更多文件类型和对应的 MIME 类型
};

// 然后，我们可以将 MIMEMAP 标注为这个类型
const MimeMap: MimeTypeMap = {
	json: 'application/json',
	js: 'application/javascript',
	css: 'text/css',
	png: 'image/png',
	jpg: 'image/jpeg',
	html: 'text/html',
	bin: 'application/octet-stream',
	mp3: 'audio/mpeg',
	// ttf: "application/octet-stream",
	// ... 其他映射
};

function getFileMime(extension: keyof MimeTypeMap) {
	return MimeMap[extension] || 'text/plain';
}

export class BundleCache {
	connectProgress = 0.02;
	downloadProgress = 0.78;
	unzipProgress = 0.1;
	installProgress = 0.1;

	db: DB | null = null;

	cacheName = 'bundleCache';

	onMessage(evt: ExtendableMessageEvent) {
		if (evt.data.what === 'installBundle') {
			console.log('installBundle', evt);
			this.installBundle(evt);
		}
	}

	getDB() {
		return new Promise<DB | null>((resolve) => {
			if (!this.db) {
				this.db = new DB(this.cacheName);
			}
			this.db.getDB().then((db) => {
				if (db) {
					resolve(this.db!);
				} else {
					console.error('Failed to open database');
					resolve(null);
				}
			});
		});
	}

	installBundle(evt: ExtendableMessageEvent) {
		let bundle = evt.data.bundle;
		let version = evt.data.version;

		this.getDB().then((db) => {
			if (!db) {
				this.notifyBundleInstallError(evt, bundle, 'db error');
				return;
			}
			db.getItem(bundle).then((value) => {
				if (!value) {
					const url = `assets/${bundle}.${version}.zip`;
					fetch(url).then((response) => {
						if (!response.ok) {
							this.notifyBundleInstallError(evt, bundle, 'fetch error');
							return;
						}

						if (!response.body) {
							this.notifyBundleInstallError(evt, bundle, 'no response body');
							return;
						}

						let reader = response.body!.getReader();
						let contentLength = +(response.headers.get('content-length') || '0');
						let buffer = new Uint8Array(contentLength);
						let receivedLength = 0; // 已接收的字节数
						let chunks: any = []; // 用于存储读取到的所有数据块
						let that = this;
						this.notifyBundleInstallProgress(evt, bundle, this.connectProgress);
						function read() {
							reader.read().then(({ done, value }) => {
								if (done) {
									// 如果 done 为 true，表示数据读取完成
									let position = 0;
									for (let chunk of chunks) {
										buffer.set(chunk, position);
										position += chunk.length;
									}
									// 读取完成，处理 buffer
									that.saveBundle(evt, buffer, bundle, version);
									return;
								}

								// 如果 done 为 false，表示还有数据未读取
								chunks.push(value); // 将当前数据块存储到数组中
								receivedLength += value.length; // 更新已接收的字节数
								let progress = (receivedLength / contentLength) * that.downloadProgress + that.connectProgress;
								that.notifyBundleInstallProgress(evt, bundle, progress);
								// 继续读取下一块数据
								read();
							});
						}

						read(); // 开始读取数据
					});
				} else {
					console.log('bundle already installed', bundle, value);
					this.notifyBundleInstallProgress(evt, bundle, 1);
					this.notifyBundleInstallDone(evt, bundle);
				}
			});
		});
	}

	saveBundle(evt: ExtendableMessageEvent, buffer: Uint8Array, bundle: string, version: string) {
		return new Promise<void>((resolve, reject) => {
			// @ts-ignore
			let zipObj: JSZip = new JSZip();
			zipObj
				.loadAsync(buffer.buffer as InputFileFormat)
				.then((zip: JSZip) => {
					this.notifyBundleInstallProgress(evt, bundle, this.connectProgress + this.downloadProgress + this.unzipProgress);
					this.unzipEntry(evt, zip, bundle)
						.then(() => {
							// console.log('unzipEntry done', bundle);
							this.getDB().then((db) => {
								if (!db) {
									console.log('save bundle version and db error');
									return;
								}
								db.setItem(bundle, version).then((value) => {
									console.log('save bundle version', bundle, version, value);
								});
							});
							this.notifyBundleInstallDone(evt, bundle);
							resolve();
						})
						.catch((error) => {
							console.log('Error unzipping entry:', error);
							this.notifyBundleInstallError(evt, bundle, error);
							reject(error);
						});
				})
				.catch((error) => {
					console.log('Error loading zip file:', error);
					this.notifyBundleInstallError(evt, bundle, error);
					reject(error);
				});
		});
	}

	unzipEntry(evt: ExtendableMessageEvent, zip: JSZip, bundle: string) {
		return new Promise<void>((resolve, reject) => {
			let list: any = [];
			zip.forEach((relativePath, file: JSZip.JSZipObject) => {
				if (!file.dir) {
					list.push(file);
				}
			});
			console.log('file list', list, bundle);

			caches
				.open(`bundle`)
				.then((cache) => {
					let promises = [];
					let total = list.length;
					let cur = 0;
					for (let file of list) {
						const extension = file.name.split('.').pop() || '';
						promises.push(
							new Promise<void>((resolve1, reject1) => {
								file
									.async('arraybuffer')
									.then((data: ArrayBuffer) => {
										cache
											.put(
												new Request(`assets/${bundle}/` + file.name), // 使用文件名作为请求的 URL
												new Response(data, {
													headers: {
														'Content-Type': getFileMime(extension),
														'Content-Length': file._data.uncompressedSize,
													},
												})
											)
											.then(() => {
												cur++;
												let progress = this.connectProgress + this.downloadProgress + this.unzipProgress + this.installProgress * (cur / total);
												this.notifyBundleInstallProgress(evt, bundle, progress);
												resolve1();
											})
											.catch((error) => {
												console.log('cache error', file.name, error);
												reject1(error);
											});
									})
									.catch((error: any) => {
										console.log('file error', file.name, error);
										reject1(error);
									});
							})
						);
					}

					Promise.all(promises)
						.then(() => {
							resolve();
						})
						.catch((error) => {
							console.log('cache error', error);
							reject(error);
						});
				})
				.catch((error) => {
					console.log('open cache error', error);
					reject(error);
				});
		});
	}

	notifyBundleInstallProgress(evt: ExtendableMessageEvent, bundle: string, progress: number) {
		if (evt.source) {
			evt.source.postMessage({
				what: 'bundleInstallProgress',
				progress: progress,
				bundle,
			});
		}
	}

	notifyBundleInstallDone(evt: ExtendableMessageEvent, bundle: string) {
		if (evt.source) {
			evt.source.postMessage({
				what: 'bundleInstallDone',
				bundle,
			});
		}
	}

	notifyBundleInstallError(evt: ExtendableMessageEvent, bundle: string, error?: string) {
		if (evt.source) {
			evt.source.postMessage({
				what: 'bundleInstallError',
				bundle,
				error,
			});
		}
	}

	onFetch(request: Request, response: Response): Promise<Response> {
		console.log('onFetch', request.url);
		if (response) {
			// 如果响应已经存在，则直接返回
			return Promise.resolve(response);
		} else {
			return new Promise((resolve, reject) => {
				caches
					.open('bundle')
					.then((cache) => {
						cache
							.match(request)
							.then((res) => {
								if (res) {
									console.log('cache hit', request.url, res.headers.get('Content-Type'));
									resolve(res);
								} else {
									resolve(fetch(request));
								}
							})
							.catch((error) => {
								console.log('match cache error', error);
								resolve(fetch(request));
							});
					})
					.catch((error) => {
						console.log('open cache error', error);
						resolve(fetch(request));
					});
			});
		}
	}
}
