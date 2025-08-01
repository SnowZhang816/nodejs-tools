import { Logger } from './Logger';
import { ZipEntry } from './zipEntry';

class DownLoad {
	connectProgress = 0.02;
	downloadProgress = 0.78;
	unzipProgress = 0.1;
	progress: number = 0; // 下载进度

	cachedBundles: Record<string, ZipEntry> = {};

	downLoadings: Record<string, any[]> = {};
	downLoadingProgress: Record<string, any[]> = {};

	download(url: string, progressCallback: (progress: number) => void, completeCallback: (zip: ZipEntry) => void): void {
		let cachedBundle = this.cachedBundles[url];
		if (cachedBundle) {
			completeCallback(cachedBundle);
			return;
		}
		if (this.downLoadings[url]) {
			this.downLoadings[url].push(completeCallback);
			return;
		}

		if (this.downLoadingProgress[url]) {
			this.downLoadingProgress[url].push(progressCallback);
		} else {
			this.downLoadingProgress[url] = [progressCallback];
		}

		this.downLoadings[url] = [completeCallback];

		let times = Date.now();
		Logger.log(`${url} fetch start`);
		fetch(url).then((response) => {
			if (!response.ok) {
				Logger.log(url, 'fetch error');
				return;
			}

			if (!response.body) {
				Logger.log(url, 'no response body');
				return;
			}

			let reader = response.body!.getReader();
			let contentLength = +(response.headers.get('content-length') || '0');
			let buffer = new Uint8Array(contentLength);
			let receivedLength = 0; // 已接收的字节数
			let chunks: any = []; // 用于存储读取到的所有数据块
			let that = this;
			this.progress += this.connectProgress;
			this.notifyProgress?.(url, this.progress);
			function read() {
				reader.read().then(({ done, value }) => {
					if (done) {
						// 如果 done 为 true，表示数据读取完成
						let position = 0;
						for (let chunk of chunks) {
							buffer.set(chunk, position);
							position += chunk.length;
						}
						that.progress = that.downloadProgress + that.connectProgress;
						that.notifyProgress?.(url, that.progress);
						Logger.log(`${url} fetch end`);
						let now = Date.now();
						Logger.log(`${url} fetch time: ${now - times}`);

						let zipEntry = new ZipEntry(url);
						zipEntry.unzipEntry(buffer).then(() => {
							that.progress = that.downloadProgress + that.unzipProgress;
							that.notifyProgress?.(url, that.progress);

							that.cachedBundles[url] = zipEntry;

							let cbs = that.downLoadings[url];
							for (let i = 0; i < cbs.length; ++i) {
								cbs[i](zipEntry); // 调用所有完成回调
							}
							delete that.downLoadings[url];
							delete that.downLoadingProgress[url];
						});

						return;
					}

					// 如果 done 为 false，表示还有数据未读取
					chunks.push(value); // 将当前数据块存储到数组中
					receivedLength += value.length; // 更新已接收的字节数
					that.progress = (receivedLength / contentLength) * that.downloadProgress + that.connectProgress;
					that.notifyProgress?.(url, that.progress);
					// 继续读取下一块数据
					read();
				});
			}

			read(); // 开始读取数据
		});
	}

	notifyProgress(url: string, progress: number): void {
		let cbs = this.downLoadingProgress[url];
		for (let i = 0; i < cbs.length; ++i) {
			cbs[i](progress);
		}
	}
}

let download = new DownLoad();
export { download };
