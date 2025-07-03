const args = process.argv.slice(2);
console.log('args', args);

/** 上传目录 */
let localPath = 'd:\\work\\nodejs-tools\\shader';
if (args[0]) {
	localPath = args[0];
}

async function main() {
	let dir = localPath
	let upload = require("./upload.js");
	let uploader = new upload();
	await uploader.uploadDir(dir);

	console.log("上传完成");

	uploader.close();

	process.exit(0);
}

main();



