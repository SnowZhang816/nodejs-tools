/*
 * @Author: 炒粉 380304468@qq.com
 * @Date: 2024-01-03 17:17:42
 * @LastEditors: 炒粉 380304468@qq.com
 * @LastEditTime: 2024-10-12 16:37:19
 * @FilePath: \tinypng-autoApi\src\emailCreator\mailTM.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Mailjs from '@cemalgnlts/mailjs';
import logger from '../logger';
import MailBase from './mailBase';
const mailjs = new Mailjs();

/** 临时邮箱 https://docs.mail.tm */
class MailTM extends MailBase {
    /** 注册临时邮箱 */
    async getMailAddress() {
        try {
            logger.info(`注册临时邮箱`);
            const acc = await mailjs.createOneAccount();
            console.log(acc);
            // If there is a error.
            if (!acc?.status) {
                logger.error(JSON.stringify(acc));

                // Show the cause of the error.
                logger.error(acc.message);
                return '';
            }
            logger.info(JSON.stringify(acc.data));
            return acc.data.username;
        } catch (error) {
            console.log(error);
        }
        return '';
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
        let data = await mailjs.getMessages();
        if (!data.status) {
            logger.error(data.message);
        }
        return data.data;
    }

    /**
     * 从邮箱提取激活链接
     * @param mailId 邮件id
     * @returns
     */
    async getLinkUrlFromMessage(mailId: string) {
        let res = await mailjs.getSource(mailId);
        if (!res.status) return null;
        let mailContent = res.data.data;
        let url = mailContent.match(/https:\/\/tinypng.com\/login.*redirect=\/dashboard\/api/)?.[0];
        if (url) {
            return url;
        }
        return null;
    }

    // async main() {
    //   // 创建临时邮箱
    //   const { username, password } = await createTempMail();

    //   // 通过临时邮箱申请tinypng api key
    //   await TinifyUtil.requestApiKey(password, username);

    //   let loop = () => {
    //     setTimeout(async () => {
    //       let list = await getMessages();
    //       if (!list.length) {
    //         loop();
    //         return;
    //       }
    //       logger.info(`邮箱列表：`);
    //       logger.info(list);
    //       for (let msg of list) {
    //         let res = await mailjs.getSource(msg.id);
    //         if (!res.status) continue;
    //         let mailContent = res.data.data;
    //         let url = mailContent.match(
    //           /https:\/\/tinypng.com\/login.*redirect=\/dashboard\/api/
    //         )?.[0];
    //         if (url) {
    //           // axios.get(url);
    //         }
    //       }
    //     }, 2000);
    //   };
    //   loop();
    // }
}
const mailTm = new MailTM();
// mailTm.getMailAddress();
export default mailTm;

// main();
// getMessages().then((e) => {
//   logger.info(e);
// });
// TinifyUtil.getKeys(`Bearer NzW8jfTCKXF3nBpbttGlnB6B8blL0gZHPpqxGFSYmKk6VsX6`);
