const Client = require('ssh2-sftp-client');
const path = require('path');
const ensureRemoteDir = require('./ensureDir.js');

class upload {
	maxConnections = 9;
	curConnections = 0;
	waitList = [];
	executeList = [];
	files = [];

	localPath = '';
	remoteDir = '';
	config = {};

	count = 0;

	tag = '';

	constructor(localPath, remoteDir, config, files, tag) {
		this.client = new Client();
		this.config = Object.assign(this.config, config);
		this.localPath = localPath;
		this.remoteDir = remoteDir;
		this.files = files;
		this.tag = tag;
	}

	async connect() {
		await this.client.connect(this.config);
	}

	async connectAndUpload() {
		await this.client.connect(this.config);
		return await this.uploadFiles(this.files);
	}

	disconnect() {
		this.client.end();
	}

	async ensureRemoteDir(dir) {
		await ensureRemoteDir(this.client, dir);
	}

	async task(info) {
		// console.log(`开始任务：${info.filePath}`);
		let remoteDir = this.remoteDir;
		let fileInfo = info;
		let localFilePath = fileInfo.filePath;
		let remoteFilePath = remoteDir + fileInfo.relationPath;
		remoteFilePath = remoteFilePath.replace(/\\/g, '/');
		let remoteFileDir = path.dirname(remoteFilePath);
		remoteFileDir = remoteFileDir.replace(/\\/g, '/');
		let relationRemotePath = path.relative(remoteDir, remoteFileDir);
		relationRemotePath = relationRemotePath.replace(/\\/g, '/');
		let dirs = relationRemotePath.split('/');
		try {
			for (let i = 0; i < dirs.length; i++) {
				if (dirs[i]) {
					let dirPath = remoteDir + dirs.slice(0, i + 1).join('/');
					await this.ensureRemoteDir(dirPath);
				}
			}

			await this.client.put(localFilePath, remoteFilePath);
			// console.log(`完成任务 ${info.filePath}`);
			this.count++;
		} catch (error) {
			console.error(`任务失败：${info.filePath}`, error);
		}
	}

	async uploadFiles(files) {
		let executing = this.executeList;
		for (let i = 0; i < files.length; i++) {
			const promise = this.task(files[i]).then(() => {
				// 从执行队列中移除已完成的任务
				executing.splice(executing.indexOf(promise), 1);
				this.curConnections--;  // 任务完成后减少计数
			});

			executing.push(promise);
			this.curConnections++;

			// 如果当前执行的任务数达到最大并发限制，则等待其中一个完成
			if (this.curConnections >= this.maxConnections) {
				await Promise.race(executing);
			}
		}

		await Promise.all(executing);
		console.log(`上传实例${this.tag}, 完成${this.count} 个文件`);

		return this.count;
	}
}

module.exports = upload;
