import axios from 'axios';
import path from 'path';
import fs from 'fs';
import https from 'https';
import tinify = require('tinify');
import querystring from 'querystring';
import mailUtil from './mailUtil';
import logger from './logger';

// 携带cookie
axios.defaults.withCredentials = true;
axios.defaults.timeout = 60000;
axios.defaults.httpsAgent = new https.Agent({
    keepAlive: true,
    timeout: 60000,
    scheduling: 'fifo'
});

// tinify.key = "HjYPmZgKxthrtWbs0Lzy5ytcMdvBfQsT";

/** tinypng 工具类 */
class TinifyUtil {
    keys: string[] = [];
    /** 获取新key中 */
    isCreatingKey: boolean = false;
    curKey: string = '';
    /** 等待key更新再进行回调的队列 */
    waitNewKeyList: Function[] = [];

    /** 验证key */
    async validateKey(key: string) {
        return new Promise((resolve) => {
            tinify.key = key;
            tinify.validate((err) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    /** key改变中 回调 */
    onKeyChangingCallback: ((isChanging: boolean) => void) | null = null;
    /** 设置key改变回调 */
    setKeyChangingCallback(callback: (isChanging: boolean) => void) {
        this.onKeyChangingCallback = callback;
    }
    async setKeyList(list: string[]) {
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
                    logger.info(`设置key成功：${key}`);
                    res(true);
                } else {
                    res(false);
                }
            }, 1000);
        });
    }

    /** 创建新的api key */
    async createNewApiKey(): Promise<string[]> {
        // 注册临时邮箱
        let email = await mailUtil.getMailAddress();
        // const { username, password } = await TempMailUtil.createTempMail();
        if (!email) {
            logger.error(`邮箱注册失败，请重试`);
            return [];
        }
        // 通过临时邮箱注册账号
        await this.registerUser(email, email);
        logger.info(`获取激活链接`);
        let link = await mailUtil.getActiveLink();
        if (!link) {
            logger.error(`获取激活链接失败，请重试`);
            return [];
        }
        let keyList: string[] = await this.activeLink(link);
        return keyList;
    }

    /** 激活链接 */
    async activeLink(url: string) {
        logger.info(`激活链接：${url}`);
        let res = await axios.get(url);
        let a = url.split('?');
        let params = querystring.parse(a[1]);
        let loginUrl = `${a[0]}?token=${params['token']}&new=false`;
        res = await axios.get(loginUrl);
        // logger.info(res.headers["set-cookie"]);
        let cookie = res.headers['set-cookie'];
        let newCookie = cookie?.map((e) => e.split(' ')[0]).join('');
        // logger.info(newCookie);
        res = await axios.get('https://tinify.com/web/session', {
            headers: {
                Cookie: newCookie
            }
        });
        let token = res.data.token;
        let auth = `Bearer ${token}`;
        // logger.info(`Authorization:${auth}`);
        // res = await this.addKeys(auth);
        let keyList = await this.getKeys(auth);
        logger.info(`成功获取密钥：${keyList}`);
        return keyList;
    }

    /** 注册账户 */
    async registerUser(fullName: string, mail: string) {
        logger.info(`注册tinypng账户:${mail}`);
        let res = await axios.post(
            'https://tinypng.com/web/api',
            {
                fullName,
                mail
            },
            {
                headers: {
                    'X-Forwarded-For': Array(4)
                        .fill(1)
                        .map(() => parseInt(String(Math.random() * 254 + 1)))
                        .join('.')
                }
            }
        );
        if (res?.data?.error) {
            logger.error(res.data.message);
        } else {
            logger.info(`注册成功`);
        }
        return res;
    }

    /** 添加新密钥 */
    async addKeys(Authorization: string) {
        logger.info(`添加新密钥`);

        let res = await axios.post('https://api.tinify.com/api/keys', null, {
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
    async getKeys(Authorization: string) {
        logger.info(`尝试获取密钥`);

        let res = await axios.get('https://api.tinify.com/api', {
            headers: {
                Authorization
            }
        });
        // logger.info(res.data);

        let data: { keys?: [{ state: string; key: string }] } = res.data;
        if (data.keys?.length) {
            const key = data.keys[0];
            // for (let key of data.keys) {
            let url = `https://api.tinify.com/api/keys/${key.key}`;
            await axios.patch(
                url,
                {
                    state: 'active'
                },
                {
                    headers: {
                        Authorization
                    }
                }
            );
            // }
            let _res = await axios.get('https://api.tinify.com/api', {
                headers: {
                    Authorization
                }
            });
            let _data: { keys?: [{ state: string; key: string }] } = _res.data;
            if (_data.keys) {
                let list = _data.keys.filter((e) => e.state === 'active').map((e) => e.key);
                return list;
            }
            return [];
        }
        return [];
    }

    async compressImage(fullFilePath: string) {
        const usingKey = this.curKey;
        return new Promise(async (resolve, reject) => {
            try {
                const filePath = fullFilePath;
                const outputPath = fullFilePath;
                const source = tinify.fromFile(filePath);
                fs.mkdirSync(path.dirname(outputPath), { recursive: true });
                await source.toFile(outputPath);
                resolve(true);
            } catch (error: any) {
                if (this.isCreatingKey) {
                    logger.info(`Error: key更新中,当前key:${usingKey}`);
                    this.waitNewKeyList.push(() => {
                        reject(`Error: key更新中,当前key:${usingKey}`);
                    });
                    return;
                }
                if (error?.['status'] === 429) {
                    logger.info(`Error: key次数上限,当前key:${usingKey}`);
                    this.waitNewKeyList.push(() => {
                        reject(`Error: key次数上限,当前key:${usingKey}`);
                    });
                    // 当前key已过期，等待刷新
                    if (usingKey !== this.curKey) {
                        return;
                    }
                    this.onKeyChangingCallback?.(true);
                    this.isCreatingKey = true;
                    this.curKey = '';
                    logger.info(`key更新中,剩余数量：${this.keys.length},,当前key:${usingKey}`);
                    if (this.keys.length) {
                        const suc = await this.setNextKey();
                        if (!suc) {
                            let list = await this.createNewApiKey();
                            await this.setKeyList(list);
                        }
                    } else {
                        let list = await this.createNewApiKey();
                        await this.setKeyList(list);
                    }
                    this.isCreatingKey = false;
                    logger.info(`继续执行压缩`);
                    this.waitNewKeyList.forEach((e) => {
                        e();
                    });
                    this.waitNewKeyList = [];
                    this.onKeyChangingCallback?.(false);
                } else {
                    logger.error(error);
                    reject(error);
                }
            }
        });
    }
}

const tinifyUtil = new TinifyUtil();
// tinifyUtil.createNewApiKey();
export default tinifyUtil;
