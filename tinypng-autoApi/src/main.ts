import TinifyUtil from './tinifyUtil';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import logger from './logger';
import PromiseQueue from './PromiseQueue';
let cacheJson = path.join(__dirname, `cache.json`);
let inputPath = path.join(__dirname, '../input');
// 直接覆盖原图
// let outputPath = path.join(__dirname, "output");

export interface IKeyCacheInfo {
    /** key token */
    key: string;
    /** 上次使用年份 */
    year: number;
    /** 上次使用月份 */
    month: number;
    /** 已失效 */
    inValid?: boolean;
}
export interface IFileCompressInfo {
    relatePath: string;
    fullFilePath: string;
    md5: string;
    originalSize: number;
    compressSize: number;
}
class Main {
    keys: string[] = [];
    conf = {
        /** 获取key所需时间，单位秒，0为自动计算 */
        keyTime: 0,
        /** 是否开启缓存 */
        cache: false,
        // 需要处理的文件后缀
        Exts: ['.jpg', '.png', '.webp', '.jpeg'],
        // 单文件大小限制
        Max: 5200000, // 5MB == 5242848.754299136
        /** 缓存keys */
        keyCache: true,
        /** 失败列表重试次数 */
        failRetry: 3
    };
    cacheKeyList: IKeyCacheInfo[] = [];
    usingKeys: string[] = [];
    fileList: IFileCompressInfo[] = [];
    bigList: string[] = [];

    startTimeStamp: number = 0;

    /** 流程开始 */
    async run() {
        logger.info(`\n-------------------------------------------`);
        logger.info(`流程开始`);
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
        logger.info(`开启缓存：` + this.conf.cache);

        // await TinifyUtil.createNewApiKey();
        // return;
        this.startTimeStamp = Date.now();

        logger.info(`筛选图片`);
        this.fileFilter(inputPath);
        logger.info(`根据大小降序排列`);
        // 根据大小降序排列
        let newList = this.fileList.sort((a, b) => b.originalSize - a.originalSize);

        let cacheList: { path: string; md5: string }[] = [];
        // 开启缓存
        if (this.conf.cache) {
            // 获取md5缓存
            let data = fs.readFileSync(cacheJson, 'utf-8');
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

        logger.info(`开始压缩`);
        logger.info(`总数量:${newList.length}`);

        if (!newList.length) {
            this.runEnd(newList, cacheList);
            return;
        }

        this.keys = [];
        let totalKeyNum = Math.ceil(newList.length / 500);
        logger.info(`需要使用的key数量：${totalKeyNum}`);

        // 使用缓存key
        if (this.conf.keyCache) {
            this.keys = await this.getKeysFromCache(totalKeyNum);
        }

        // 创建新的api key
        if (this.keys.length < totalKeyNum) {
            logger.info(`需要创建key数量：${totalKeyNum - this.keys.length}`);
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

        logger.info(`keys列表`);
        logger.info(this.keys);
        // 用于缓存写入
        this.usingKeys = JSON.parse(JSON.stringify(this.keys));
        await TinifyUtil.setKeyList(this.keys);
        logger.info(`已获取足够数量key,开始压缩`);

        this.startCompress(newList, cacheList);
    }

    /** 流程结束 */
    runEnd(
        newList: IFileCompressInfo[],
        cacheList: {
            path: string;
            md5: string;
        }[],
        isSuc: boolean = true
    ) {
        if (!isSuc) {
            logger.error('获取key超时,结束流程');
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
                    month
                };
            });
            this.cacheKeyList = this.cacheKeyList.concat(needCacheList);
            this.saveKeysCache(this.cacheKeyList);
        }

        let time = Date.now() - this.startTimeStamp;

        // 计算整体大小
        let originalSize = newList.map((e) => e.originalSize).reduce((pre, cur) => pre + cur, 0);
        let compressSize = newList.map((e) => e.compressSize).reduce((pre, cur) => pre + cur, 0);

        logger.info(
            `
      已对所有图片处理完成
      原大小：${this.formatBytes(originalSize)}, 
      压缩后大小：${this.formatBytes(compressSize)},
      优化比例: ${((1 - compressSize / originalSize) * 100).toFixed(2)}%        
      总耗时：${time} ms 
      `
        );

        if (this.bigList.length) {
            logger.info(
                `
        压缩限制，超过5MB的图片
        ${JSON.stringify(this.bigList)}
        `
            );
        }
        if (this.conf.cache) {
            let newCache = cacheList.concat(
                newList.map((e) => {
                    return {
                        path: e.relatePath,
                        md5: e.md5
                    };
                })
            );
            fs.writeFileSync(cacheJson, JSON.stringify(newCache));
        }
        process.exit(0);
    }

    /**
     * 从tinypng获取key
     * @param needNum
     */
    async getKeysFromTinyPng(needNum: number) {
        while (this.keys.length < needNum) {
            const keys = await TinifyUtil.createNewApiKey().catch((error) => {
                logger.error('Failed to create new API key:', error);
                return [];
            });
            if (keys.length > 0) {
                this.keys = this.keys.concat(keys);
                logger.info('当前key数量：' + this.keys.length);
                logger.info(`-------------------------------------------`);
            }
        }
    }

    /**
     * 从缓存文件获取key
     * @returns
     */
    async getKeysFromCache(needNum: number): Promise<string[]> {
        return new Promise((resolve) => {
            const keyCachePath = path.join(process.cwd(), `keys.json`);
            fs.readFile(keyCachePath, 'utf-8', async (err, data) => {
                if (err) {
                    logger.error('Failed to read key cache:', err);
                    resolve([]);
                    return;
                }
                let list: IKeyCacheInfo[] = JSON.parse(data);
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
                        const isValidated = await TinifyUtil.validateKey(data.key);
                        if (!isValidated) {
                            data.inValid = true;
                            logger.info(`key失效：${data.key}`);
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
    saveKeysCache(data: IKeyCacheInfo[]) {
        const keyCachePath = path.join(process.cwd(), `keys.json`);
        fs.writeFileSync(keyCachePath, JSON.stringify(data));
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
    async startCompress(
        newList: IFileCompressInfo[],
        cacheList: {
            path: string;
            md5: string;
        }[]
    ) {
        let result = {
            max: newList.length,
            count: 0,
            progress: '0'
        };
        let retryList: IFileCompressInfo[] = [];
        await this.createTaskQueue(newList, result, retryList);
        logger.info(`首次压缩完成，已完成数量：${result.count},总数量:${result.max},总进度:${result.progress}%`);

        let failRetry = this.conf.failRetry;
        while (failRetry--) {
            if (retryList.length) {
                logger.info(
                    `存在重试列表,数量为 ${result.max - result.count} ,当前为第${this.conf.failRetry - failRetry}次重试`
                );
                let retryListNext: IFileCompressInfo[] = [];
                await this.createTaskQueue(retryList, result, retryListNext);
                retryList = retryListNext;
                logger.info(
                    `重试压缩完成，已完成数量：${result.count},总数量:${result.max},总进度:${result.progress}%`
                );
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
    async createTaskQueue(
        newList: IFileCompressInfo[],
        result: { count: number; progress: string; max: number },
        retryList: IFileCompressInfo[]
    ) {
        return new Promise((resolve) => {
            logger.info(`开始创建任务队列`);
            const promiseQueue = new PromiseQueue<any>(20);
            promiseQueue.onAllCompleted(() => {
                logger.info('当前任务队列完成');
                resolve(true);
            });
            // 监听key是否正在创建中，是则暂停任务队列
            TinifyUtil.setKeyChangingCallback((isChanging) => {
                isChanging ? promiseQueue.pause() : promiseQueue.resume();
            });

            /** 任务完成回调 */
            const onTaskSuccess = (data: IFileCompressInfo) => {
                let outPath = data.fullFilePath;
                let fileStat = fs.statSync(outPath);
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
                const data: IFileCompressInfo = newList[i];
                promiseQueue.addTask({
                    taskFn: () => TinifyUtil.compressImage(data.fullFilePath),
                    onSuccess: () => onTaskSuccess(data),
                    onFail: (error) => {
                        logger.error(error + ` -----文件：${data.fullFilePath}`);
                        retryList.push(data);
                    }
                });
            }
        });
    }

    /**
     * 筛选可以进行压缩的文件
     * @param folder
     */
    fileFilter(folder: string) {
        // 读取文件夹
        fs.readdirSync(folder).forEach((file) => {
            let fullFilePath = path.join(folder, file);
            // 读取文件信息
            let fileStat = fs.statSync(fullFilePath);
            // 过滤文件安全性/大小限制/后缀名
            if (fileStat.isFile() && this.conf.Exts.includes(path.extname(file))) {
                if (fileStat.size > this.conf.Max) {
                    this.bigList.push(fullFilePath);
                } else {
                    let buffer = fs.readFileSync(fullFilePath);
                    let md5 = this.MD5(buffer);
                    this.fileList.push({
                        relatePath: fullFilePath.replace(inputPath, ''),
                        fullFilePath,
                        md5,
                        originalSize: fileStat.size,
                        compressSize: fileStat.size
                    });
                }
            }
            // 递归处理文件夹
            else if (fileStat.isDirectory()) this.fileFilter(fullFilePath);
        });
    }

    formatBytes(bytes: number, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    MD5(buffer: crypto.BinaryLike) {
        const hash = crypto.createHash('md5');
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
