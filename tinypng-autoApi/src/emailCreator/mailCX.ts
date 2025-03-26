/*
 * @Author: 曾文煊 zengwenxuan@dele.com
 * @Date: 2024-10-18 09:57:33
 * @LastEditors: 曾文煊 zengwenxuan@dele.com
 * @LastEditTime: 2024-10-28 10:30:19
 * @FilePath: \casino-client\tools\tinypng-autoApi\src\emailCreator\mailCX.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: 炒粉 380304468@qq.com
 * @Date: 2024-01-03 17:17:42
 * @LastEditors: 炒粉 380304468@qq.com
 * @LastEditTime: 2024-10-12 16:36:32
 * @FilePath: \tinypng-autoApi\src\emailCreator\mailTM.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
import logger from '../logger';
import MailBase from './mailBase';

/** 临时邮箱 https://api.mail.cx */
class MailCX extends MailBase {
    host = `https://api.mail.cx/api/v1`;
    mailHosts = ['@qabq.com', '@nqmo.com', '@end.tw', '@uuf.me', '@yzm.de'];
    userData = {
        email: 'HkH3cE5yCa@qabq.com',
        auth: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mjg2MzA0MDl9.yeBOkNtS3n50vABLserbYx5YZ5C6UdB_aRqhVcPgQ-8'
    };

    /**
     * 生成随机字符串
     *
     * @param length 生成随机字符串的长度，默认为10
     * @returns 返回生成的随机字符串
     */
    generateRandomString(length: number = 10): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
    }

    async getToken() {
        const res = await axios.post(`${this.host}/auth/authorize_token`);
        return res.data;
    }

    /** 注册临时邮箱 */
    async getMailAddress() {
        logger.info(`注册临时邮箱`);
        let token = await this.getToken();
        let Authorization = `Bearer ${token}`;
        console.log(Authorization);
        this.userData.auth = Authorization;
        let user = this.generateRandomString();
        for (let i = 0; i < this.mailHosts.length; i++) {
            let _email = user + this.mailHosts[i];
            let res = await axios.get(`${this.host}/mailbox/${_email}`, {
                headers: { Authorization }
            });
            console.log(res.data);
            if (res?.data) {
                this.userData.email = _email;
                logger.info(`注册的邮箱为:${this.userData.email}`);
                break;
            }
        }
        return this.userData.email;
    }

    /** 提取链接 */
    async getActiveLink(): Promise<string> {
        // 轮询提取邮件
        return new Promise((res) => {
            let loop = () => {
                setTimeout(async () => {
                    let list = await this.getMessages();
                    if (!list.length) {
                        loop();
                        return;
                    }
                    for (let msg of list) {
                        // 从邮箱提取激活链接
                        let url = await this.getLinkUrlFromMessage(msg.id);
                        console.log(`从邮箱提取激活链接:${url}`);
                        if (!url) continue;
                        res(url);
                    }
                }, 2000);
            };
            loop();
        });
    }

    /** 获取临时邮箱邮件列表 */
    async getMessages() {
        let res = await axios.get(`${this.host}/mailbox/${this.userData.email}`, {
            headers: { Authorization: this.userData.auth }
        });
        let list = res?.data?.filter((e: { seen: boolean }) => e.seen === false);
        return list;
    }

    /**
     * 从邮箱提取激活链接
     * @param mailId 邮件id
     * @returns
     */
    async getLinkUrlFromMessage(mailId: string): Promise<string> {
        let res = await axios.get(`${this.host}/mailbox/${this.userData.email}/${mailId}`, {
            headers: { Authorization: this.userData.auth }
        });
        let content = res?.data?.body?.text;
        let url = content?.match(/https:\/\/tinypng.com\/login.*redirect=\/dashboard\/api/)?.[0];
        if (url) {
            return url;
        }
        return ``;
    }
}
const mailCx = new MailCX();
// mailCx.getMailAddress();
// mailCx.getLinkUrlFromMessage(`20241011T070239-5748`);
export default mailCx;
