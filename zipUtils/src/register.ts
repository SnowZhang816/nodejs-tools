import { download } from './download';
import { Logger } from './Logger';
import { ZipEntry } from './zipEntry';

export interface IConfigOption {
	importBase: string;
	nativeBase: string;
	base: string;
	name: string;
	deps: string[];
	uuids: string[];
	paths: Record<string, any[]>;
	scenes: Record<string, string>;
	packs: Record<string, string[]>;
	versions: { import: string[]; native: string[] };
	redirect: string[];
	debug: boolean;
	types: string[];
	extensionMap: Record<string, string[]>;
}

export type FileProgressCallback = (loaded: number, total: number) => void;
function downloadFile(url: string, options: Record<string, any>, onProgress: FileProgressCallback | null | undefined, onComplete: (err: Error | null, data?: any) => void): XMLHttpRequest {
	const xhr = new XMLHttpRequest();
	const errInfo = `download failed: ${url}, status: `;

	xhr.open('GET', url, true);

	if (options.xhrResponseType !== undefined) {
		xhr.responseType = options.xhrResponseType as XMLHttpRequestResponseType;
	}
	if (options.xhrWithCredentials !== undefined) {
		xhr.withCredentials = options.xhrWithCredentials as boolean;
	}
	if (options.xhrMimeType !== undefined && xhr.overrideMimeType) {
		xhr.overrideMimeType(options.xhrMimeType as string);
	}
	if (options.xhrTimeout !== undefined) {
		xhr.timeout = options.xhrTimeout as number;
	}

	if (options.xhrHeader) {
		for (const header in options.xhrHeader) {
			xhr.setRequestHeader(header, options.xhrHeader[header] as string);
		}
	}

	xhr.onload = (): void => {
		if (xhr.status === 200 || xhr.status === 0) {
			if (onComplete) {
				onComplete(null, xhr.response);
			}
		} else if (onComplete) {
			onComplete(new Error(`${errInfo}${xhr.status}(no response)`));
		}
	};

	if (onProgress) {
		xhr.onprogress = (e): void => {
			if (e.lengthComputable) {
				onProgress(e.loaded, e.total);
			}
		};
	}

	xhr.onerror = (): void => {
		if (onComplete) {
			onComplete(new Error(`${errInfo}${xhr.status}(error)`));
		}
	};

	xhr.ontimeout = (): void => {
		if (onComplete) {
			onComplete(new Error(`${errInfo}${xhr.status}(time out)`));
		}
	};

	xhr.onabort = (): void => {
		if (onComplete) {
			onComplete(new Error(`${errInfo}${xhr.status}(abort)`));
		}
	};

	xhr.send(null);

	return xhr;
}

export function downloadBundleZip(url: string, progressCallback: (progress: number) => void, onComplete: (zip: ZipEntry | null) => void) {
	download.download(
		url,
		(progress: number): void => {
			progressCallback(progress);
		},
		(zip: ZipEntry): void => {
			onComplete(zip);
		}
	);
}

function processRelative(url: string, bundleName: string) {
	let start = `assets/${bundleName}/`;
	if (url.startsWith(start)) {
		return url.substring(start.length);
	}
	return url;
}

function tryParasBundleName(url: string): string | null {
	if (url.startsWith('assets/')) {
		let end = url.indexOf('/', 7);
		if (end > 0) {
			return url.substring(7, end);
		}
	}

	return null;
}

function downloadJson(url: string, options: Record<string, any>, onComplete: (err: Error | null, data?: any) => void) {
	function defaultHandler() {
		options.xhrResponseType = 'json';
		downloadFile(url, options, options.onFileProgress as FileProgressCallback, onComplete);
	}

	let bundleName = options.bundleTag;
	if (!bundleName) {
		bundleName = tryParasBundleName(url);
	}

	if (bundleName) {
		let relativePath = options.relativePath || url;
		relativePath = processRelative(relativePath, bundleName);
		// @ts-ignore
		const version = options.version || cc.assetManager.downloader.bundleVers[bundleName];
		let zipUrl = `assets/${bundleName}.${version}.zip`;
		downloadBundleZip(
			zipUrl,
			(progress: number): void => {},
			(zip: ZipEntry | null): void => {
				if (zip) {
					zip.getFetchResponse(relativePath).then((res) => {
						if (res) {
							res
								.json()
								.then((data) => {
									onComplete(null, data);
								})
								.catch((err) => {
									onComplete(new Error(`Failed to parse JSON from ${url}: ${err.message}`), null);
								});
						} else {
							defaultHandler();
						}
					});
				} else {
					defaultHandler();
				}
			}
		);
	} else {
		defaultHandler();
	}
}

let downloadedScripts: Record<string, boolean> = {};
function downloadScript(url: string, options: Record<string, any>, onComplete: (err: Error | null) => void) {
	// 测试 Function是否可用
	let bundleName = options.bundleTag;
	if (!bundleName) {
		bundleName = tryParasBundleName(url);
	}
	let valid = true;
	try {
		new Function('return 1;')();
	} catch (e) {
		valid = false;
		Logger.log('Function is not available');
	}

	function defaultHandler() {
		if (downloadedScripts[url]) {
			if (onComplete) {
				onComplete(null);
			}
			return null;
		}

		const script = window.document.createElement('script');

		if (window.location.protocol !== 'file:') {
			script.crossOrigin = 'anonymous';
		}

		script.async = options.scriptAsyncLoading || false;
		script.src = url;
		function loadHandler(): void {
			script.parentNode!.removeChild(script);
			script.removeEventListener('load', loadHandler, false);
			script.removeEventListener('error', errorHandler, false);
			downloadedScripts[url] = true;
			if (onComplete) {
				onComplete(null);
			}
		}

		function errorHandler(): void {
			script.parentNode!.removeChild(script);
			script.removeEventListener('load', loadHandler, false);
			script.removeEventListener('error', errorHandler, false);
			if (onComplete) {
				onComplete(new Error('downloadScript errorHandler'));
			}
		}

		script.addEventListener('load', loadHandler, false);
		script.addEventListener('error', errorHandler, false);
		window.document.body.appendChild(script);
	}

	if (valid && bundleName) {
		let relativePath = options.relativePath || url;
		relativePath = processRelative(relativePath, bundleName);

		// @ts-ignore
		const version = options.version || cc.assetManager.downloader.bundleVers[bundleName];
		let zipUrl = `assets/${bundleName}.${version}.zip`;
		downloadBundleZip(
			zipUrl,
			(progress: number): void => {},
			(zip: ZipEntry | null): void => {
				if (zip) {
					zip.getFetchResponse(relativePath).then((res) => {
						if (res) {
							res
								.text()
								.then((data) => {
									new Function(data)();
									onComplete(null);
								})
								.catch((err) => {
									onComplete(new Error(`Failed to parse script from ${url}: ${err.message}`));
								});
						} else {
							defaultHandler();
						}
					});
				} else {
					defaultHandler();
				}
			}
		);
	} else {
		defaultHandler();
	}
}

const REGEX = /^(?:\w+:\/\/|\.+\/).+/;
function downloadBundle(nameOrUrl: string, options: Record<string, any>, onComplete: (err: Error | null, data?: any) => void) {
	const bundleName = nameOrUrl;
	let url = `assets/${bundleName}`;
	// @ts-ignore
	const version = options.version || cc.assetManager.downloader.bundleVers[bundleName];
	let count = 0;
	const config = `${url}/config.${version ? `${version}.` : ''}json`;
	let out: IConfigOption | null = null;
	let error: Error | null = null;
	options.bundleTag = bundleName;
	options.relativePath = `config.${version ? `${version}.` : ''}json`;
	downloadJson(config, options, (err, response): void => {
		error = err || error;
		out = response as IConfigOption;
		if (out) {
			out.base = `${url}/`;
		}
		if (++count === 2) {
			onComplete(error, out);
		}
	});

	const jspath = `${url}/index.${version ? `${version}.` : ''}js`;
	options.relativePath = `index.${version ? `${version}.` : ''}js`;
	downloadScript(jspath, options, (err): void => {
		error = err || error;
		if (++count === 2) {
			onComplete(error, out);
		}
	});
}

function downloadText(url: string, options: Record<string, any>, onComplete: (err: Error | null, data?: string) => void) {
	function defaultHandler() {
		options.xhrResponseType = 'text';
		downloadFile(url, options, options.onFileProgress as FileProgressCallback, onComplete);
	}

	let bundleName = options.bundleTag;
	if (!bundleName) {
		bundleName = tryParasBundleName(url);
	}
	if (bundleName) {
		let relativePath = options.relativePath || url;
		relativePath = processRelative(relativePath, bundleName);

		// @ts-ignore
		const version = options.version || cc.assetManager.downloader.bundleVers[bundleName];
		let zipUrl = `assets/${bundleName}.${version}.zip`;
		downloadBundleZip(
			zipUrl,
			(progress: number): void => {},
			(zip: ZipEntry | null): void => {
				if (zip) {
					zip.getFetchResponse(relativePath).then((res) => {
						if (res) {
							res
								.text()
								.then((data) => {
									onComplete(null, data);
								})
								.catch((err) => {
									onComplete(new Error(`Failed to parse text from ${url}: ${err.message}`), '');
								});
						} else {
							defaultHandler();
						}
					});
				} else {
					defaultHandler();
				}
			}
		);
		{
			defaultHandler();
		}
	}
}

const downloadBlob = (url: string, options: Record<string, any>, onComplete: (err: Error | null, data?: any) => void): void => {
	options.xhrResponseType = 'blob';
	downloadFile(url, options, options.onFileProgress as FileProgressCallback, onComplete);
};

function downloadDomImage(url: string, options: Record<string, any>, onComplete: (err: Error | null, data?: HTMLImageElement | null) => void): HTMLImageElement {
	const img = new window.Image();

	// NOTE: on xiaomi platform, we need to force setting img.crossOrigin as 'anonymous'
	// @ts-ignore
	if (window.location.protocol !== 'file:' || cc.sys.platform === cc.sys.Platform.XIAOMI_QUICK_GAME) {
		img.crossOrigin = 'anonymous';
	}

	function loadCallback(): void {
		img.removeEventListener('load', loadCallback);
		img.removeEventListener('error', errorCallback);
		if (onComplete) {
			onComplete(null, img);
		}
	}

	function errorCallback(): void {
		img.removeEventListener('load', loadCallback);
		img.removeEventListener('error', errorCallback);
		if (onComplete) {
			onComplete(new Error('Failed to load image'));
		}
	}

	img.addEventListener('load', loadCallback);
	img.addEventListener('error', errorCallback);
	img.src = url;
	return img;
}

function downloadImage(url: string, options: Record<string, any>, onComplete: (err: Error | null, data?: any) => void) {
	function defaultHandler() {
		// @ts-ignore
		const func = cc.sys.hasFeature(cc.sys.Feature.IMAGE_BITMAP) && cc.assetManager.allowImageBitmap ? downloadBlob : downloadDomImage;
		func(url, options, onComplete);
	}

	let bundleName = options.bundleTag;
	if (!bundleName) {
		bundleName = tryParasBundleName(url);
	}
	if (bundleName) {
		let relativePath = options.relativePath || url;
		relativePath = processRelative(relativePath, bundleName);

		// @ts-ignore
		const version = options.version || cc.assetManager.downloader.bundleVers[bundleName];
		let zipUrl = `assets/${bundleName}.${version}.zip`;
		downloadBundleZip(
			zipUrl,
			(progress: number): void => {},
			(zip: ZipEntry | null): void => {
				if (zip) {
					zip.getFetchResponse(relativePath).then((res) => {
						if (res) {
							res
								.blob()
								.then((data) => {
									onComplete(null, data);
								})
								.catch((err) => {
									onComplete(new Error(`Failed to parse image from ${url}: ${err.message}`), null);
								});
						} else {
							defaultHandler();
						}
					});
				} else {
					defaultHandler();
				}
			}
		);
	} else {
		defaultHandler();
	}
}

function downloadArrayBuffer(url: string, options: Record<string, any>, onComplete: (err: Error | null, data?: any) => void) {
	function defaultHandler() {
		options.xhrResponseType = 'arraybuffer';
		downloadFile(url, options, options.onFileProgress as FileProgressCallback, onComplete);
	}

	let bundleName = options.bundleTag;
	if (!bundleName) {
		bundleName = tryParasBundleName(url);
	}
	if (bundleName) {
		let relativePath = options.relativePath || url;
		relativePath = processRelative(relativePath, bundleName);
		// @ts-ignore
		const version = options.version || cc.assetManager.downloader.bundleVers[bundleName];
		let zipUrl = `assets/${bundleName}.${version}.zip`;
		downloadBundleZip(
			zipUrl,
			(progress: number): void => {},
			(zip: ZipEntry | null): void => {
				if (zip) {
					zip.getFetchResponse(relativePath).then((res) => {
						if (res) {
							res
								.arrayBuffer()
								.then((data) => {
									onComplete(null, data);
								})
								.catch((err) => {
									onComplete(new Error(`Failed to parse array buffer from ${url}: ${err.message}`), null);
								});
						} else {
							defaultHandler();
						}
					});
				} else {
					defaultHandler();
				}
			}
		);
	} else {
		defaultHandler();
	}
}

function downloadFromZip(url: string, options: Record<string, any>, onComplete: (data?: any | null) => void) {
	options = options || {};
	let bundleName = options.bundleTag;
	if (!bundleName) {
		bundleName = tryParasBundleName(url);
	}

	if (bundleName) {
		let relativePath = options.relativePath || url;
		relativePath = processRelative(relativePath, bundleName);

		// @ts-ignore
		const version = options.version || cc.assetManager.downloader.bundleVers[bundleName];
		let zipUrl = `assets/${bundleName}.${version}.zip`;
		downloadBundleZip(
			zipUrl,
			(progress: number): void => {},
			(zip: ZipEntry | null): void => {
				if (zip) {
					zip
						.getFetchResponse(relativePath)
						.then((res) => {
							onComplete(res);
						})
						.catch((err) => {
							onComplete(null);
						});
				} else {
					onComplete(null);
				}
			}
		);
	}
}

export function register() {
	let customProcess = (task: any, done: any) => {
		let options = task.options;
		for (var op in options) {
			switch (op) {
				case 'bundle':
					options['bundleTag'] = options[op];
			}
		}
		task.output = task.input;
		done();
	};
	// @ts-ignore
	cc.assetManager.pipeline.insert(customProcess, 0);
	// @ts-ignore
	cc.assetManager.fetchPipeline.insert(customProcess, 0);

	let map: Record<string, any> = {
		// Images
		'.png': downloadImage,
		'.jpg': downloadImage,
		'.bmp': downloadImage,
		'.jpeg': downloadImage,
		'.gif': downloadImage,
		'.ico': downloadImage,
		'.tiff': downloadImage,
		'.webp': downloadImage,
		'.image': downloadImage,

		// Txt
		'.txt': downloadText,
		'.xml': downloadText,
		'.vsh': downloadText,
		'.fsh': downloadText,
		'.atlas': downloadText,
		'.tmx': downloadText,
		'.tsx': downloadText,
		'.fnt': downloadText,
		'.plist': downloadText,

		// json
		'.ExportJson': downloadJson,
		'.json': downloadJson,

		// Binary
		'.pvr': downloadArrayBuffer,
		'.pkm': downloadArrayBuffer,
		'.astc': downloadArrayBuffer,
		'.binary': downloadArrayBuffer,
		'.bin': downloadArrayBuffer,
		'.dbbin': downloadArrayBuffer,
		'.skel': downloadArrayBuffer,

		bundle: downloadBundle,

		default: downloadText,
	};
	// @ts-ignore
	cc.assetManager.downloader.register(map);
	// @ts-ignore
	cc.assetManager.downloader.downloadFromZip = downloadFromZip;
}
