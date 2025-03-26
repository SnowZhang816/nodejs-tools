const path = require('path');
const fs = require('fs');
const upload = require('./upload.js');

const config = {
	host: '192.168.1.6', // Linux 服务器 IP 地址
	port: 22, // SSH 端口
	username: 'gxfc', // 登录用户名
	password: 'gxfc', // 登录密码
};
const args = process.argv.slice(2);

/** 上传目录 */
let localPath = 'D:\\JenkensWork\\out';
if (args[0]) {
	localPath = args[0];
}

let remoteDir = '/data/front/gxfc_game/1.0.22/';
if (args[1]) {
	remoteDir = args[1];
}
remoteDir = remoteDir.replace(/\\/g, '/');

function getDir() {
	let jsonFile = path.join(localPath, 'version.json');
	let data = fs.readFileSync(jsonFile, 'utf8');
	let versionInfo = JSON.parse(data);
	let dir = path.join(localPath, versionInfo.versionStr);
	return dir;
}

// 获取所有文件
function getAllFiles(dir, allFiles, rootLocalPath) {
	allFiles = allFiles || [];
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const filePath = path.join(dir, file);
		if (fs.statSync(filePath).isDirectory()) {
			getAllFiles(filePath, allFiles, rootLocalPath);
		} else {
			const relationPath = path.relative(rootLocalPath, filePath);
			allFiles.push({ filePath, relationPath });
		}
	}
	return allFiles;
}

async function uploadFiles(allFiles, rootLocalPath) {
	console.log('开始上传:', allFiles.length);
	let total = allFiles.length;
	let maxIns = 8;
	let preIns = Math.ceil(total / maxIns);
	let ins = [];
	for (let i = 0; i < allFiles.length; i += preIns) {
		const files = allFiles.slice(i, i + preIns);
		console.log(`创建上传实例${i}: 文件数: ${files.length}`);
		ins.push(new upload(rootLocalPath, remoteDir, config, files, i));
	}
	let results = await Promise.all(ins.map((i) => i.connectAndUpload()));
	// 统计results
	console.log('上传结果', results);

	console.log(
		'上传完成',
		results.reduce((pre, cur) => {
			return pre + cur;
		}),
		0
	);
	ins.forEach((i) => i.disconnect());
}

// 主函数
async function main() {
	try {
		let dir = getDir();
		// 获取所有文件
		let allFiles = getAllFiles(dir, [], dir);
		await uploadFiles(allFiles, dir);
		console.log('所有任务完成');
	} catch (err) {
		console.error('操作失败:', err.message);
	} finally {
		console.log('连接已关闭');
	}
}

main();
