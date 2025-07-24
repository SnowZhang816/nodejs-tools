import { Logger } from './Logger';

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
	webp: string;
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
	webp: 'image/webp',
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

	bundleCacheName = 'bundle';
	installTagCacheName = 'installTag';

	href = '';
	ignoredHosts: string[] = [];

	version = '1.0.1';

	// 正在加载的bundle列表
	installBundles: string[] = [];

	notifySources: Map<string, any[]> = new Map();

	onMessage(evt: ExtendableMessageEvent) {
		if (evt.data.what === 'installBundle') {
			Logger.log('installBundle', evt);
			this.installBundle(evt);
		} else if (evt.data.what === 'skipWaiting') {
			self.skipWaiting();
		} else if (evt.data.what === 'setIgnoreHosts') {
			this.ignoredHosts = evt.data.hosts;
			Logger.log('setIgnoreHosts', this.ignoredHosts);
			if (evt.source) {
				evt.source.postMessage({
					what: 'setIgnoreHostsComplete',
				});
			}
		} else if (evt.data.what === 'setHref') {
			this.href = evt.data.href;
			Logger.log('setHref', this.href);
			if (evt.source) {
				evt.source.postMessage({
					what: 'setHrefComplete',
				});
			}
		} else if (evt.data.what === 'setLoggerLevel') {
			let info = evt.data.data;
			Logger.init(info.level, info.isVConsole);
			if (evt.source) {
				evt.source.postMessage({
					what: 'setLoggerLevelComplete',
				});
			}
		}
	}

	/**
	 * 是否正在安装中
	 * @param bundle
	 * @param version
	 * @returns
	 */
	getIsInstalling(bundle: string, version: string) {
		if (this.installBundles.indexOf(bundle) !== -1) {
			return true;
		}
		return false;
	}

	/**
	 * 是否已经安装了某个bundle版本
	 * @param bundle
	 * @param version
	 * @returns
	 */
	getInstalled(bundle: string, version: string) {
		return new Promise<any>((resolve, reject) => {
			caches
				.open(this.installTagCacheName)
				.then((cache) => {
					cache
						.match(bundle)
						.then((response: Response | undefined) => {
							if (response) {
								response.json().then((data) => {
									Logger.log('getInstall', data);
									resolve(data);
								});
							} else {
								resolve(null);
							}
						})
						.catch((err) => {
							resolve(null);
						});
				})
				.catch((err) => {
					resolve(null);
				});
		});
	}

	saveInstall(bundle: string, version: string) {
		return new Promise<boolean>((resolve, reject) => {
			caches
				.open(this.installTagCacheName)
				.then((cache) => {
					let data = JSON.stringify({ name: bundle, version: version });
					cache.put(bundle, new Response(data));
					resolve(true);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	installBundle(evt: ExtendableMessageEvent) {
		let bundle = evt.data.bundle;
		let version = evt.data.version;

		if (this.getIsInstalling(bundle, version)) {
			Logger.log('bundle is installing', bundle);
			let sources = this.notifySources.get(bundle);
			if (sources) {
				sources.push(evt.source);
			} else {
				this.notifySources.set(bundle, [evt.source]);
			}
			return;
		}

		this.installBundles.push(bundle);

		this.getInstalled(bundle, version).then((result) => {
			if (!result) {
				let url = `assets/${bundle}.zip`;
				if (version) {
					url = `assets/${bundle}.${version}.zip`;
				}
				let times = Date.now();
				Logger.log(`${bundle} fetch start`);
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
								that.notifyBundleInstallProgress(evt, bundle, that.downloadProgress + that.connectProgress);
								Logger.log(`${bundle} fetch end`);
								let now = Date.now();
								Logger.log(`${bundle} fetch time: ${now - times}`);
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
				let oldVersion = result.version;
				Logger.log('bundle already installed', bundle, oldVersion);
				this.notifyBundleInstallProgress(evt, bundle, 1);
				this.notifyBundleInstallDone(evt, bundle);
			}
		});
	}

	saveBundle(evt: ExtendableMessageEvent, buffer: Uint8Array, bundle: string, version: string) {
		return new Promise<void>((resolve, reject) => {
			let times = Date.now();
			Logger.log(`${bundle} unzip start`);
			// @ts-ignore
			let zipObj: JSZip = new JSZip();
			zipObj
				.loadAsync(buffer.buffer as InputFileFormat)
				.then((zip: JSZip) => {
					this.notifyBundleInstallProgress(evt, bundle, this.connectProgress + this.downloadProgress + this.unzipProgress);
					this.unzipEntry(evt, zip, bundle)
						.then(() => {
							this.saveInstall(bundle, version);
							Logger.log(`${bundle} unzip end`);
							let now = Date.now();
							Logger.log(`${bundle} unzip time: ${now - times}`);
							this.notifyBundleInstallDone(evt, bundle);
							resolve();
						})
						.catch((error) => {
							Logger.log('Error unzipping entry:', error);
							this.notifyBundleInstallError(evt, bundle, error);
							reject(error);
						});
				})
				.catch((error) => {
					Logger.log('Error loading zip file:', error);
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

			caches
				.open(this.bundleCacheName)
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
												Logger.error('cache error', file.name, error);
												reject1(error);
											});
									})
									.catch((error: any) => {
										Logger.error('file error', file.name, error);
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
							Logger.error('cache error', error);
							reject(error);
						});
				})
				.catch((error) => {
					Logger.error('open cache error', error);
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

		let sources = this.notifySources.get(bundle);
		if (sources) {
			for (let i = 0; i < sources.length; i++) {
				let source = sources[i];
				if (source && source.postMessage) {
					source.postMessage({
						what: 'bundleInstallProgress',
						progress: progress,
						bundle,
					});
				}
			}
		}
	}

	notifyBundleInstallDone(evt: ExtendableMessageEvent, bundle: string) {
		// 删除安装列表中的bundle
		this.installBundles = this.installBundles.filter((b) => b !== bundle);
		Logger.log('notifyBundleInstallDone1', bundle);
		if (evt.source) {
			evt.source.postMessage({
				what: 'bundleInstallDone',
				bundle,
			});
		}

		let sources = this.notifySources.get(bundle);
		if (sources) {
			for (let i = 0; i < sources.length; i++) {
				let source = sources[i];
				if (source && source.postMessage) {
					source.postMessage({
						what: 'bundleInstallDone',
						bundle,
					});
				}
			}
		}

		this.notifySources.delete(bundle);
	}

	notifyBundleInstallError(evt: ExtendableMessageEvent, bundle: string, error?: string) {
		// 删除安装列表中的bundle
		this.installBundles = this.installBundles.filter((b) => b !== bundle);

		if (evt.source) {
			evt.source.postMessage({
				what: 'bundleInstallError',
				bundle,
				error,
			});
		}

		let sources = this.notifySources.get(bundle);
		if (sources) {
			for (let i = 0; i < sources.length; i++) {
				let source = sources[i];
				if (source && source.postMessage) {
					source.postMessage({
						what: 'bundleInstallError',
						bundle,
					});
				}
			}
		}

		this.notifySources.delete(bundle);
	}

	cacheResponse(request: Request, response: Response) {
		return new Promise<boolean>((resolve, reject) => {
			caches
				.open(this.bundleCacheName)
				.then((cache) => {
					cache
						.put(request, response)
						.then(() => {
							resolve(true);
						})
						.catch((error) => {
							Logger.error('cache put error', error);
							resolve(false);
						});
				})
				.catch((error) => {
					Logger.error('cache open error', error);
					resolve(false);
				});
		});
	}

	match(request: Request) {
		// Get请求才缓存
		if (request.method === 'GET') {
			try {
				if (!this.href) {
					Logger.warn('href not set', this.href);
					return false;
				}
				const u = new URL(request.url);
				const segments = u.pathname.split('/');
				const filename = segments[segments.length - 1];
				const hasExt = /\.\w+$/.test(filename);
				if (!hasExt) {
					Logger.log('no extension', request.url);
					return false;
				}

				if (filename.endsWith('vconsole.js')) {
					Logger.log('ignore vconsole');
					return false;
				}

				const hrefUrl = new URL(this.href);
				if (u.origin === hrefUrl.origin && u.pathname === hrefUrl.pathname) {
					Logger.log('origin and pathname same');
					return false;
				}
				let host = u.origin;
				if (this.ignoredHosts.includes(host)) {
					Logger.log('ignored host', host);
					return false;
				}
				return true;
			} catch (error) {
				Logger.error('match error', error);
				return false;
			}
		}

		return false;
	}

	onFetch(request: Request): Promise<Response> | null {
		if (!this.match(request)) {
			return null;
		} else {
			return new Promise((resolve, reject) => {
				caches
					.open(this.bundleCacheName)
					.then((cache) => {
						cache
							.match(request)
							.then((res) => {
								if (res) {
									resolve(res);
								} else {
									fetch(request).then((res) => {
										if (res.ok) {
											this.cacheResponse(request, res.clone());
										}
										resolve(res);
									});
								}
							})
							.catch((error) => {
								Logger.error('match cache error', error);
								fetch(request).then((res) => {
									if (res.ok) {
										this.cacheResponse(request, res.clone());
									}
									resolve(res);
								});
							});
					})
					.catch((error) => {
						Logger.error('open cache error', error);
						fetch(request).then((res) => {
							if (res.ok) {
								this.cacheResponse(request, res.clone());
							}
							resolve(res);
						});
					});
			});
		}
	}
}
