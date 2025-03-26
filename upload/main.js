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
let localPath = 'D:\\JenkensWork\\out\\1.0.2';
if (args[0]) {
	localPath = args[0];
}
let remoteDir = '/data/front/gxfc_game/1.0.22/';
if (args[1]) {
	remoteDir = args[1];
}
remoteDir = remoteDir.replace(/\\/g, '/');

// 获取所有文件
function getAllFiles(dir, allFiles) {
	allFiles = allFiles || [];
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const filePath = path.join(dir, file);
		if (fs.statSync(filePath).isDirectory()) {
			getAllFiles(filePath, allFiles);
		} else {
			const relationPath = path.relative(localPath, filePath);
			allFiles.push({ filePath, relationPath });
		}
	}
	return allFiles;
}

async function uploadFiles(allFiles) {
	// 每50个文件则创建一个上传实例
	console.log('开始上传:', allFiles.length);
	let total = allFiles.length;
	let maxIns = 8;
	let preIns = Math.ceil(total / maxIns);
	let ins = [];
	for (let i = 0; i < allFiles.length; i += preIns) {
		const files = allFiles.slice(i, i + preIns);
		console.log(`创建上传实例${i}: 文件数: ${files.length}`);
		ins.push(new upload(localPath, remoteDir, config, files, i));
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
		// 获取所有文件
		let allFiles = getAllFiles(localPath);
		await uploadFiles(allFiles);
		console.log('所有任务完成');
	} catch (err) {
		console.error('操作失败:', err.message);
	} finally {
		console.log('连接已关闭');
	}
}

main();
