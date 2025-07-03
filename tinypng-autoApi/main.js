'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const tinifyUtil_1 = __importDefault(require('./tinifyUtil'));
const path_1 = __importDefault(require('path'));
const fs_1 = __importDefault(require('fs'));
const crypto_1 = __importDefault(require('crypto'));
const logger_1 = __importDefault(require('./logger'));
const PromiseQueue_1 = __importDefault(require('./PromiseQueue'));
let cacheJson = path_1.default.join(__dirname, `cache.json`);
let inputPath = path_1.default.join(__dirname, '../input');
class Main {
	constructor() {
		this.keys = [];
		this.conf = {
			/** 获取key所需时间，单位秒，0为自动计算 */
			keyTime: 0,
			/** 是否开启缓存 */
			cache: false,
			// 需要处理的文件后缀
			Exts: ['.jpg', '.png', '.webp', '.jpeg'],
			// 单文件大小限制
			Max: 5200000, // 5MB == 5242848.754299136
			/** 缓存keys */
			keyCache: false,
			/** 失败列表重试次数 */
			failRetry: 3,
		};
		this.cacheKeyList = [];
		this.usingKeys = [];
		this.fileList = [];
		this.bigList = [];
		this.startTimeStamp = 0;
	}
	/** 流程开始 */
	async run() {
		logger_1.default.info(`\n-------------------------------------------`);
		logger_1.default.info(`流程开始`);
		// 从命令行获取图片目录
		let i = process.argv.findIndex((i) => i === '-input');
		if (i !== -1) {
			inputPath = process.argv[i + 1];
		}
		// 从命令行获取key超时时间 单位秒
		let keyTimeFromCmd = process.argv.findIndex((i) => i === '-keyTime');
		if (keyTimeFromCmd !== -1) {
			this.conf.keyTime = parseFloat(process.argv[keyTimeFromCmd + 1]);
		}
		// 存在缓存路径
		// let cacheJsonPath = path.join(inputPath, "../imgCache.json");
		// let hasCacheJson = fs.existsSync(cacheJsonPath);
		// if (hasCacheJson) {
		//   cacheJson = cacheJsonPath;
		//   this.conf.cache = true;
		// }
		logger_1.default.info(`开启缓存：` + this.conf.cache);
		// await TinifyUtil.createNewApiKey();
		// return;
		this.startTimeStamp = Date.now();
		logger_1.default.info(`筛选图片`);
		this.fileFilter(inputPath);
		logger_1.default.info(`根据大小降序排列`);
		// 根据大小降序排列
		let newList = this.fileList.sort((a, b) => b.originalSize - a.originalSize);
		let cacheList = [];
		// 开启缓存
		if (this.conf.cache) {
			// 获取md5缓存
			let data = fs_1.default.readFileSync(cacheJson, 'utf-8');
			cacheList = JSON.parse(data);
			// 过滤存在缓存的文件
			newList = newList.filter((e) => {
				let cacheIndex = cacheList.findIndex((e2) => e2.path === e.relatePath);
				if (cacheIndex >= 0) {
					if (cacheList[cacheIndex].md5 !== e.md5) {
						cacheList.splice(cacheIndex, 1);
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}
			});
		}
		logger_1.default.info(`开始压缩`);
		logger_1.default.info(`总数量:${newList.length}`);
		if (!newList.length) {
			this.runEnd(newList, cacheList);
			return;
		}
		this.keys = [];
		let totalKeyNum = Math.ceil(newList.length / 500);
		logger_1.default.info(`需要使用的key数量：${totalKeyNum}`);
		// 使用缓存key
		if (this.conf.keyCache) {
			this.keys = await this.getKeysFromCache(totalKeyNum);
			logger_1.default.info('使用缓存key列表', this.keys);
		}
		// 创建新的api key
		let newKey = true;
		if (this.keys.length < totalKeyNum || newKey) {
			logger_1.default.info(`需要创建key数量：${totalKeyNum - this.keys.length}`);
			// 获取key时间 每个key最多10分钟
			if (this.conf.keyTime === 0) {
				this.conf.keyTime = (totalKeyNum - this.keys.length) * 10 * 60;
			}
			let timer = setTimeout(() => {
				this.runEnd([], cacheList, false);
			}, this.conf.keyTime * 1000);
			console.warn(`\r-------------------------------------------\r`);
			console.warn(`如果 ${this.conf.keyTime}秒 还未获取足够key数，则结束流程`);
			console.warn(`\r-------------------------------------------\r`);
			await this.getKeysFromTinyPng(totalKeyNum);
			clearTimeout(timer);
		}
		logger_1.default.info(`keys列表`);
		logger_1.default.info(this.keys);
		// 用于缓存写入
		this.usingKeys = JSON.parse(JSON.stringify(this.keys));
		await tinifyUtil_1.default.setKeyList(this.keys);
		logger_1.default.info(`已获取足够数量key,开始压缩`);
		this.startCompress(newList, cacheList);
	}
	/** 流程结束 */
	runEnd(newList, cacheList, isSuc = true) {
		if (!isSuc) {
			logger_1.default.error('获取key超时,结束流程');
			process.exit(0);
		}
		if (this.conf.keyCache && this.usingKeys.length) {
			const now = new Date();
			const year = now.getFullYear();
			const month = now.getMonth() + 1;
			let needCacheList = this.usingKeys.map((key) => {
				return {
					key,
					year,
					month,
				};
			});
			this.cacheKeyList = this.cacheKeyList.concat(needCacheList);
			this.saveKeysCache(this.cacheKeyList);
		}
		let time = Date.now() - this.startTimeStamp;
		// 计算整体大小
		let originalSize = newList.map((e) => e.originalSize).reduce((pre, cur) => pre + cur, 0);
		let compressSize = newList.map((e) => e.compressSize).reduce((pre, cur) => pre + cur, 0);
		logger_1.default.info(`
      已对所有图片处理完成
      原大小：${this.formatBytes(originalSize)}, 
      压缩后大小：${this.formatBytes(compressSize)},
      优化比例: ${((1 - compressSize / originalSize) * 100).toFixed(2)}%        
      总耗时：${time} ms 
      `);
		if (this.bigList.length) {
			logger_1.default.info(`
        压缩限制，超过5MB的图片
        ${JSON.stringify(this.bigList)}
        `);
		}
		if (this.conf.cache) {
			let newCache = cacheList.concat(
				newList.map((e) => {
					return {
						path: e.relatePath,
						md5: e.md5,
					};
				})
			);
			fs_1.default.writeFileSync(cacheJson, JSON.stringify(newCache));
		}
		process.exit(0);
	}
	/**
	 * 从tinypng获取key
	 * @param needNum
	 */
	async getKeysFromTinyPng(needNum) {
		while (this.keys.length < needNum) {
			const keys = await tinifyUtil_1.default.createNewApiKey().catch((error) => {
				logger_1.default.error('Failed to create new API key:', error);
				return [];
			});
			if (keys.length > 0) {
				this.keys = this.keys.concat(keys);
				logger_1.default.info('当前key数量：' + this.keys.length);
				logger_1.default.info(`-------------------------------------------`);
			}
		}
	}
	/**
	 * 从缓存文件获取key
	 * @returns
	 */
	async getKeysFromCache(needNum) {
		return new Promise((resolve) => {
			const keyCachePath = path_1.default.join(__dirname, `keys.json`);

			console.log('keyCachePath:', keyCachePath);

			fs_1.default.readFile(keyCachePath, 'utf-8', async (err, data) => {
				if (err) {
					logger_1.default.error('Failed to read key cache:', err);
					resolve([]);
					return;
				}
				let list = JSON.parse(data);
				list = list.sort((a, b) => {
					if (a.year !== b.year) {
						return a.year - b.year; // 首先按年份排序
					} else {
						return a.month - b.month; // 如果年份相同，则按月份排序
					}
				});
				const now = new Date();
				const year = now.getFullYear();
				const month = now.getMonth() + 1;
				let canUseNum = 0;
				for (let i = 0; i < list.length; i++) {
					if (canUseNum >= needNum) break;
					const data = list[i];
					// 只要年份或月份不同,则认为是有效key
					if (data.year !== year || data.month !== month) {
						// 需要验证一下该key还是否有效
						const isValidated = await tinifyUtil_1.default.validateKey(data.key);
						if (!isValidated) {
							data.inValid = true;
							logger_1.default.info(`key失效：${data.key}`);
							continue;
						}
						canUseNum++;
					} else {
						break;
					}
				}
				// 过滤无效key
				list = list.filter((e) => !e.inValid);
				let canUseList = list.splice(0, canUseNum);
				this.cacheKeyList = list;
				let usingKeys = canUseList.map((e) => e.key);
				resolve(usingKeys);
			});
		});
	}
	/** 保存缓存key */
	saveKeysCache(data) {
		const keyCachePath = path_1.default.join(__dirname, `keys.json`);
		fs_1.default.writeFileSync(keyCachePath, JSON.stringify(data, null, "\t"));
	}
	/**
	 * 开始压缩文件列表中的文件。
	 *
	 * @param newList - 文件压缩信息对象数组。
	 * @param cacheList - 包含路径和md5的缓存文件信息对象数组。
	 * @returns 当压缩过程完成时返回一个promise。
	 *
	 * 该方法初始化一个结果对象以跟踪压缩文件的进度和数量。
	 * 然后创建一个任务队列来处理 `newList` 中的文件。如果有需要重试的文件，
	 * 它会在第二个任务队列中处理它们。最后，它调用 `runEnd` 来完成整个过程。
	 */
	async startCompress(newList, cacheList) {
		let result = {
			max: newList.length,
			count: 0,
			progress: '0',
		};
		let retryList = [];
		await this.createTaskQueue(newList, result, retryList);
		logger_1.default.info(`首次压缩完成，已完成数量：${result.count},总数量:${result.max},总进度:${result.progress}%`);
		let failRetry = this.conf.failRetry;
		while (failRetry--) {
			if (retryList.length) {
				logger_1.default.info(`存在重试列表,数量为 ${result.max - result.count} ,当前为第${this.conf.failRetry - failRetry}次重试`);
				let retryListNext = [];
				await this.createTaskQueue(retryList, result, retryListNext);
				retryList = retryListNext;
				logger_1.default.info(`重试压缩完成，已完成数量：${result.count},总数量:${result.max},总进度:${result.progress}%`);
			}
		}
		this.runEnd(newList, cacheList);
	}
	/**
	 * 创建用于压缩文件的任务队列。
	 *
	 * @param newList - 要处理的文件压缩信息对象数组。
	 * @param result - 包含已处理文件数量、进度百分比和最大文件数量的对象。
	 * @param retryList - 用于存储需要重试的文件压缩信息对象的数组。
	 * @returns 当队列中的所有任务完成时返回一个promise。
	 */
	async createTaskQueue(newList, result, retryList) {
		return new Promise((resolve) => {
			logger_1.default.info(`开始创建任务队列`);
			const promiseQueue = new PromiseQueue_1.default(20);
			promiseQueue.onAllCompleted(() => {
				logger_1.default.info('当前任务队列完成');
				resolve(true);
			});
			// 监听key是否正在创建中，是则暂停任务队列
			tinifyUtil_1.default.setKeyChangingCallback((isChanging) => {
				isChanging ? promiseQueue.pause() : promiseQueue.resume();
			});
			/** 任务完成回调 */
			const onTaskSuccess = (data) => {
				let outPath = data.fullFilePath;
				let fileStat = fs_1.default.statSync(outPath);
				data.compressSize = fileStat.size;
				result.count++;
				result.progress = ((result.count / result.max) * 100).toFixed(2);
				let log = `
            ------------------------------------------------------------------------------------------------------------
            压缩成功
            原始大小: ${this.formatBytes(data.originalSize)}
            压缩大小: ${this.formatBytes(data.compressSize)}
            优化比例: ${((1 - data.compressSize / data.originalSize) * 100).toFixed(2)}%
            文件：${outPath}
            完成数量:${result.count},总数量:${result.max}
            总进度:${result.progress}%
            总耗时:${Date.now() - this.startTimeStamp} ms
            ------------------------------------------------------------------------------------------------------------
            `;
				console.log(log);
			};
			// 添加任务到队列
			for (let i = 0; i < newList.length; i++) {
				const data = newList[i];
				promiseQueue.addTask({
					taskFn: () => tinifyUtil_1.default.compressImage(data.fullFilePath),
					onSuccess: () => onTaskSuccess(data),
					onFail: (error) => {
						logger_1.default.error(error + ` -----文件：${data.fullFilePath}`);
						retryList.push(data);
					},
				});
			}
		});
	}
	/**
	 * 筛选可以进行压缩的文件
	 * @param folder
	 */
	fileFilter(folder) {
		// 读取文件夹
		fs_1.default.readdirSync(folder).forEach((file) => {
			let fullFilePath = path_1.default.join(folder, file);
			// 读取文件信息
			let fileStat = fs_1.default.statSync(fullFilePath);
			// 过滤文件安全性/大小限制/后缀名
			if (fileStat.isFile() && this.conf.Exts.includes(path_1.default.extname(file))) {
				if (fileStat.size > this.conf.Max) {
					this.bigList.push(fullFilePath);
				} else {
					let buffer = fs_1.default.readFileSync(fullFilePath);
					let md5 = this.MD5(buffer);
					this.fileList.push({
						relatePath: fullFilePath.replace(inputPath, ''),
						fullFilePath,
						md5,
						originalSize: fileStat.size,
						compressSize: fileStat.size,
					});
				}
			}
			// 递归处理文件夹
			else if (fileStat.isDirectory()) this.fileFilter(fullFilePath);
		});
	}
	formatBytes(bytes, decimals = 2) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}
	MD5(buffer) {
		const hash = crypto_1.default.createHash('md5');
		hash.update(buffer);
		let md5 = hash.digest('hex');
		return md5;
	}
}
const main = new Main();
// TinifyUtil.createNewApiKey();
// main.getKeysForCompress(5);
main.run();
// node ./main.ts -input D:\develop\NodeJs\nodejs-tools\tinypng\src
