const path = require('path'); // 添加 path 模块引用
const fs = require('fs'); // 添加 fs 模块引用

const args = process.argv.slice(2);
console.log('args', args);

/** 上传目录 */
let localPath = 'D:\\JenkensWork\\out\\release';
if (args[0]) {
	localPath = args[0];
}

function getDir() {
	let jsonFile = path.join(localPath, 'version.json');
	let data = fs.readFileSync(jsonFile, 'utf8');
	let versionInfo = JSON.parse(data);
	let dir = path.join(localPath, versionInfo.versionStr);
	return dir;
}

async function main() {
	let dir = getDir();
	let upload = require("./upload.js");
	let env = "release";
	let uploader = new upload(env);
	await uploader.uploadDir(dir);

	console.log("上传完成");
}

main();



