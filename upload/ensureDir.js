let dirPromise = {};
async function ensureRemoteDir(sftp, dir) {
	const exists = await sftp.exists(dir);
	if (!exists) {
		// console.log(`远程目录不存在，正在创建：${dir}`);
		if (!dirPromise[dir]) {
			let promise = sftp.mkdir(dir); // `true` 表示递归创建目录
			dirPromise[dir] = promise;
			await promise; // `true` 表示递归创建目录
		} else {
			await dirPromise[dir];
		}
		// console.log(`远程目录创建成功：${dir}`);
	} else {
		// console.log(`远程目录已存在：${dir}`);
	}
}

module.exports = ensureRemoteDir;
