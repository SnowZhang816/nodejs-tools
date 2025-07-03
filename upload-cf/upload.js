let { R2 } = require('node-cloudflare-r2')
let { config } = require("dotenv")
const path = require('path'); // 添加 path 模块引用
const fs = require('fs'); // 添加 fs 模块引用

const mimeTypes = {
	'7z': 'application/x-7z-compressed',
	'aac': 'audio/x-aac',
	'ai': 'application/postscript',
	'aif': 'audio/x-aiff',
	'asc': 'text/plain',
	'asf': 'video/x-ms-asf',
	'atom': 'application/atom+xml',
	'avi': 'video/x-msvideo',
	'bmp': 'image/bmp',
	'bz2': 'application/x-bzip2',
	'cer': 'application/pkix-cert',
	'crl': 'application/pkix-crl',
	'crt': 'application/x-x509-ca-cert',
	'css': 'text/css',
	'csv': 'text/csv',
	'cu': 'application/cu-seeme',
	'deb': 'application/x-debian-package',
	'doc': 'application/msword',
	'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'dvi': 'application/x-dvi',
	'eot': 'application/vnd.ms-fontobject',
	'eps': 'application/postscript',
	'epub': 'application/epub+zip',
	'etx': 'text/x-setext',
	'flac': 'audio/flac',
	'flv': 'video/x-flv',
	'gif': 'image/gif',
	'gz': 'application/gzip',
	'htm': 'text/html',
	'html': 'text/html',
	'ico': 'image/x-icon',
	'ics': 'text/calendar',
	'ini': 'text/plain',
	'iso': 'application/x-iso9660-image',
	'jar': 'application/java-archive',
	'jpe': 'image/jpeg',
	'jpeg': 'image/jpeg',
	'jpg': 'image/jpeg',
	'js': 'text/javascript',
	'mjs': 'text/javascript',
	'json': 'application/json',
	'latex': 'application/x-latex',
	'log': 'text/plain',
	'm4a': 'audio/mp4',
	'm4v': 'video/mp4',
	'mid': 'audio/midi',
	'midi': 'audio/midi',
	'mov': 'video/quicktime',
	'mp3': 'audio/mpeg',
	'mp4': 'video/mp4',
	'mp4a': 'audio/mp4',
	'mp4v': 'video/mp4',
	'mpe': 'video/mpeg',
	'mpeg': 'video/mpeg',
	'mpg': 'video/mpeg',
	'mpg4': 'video/mp4',
	'oga': 'audio/ogg',
	'ogg': 'audio/ogg',
	'ogv': 'video/ogg',
	'ogx': 'application/ogg',
	'pbm': 'image/x-portable-bitmap',
	'pdf': 'application/pdf',
	'pgm': 'image/x-portable-graymap',
	'png': 'image/png',
	'pnm': 'image/x-portable-anymap',
	'ppm': 'image/x-portable-pixmap',
	'ppt': 'application/vnd.ms-powerpoint',
	'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'ps': 'application/postscript',
	'qt': 'video/quicktime',
	'rar': 'application/x-rar-compressed',
	'ras': 'image/x-cmu-raster',
	'rss': 'application/rss+xml',
	'rtf': 'application/rtf',
	'sgm': 'text/sgml',
	'sgml': 'text/sgml',
	'svg': 'image/svg+xml',
	'swf': 'application/x-shockwave-flash',
	'tar': 'application/x-tar',
	'tif': 'image/tiff',
	'tiff': 'image/tiff',
	'torrent': 'application/x-bittorrent',
	'ttf': 'application/x-font-ttf',
	'txt': 'text/plain',
	'wav': 'audio/x-wav',
	'webm': 'video/webm',
	'wma': 'audio/x-ms-wma',
	'wmv': 'video/x-ms-wmv',
	'woff': 'application/x-font-woff',
	'wsdl': 'application/wsdl+xml',
	'xbm': 'image/x-xbitmap',
	'xls': 'application/vnd.ms-excel',
	'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'xml': 'application/xml',
	'xpm': 'image/x-xpixmap',
	'xwd': 'image/x-xwindowdump',
	'yaml': 'text/yaml',
	'yml': 'text/yaml',
	'zip': 'application/zip',
};


class upload {
	bucket = null

	executing = []
	maxConnections = 100
	curConnections = 0
	completed = 0

	constructor() {
		let env = 'release'
		config({ path: path.join(__dirname, `env/.env.${env}`) });


		console.log(`当前环境: accountId${process.env.R2_accountId}, accessKeyId: ${process.env.R2_accessKeyId}, 
			secretAccessKey: ${process.env.R2_secretAccessKey},R2_bucket:${process.env.R2_bucket}`)

		const r2 = new R2({
			accountId: process.env.R2_accountId,
			accessKeyId: process.env.R2_accessKeyId,
			secretAccessKey: process.env.R2_secretAccessKey,
		})
		this.bucket = r2.bucket(process.env.R2_bucket);
	}


	async uploadFile(destination, file) {
		try {
			console.log(`开始上传文件:${file} 到:${destination}`);
			let fileExtension = file.substring(file.lastIndexOf('.') + 1)
			const mime = mimeTypes[fileExtension];
			const response = await this.bucket.uploadFile(
				file,
				destination,
				{},
				mime || "application/octet-stream"
			);
			if (response) {
				console.log(`上传成功:${file} 到:${destination}`);
				this.completed++;
			}
		} catch (error) {
			console.log(`error:${file}`);
			console.log(error);
		}
	}

	async _putObject(Key, file) {
		// 如果当前执行的任务数达到最大并发限制，则等待其中一个完成
		if (this.curConnections >= this.maxConnections) {
			await Promise.race(this.executing);
		}
		const promise = this.uploadFile(Key, file).finally(() => {
			// 从执行队列中移除已完成的任务
			this.executing.splice(this.executing.indexOf(promise), 1);
			this.curConnections--;
		});

		this.curConnections++;
		this.executing.push(promise);

		return promise;
	}

	async _uploadDir(root, dir) {
		let all = [];
		let files = fs.readdirSync(dir);
		for (let i = 0; i < files.length; i++) {
			let file = path.join(dir, files[i]);
			if (fs.statSync(file).isDirectory()) {
				all.push(this._uploadDir(root, file));
			} else {
				let relationPath = path.relative(root, path.join(dir, files[i]));
				relationPath = relationPath.replace(/\\/g, '/');
				all.push(this._putObject(relationPath, file));
			}
		}
		return Promise.all(all);
	}

	async uploadDir(dir) {
		const exist = await this.bucket.exists();
		if (exist) {
			let files = this.getAllFiles(dir, dir);
			console.log(`${files.length}个文件待上传`)
			await this._uploadDir(dir, dir);
			console.log(`${files.length}个文件需要上传, 完成${this.completed} 个文件`);
		}
	}

	getAllFiles(dir, rootLocalPath, allFiles) {
		allFiles = allFiles || [];
		const files = fs.readdirSync(dir);
		for (const file of files) {
			const filePath = path.join(dir, file);
			if (fs.statSync(filePath).isDirectory()) {
				this.getAllFiles(filePath, rootLocalPath, allFiles);
			} else {
				const relationPath = path.relative(rootLocalPath, filePath);
				allFiles.push({ filePath, relationPath });
			}
		}
		return allFiles;
	}

	close() {

	}
}

module.exports = upload;