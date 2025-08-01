import { Logger } from './Logger';

const mimeTypes: { [key: string]: string } = {
	'7z': 'application/x-7z-compressed',
	aac: 'audio/x-aac',
	ai: 'application/postscript',
	aif: 'audio/x-aiff',
	asc: 'text/plain',
	asf: 'video/x-ms-asf',
	atom: 'application/atom+xml',
	avi: 'video/x-msvideo',
	bmp: 'image/bmp',
	bz2: 'application/x-bzip2',
	cer: 'application/pkix-cert',
	crl: 'application/pkix-crl',
	crt: 'application/x-x509-ca-cert',
	css: 'text/css',
	csv: 'text/csv',
	cu: 'application/cu-seeme',
	deb: 'application/x-debian-package',
	doc: 'application/msword',
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	dvi: 'application/x-dvi',
	eot: 'application/vnd.ms-fontobject',
	eps: 'application/postscript',
	epub: 'application/epub+zip',
	etx: 'text/x-setext',
	flac: 'audio/flac',
	flv: 'video/x-flv',
	gif: 'image/gif',
	gz: 'application/gzip',
	htm: 'text/html',
	html: 'text/html',
	ico: 'image/x-icon',
	ics: 'text/calendar',
	ini: 'text/plain',
	iso: 'application/x-iso9660-image',
	jar: 'application/java-archive',
	jpe: 'image/jpeg',
	jpeg: 'image/jpeg',
	jpg: 'image/jpeg',
	js: 'text/javascript',
	mjs: 'text/javascript',
	json: 'application/json',
	latex: 'application/x-latex',
	log: 'text/plain',
	m4a: 'audio/mp4',
	m4v: 'video/mp4',
	mid: 'audio/midi',
	midi: 'audio/midi',
	mov: 'video/quicktime',
	mp3: 'audio/mpeg',
	mp4: 'video/mp4',
	mp4a: 'audio/mp4',
	mp4v: 'video/mp4',
	mpe: 'video/mpeg',
	mpeg: 'video/mpeg',
	mpg: 'video/mpeg',
	mpg4: 'video/mp4',
	oga: 'audio/ogg',
	ogg: 'audio/ogg',
	ogv: 'video/ogg',
	ogx: 'application/ogg',
	pbm: 'image/x-portable-bitmap',
	pdf: 'application/pdf',
	pgm: 'image/x-portable-graymap',
	png: 'image/png',
	pnm: 'image/x-portable-anymap',
	ppm: 'image/x-portable-pixmap',
	ppt: 'application/vnd.ms-powerpoint',
	pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	ps: 'application/postscript',
	qt: 'video/quicktime',
	rar: 'application/x-rar-compressed',
	ras: 'image/x-cmu-raster',
	rss: 'application/rss+xml',
	rtf: 'application/rtf',
	sgm: 'text/sgml',
	sgml: 'text/sgml',
	svg: 'image/svg+xml',
	swf: 'application/x-shockwave-flash',
	tar: 'application/x-tar',
	tif: 'image/tiff',
	tiff: 'image/tiff',
	torrent: 'application/x-bittorrent',
	ttf: 'application/x-font-ttf',
	txt: 'text/plain',
	wav: 'audio/x-wav',
	webm: 'video/webm',
	wma: 'audio/x-ms-wma',
	wmv: 'video/x-ms-wmv',
	woff: 'application/x-font-woff',
	wsdl: 'application/wsdl+xml',
	xbm: 'image/x-xbitmap',
	xls: 'application/vnd.ms-excel',
	xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	xml: 'application/xml',
	xpm: 'image/x-xpixmap',
	xwd: 'image/x-xwindowdump',
	yaml: 'text/yaml',
	yml: 'text/yaml',
	zip: 'application/zip',
};

export class ZipEntry {
	bundleName: string = '';
	files: JSZip.JSZipObject[] = [];
	filesMap: Map<string, JSZip.JSZipObject> = new Map();

	constructor(bundleName: string) {
		this.bundleName = bundleName;
	}

	unzipEntry(buffer: Uint8Array) {
		return new Promise<void>((resolve, reject) => {
			// @ts-ignore
			let zipObj: JSZip = new JSZip();
			zipObj
				.loadAsync(buffer.buffer as InputFileFormat)
				.then((zip: JSZip) => {
					zip.forEach((relativePath, file: JSZip.JSZipObject) => {
						if (!file.dir) {
							this.files.push(file);
							this.filesMap.set(relativePath, file);
						}
					});

					resolve();
				})
				.catch((error) => {
					Logger.log('Error loading zip file:', error);
					reject(error);
				});
		});
	}

	getFetchResponse(fileName: string): Promise<Response | null> {
		return new Promise<Response | null>((resolve, reject) => {
			const file = this.filesMap.get(fileName);
			if (!file) {
				Logger.error(`File not found in zip: ${fileName}`);
				resolve(null);
				return;
			}
			if (file.dir) {
				Logger.error(`File is a directory: ${fileName}`);
				resolve(null);
				return;
			}
			file
				.async('arraybuffer')
				.then((data) => {
					const extension = file.name.split('.').pop() || '';
					const mime = mimeTypes[extension] || 'application/octet-stream';
					let res = new Response(data, {
						headers: {
							'Content-Type': mime,
							// @ts-ignore
							'Content-Length': file._data.uncompressedSize,
						},
					});

					resolve(res);
				})
				.catch((error) => {
					resolve(null);
				});
		});
	}
}
