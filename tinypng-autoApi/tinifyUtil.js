"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const tinify = require("tinify");
const querystring_1 = __importDefault(require("querystring"));
const mailUtil_1 = __importDefault(require("./mailUtil"));
const logger_1 = __importDefault(require("./logger"));
// 携带cookie
axios_1.default.defaults.withCredentials = true;
axios_1.default.defaults.timeout = 60000;
axios_1.default.defaults.httpsAgent = new https_1.default.Agent({
    keepAlive: true,
    timeout: 60000,
    scheduling: 'fifo'
});
// tinify.key = "HjYPmZgKxthrtWbs0Lzy5ytcMdvBfQsT";
/** tinypng 工具类 */
class TinifyUtil {
    constructor() {
        this.keys = [];
        /** 获取新key中 */
        this.isCreatingKey = false;
        this.curKey = '';
        /** 等待key更新再进行回调的队列 */
        this.waitNewKeyList = [];
        /** key改变中 回调 */
        this.onKeyChangingCallback = null;
    }
    /** 验证key */
    async validateKey(key) {
        return new Promise((resolve) => {
            tinify.key = key;
            tinify.validate((err) => {
                if (err) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    /** 设置key改变回调 */
    setKeyChangingCallback(callback) {
        this.onKeyChangingCallback = callback;
    }
    async setKeyList(list) {
        console.log(`设置key列表`);
        this.keys = list;
        await this.setNextKey();
    }
    async setNextKey() {
        return new Promise((res) => {
            setTimeout(() => {
                let key = this.keys.shift();
                if (key) {
                    tinify.key = key;
                    this.curKey = key;
                    logger_1.default.info(`设置key成功：${key}`);
                    res(true);
                }
                else {
                    res(false);
                }
            }, 1000);
        });
    }
    /** 创建新的api key */
    async createNewApiKey() {
        // 注册临时邮箱
        let email = await mailUtil_1.default.getMailAddress();
        // const { username, password } = await TempMailUtil.createTempMail();
        if (!email) {
            logger_1.default.error(`邮箱注册失败，请重试`);
            return [];
        }
        // 通过临时邮箱注册账号
        await this.registerUser(email, email);
        logger_1.default.info(`获取激活链接`);
        let link = await mailUtil_1.default.getActiveLink();
        if (!link) {
            logger_1.default.error(`获取激活链接失败，请重试`);
            return [];
        }
        let keyList = await this.activeLink(link);
        return keyList;
    }
    /** 激活链接 */
    async activeLink(url) {
        logger_1.default.info(`激活链接：${url}`);
        let res = await axios_1.default.get(url);
        let a = url.split('?');
        let params = querystring_1.default.parse(a[1]);
        let loginUrl = `${a[0]}?token=${params['token']}&new=false`;
        res = await axios_1.default.get(loginUrl);
        // logger.info(res.headers["set-cookie"]);
        let cookie = res.headers['set-cookie'];
        let newCookie = cookie === null || cookie === void 0 ? void 0 : cookie.map((e) => e.split(' ')[0]).join('');
        // logger.info(newCookie);
        res = await axios_1.default.get('https://tinify.com/web/session', {
            headers: {
                Cookie: newCookie
            }
        });
        let token = res.data.token;
        let auth = `Bearer ${token}`;
        // logger.info(`Authorization:${auth}`);
        // res = await this.addKeys(auth);
        let keyList = await this.getKeys(auth);
        logger_1.default.info(`成功获取密钥：${keyList}`);
        return keyList;
    }
    /** 注册账户 */
    async registerUser(fullName, mail) {
        var _a;
        logger_1.default.info(`注册tinypng账户:${mail}`);
        let res = await axios_1.default.post('https://tinypng.com/web/api', {
            fullName,
            mail
        }, {
            headers: {
                'X-Forwarded-For': Array(4)
                    .fill(1)
                    .map(() => parseInt(String(Math.random() * 254 + 1)))
                    .join('.')
            }
        });
        if ((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.error) {
            logger_1.default.error(res.data.message);
        }
        else {
            logger_1.default.info(`注册成功`);
        }
        return res;
    }
    /** 添加新密钥 */
    async addKeys(Authorization) {
        logger_1.default.info(`添加新密钥`);
        let res = await axios_1.default.post('https://api.tinify.com/api/keys', null, {
            headers: {
                Authorization
            }
        });
        // logger.info(res.data);
        return res.data;
    }
    /**
     * 获取密钥
     * @param Authorization Bearer NzW8jfTCKXF3nBpbttGlnB6B8blL0gZHPpqxGFSYmKk6VsX6
     */
    async getKeys(Authorization) {
        var _a;
        logger_1.default.info(`尝试获取密钥`);
        let res = await axios_1.default.get('https://api.tinify.com/api', {
            headers: {
                Authorization
            }
        });
        // logger.info(res.data);
        let data = res.data;
        if ((_a = data.keys) === null || _a === void 0 ? void 0 : _a.length) {
            const key = data.keys[0];
            // for (let key of data.keys) {
            let url = `https://api.tinify.com/api/keys/${key.key}`;
            await axios_1.default.patch(url, {
                state: 'active'
            }, {
                headers: {
                    Authorization
                }
            });
            // }
            let _res = await axios_1.default.get('https://api.tinify.com/api', {
                headers: {
                    Authorization
                }
            });
            let _data = _res.data;
            if (_data.keys) {
                let list = _data.keys.filter((e) => e.state === 'active').map((e) => e.key);
                return list;
            }
            return [];
        }
        return [];
    }
    async compressImage(fullFilePath) {
        const usingKey = this.curKey;
        return new Promise(async (resolve, reject) => {
            var _a, _b;
            try {
                const filePath = fullFilePath;
                const outputPath = fullFilePath;
                const source = tinify.fromFile(filePath);
                fs_1.default.mkdirSync(path_1.default.dirname(outputPath), { recursive: true });
                await source.toFile(outputPath);
                resolve(true);
            }
            catch (error) {
                if (this.isCreatingKey) {
                    logger_1.default.info(`Error: key更新中,当前key:${usingKey}`);
                    this.waitNewKeyList.push(() => {
                        reject(`Error: key更新中,当前key:${usingKey}`);
                    });
                    return;
                }
                if ((error === null || error === void 0 ? void 0 : error['status']) === 429) {
                    logger_1.default.info(`Error: key次数上限,当前key:${usingKey}`);
                    this.waitNewKeyList.push(() => {
                        reject(`Error: key次数上限,当前key:${usingKey}`);
                    });
                    // 当前key已过期，等待刷新
                    if (usingKey !== this.curKey) {
                        return;
                    }
                    (_a = this.onKeyChangingCallback) === null || _a === void 0 ? void 0 : _a.call(this, true);
                    this.isCreatingKey = true;
                    this.curKey = '';
                    logger_1.default.info(`key更新中,剩余数量：${this.keys.length},,当前key:${usingKey}`);
                    if (this.keys.length) {
                        const suc = await this.setNextKey();
                        if (!suc) {
                            let list = await this.createNewApiKey();
                            await this.setKeyList(list);
                        }
                    }
                    else {
                        let list = await this.createNewApiKey();
                        await this.setKeyList(list);
                    }
                    this.isCreatingKey = false;
                    logger_1.default.info(`继续执行压缩`);
                    this.waitNewKeyList.forEach((e) => {
                        e();
                    });
                    this.waitNewKeyList = [];
                    (_b = this.onKeyChangingCallback) === null || _b === void 0 ? void 0 : _b.call(this, false);
                }
                else {
                    logger_1.default.error(error);
                    reject(error);
                }
            }
        });
    }
}
const tinifyUtil = new TinifyUtil();
// tinifyUtil.createNewApiKey();
exports.default = tinifyUtil;
