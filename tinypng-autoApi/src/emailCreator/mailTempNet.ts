import ora from 'ora';
import puppeteer from 'puppeteer';
import logger from '../logger';
import MailBase from './mailBase';

/** 临时邮箱 https://www.mailtemp.net/ */
class MailTempNet extends MailBase {
    intervalId: any = undefined;
    _email: string = '';
    _page!: puppeteer.Page;

    /**
     * 获取邮件地址
     *
     * @returns 返回获取到的邮件地址
     */
    async getMailAddress() {
        // logger.info(`打开浏览器`);
        const spinner = ora(`尝试获取邮箱地址,请稍等`);
        spinner.start();
        const browser = await puppeteer.launch();
        // 独立cookie,相当于新号
        const context = await browser.createIncognitoBrowserContext();
        let page = await context.newPage();
        // let page = await browser.newPage();
        this._page = page;

        await this._page.goto('https://www.mailtemp.net/', {
            timeout: 0,
            waitUntil: 'domcontentloaded'
        });

        // 等待元素出现
        let selector = 'div font';
        await page.waitForFunction(
            (selector: any) => {
                const element = document.querySelector(selector);
                if (element) {
                    const textContent = element.textContent.trim();
                    return textContent !== ''; // 如果元素文本不为空，则返回true
                }
                return false; // 如果元素不存在，则返回false继续等待
            },
            { timeout: 0, polling: 100 },
            selector
        );

        // 现在可以安全地获取文本值了
        const emailTextValue = await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            return element ? element.textContent.trim() : null;
        }, selector);
        spinner.stop();
        logger.info('获取到邮箱：' + emailTextValue);
        this._email = emailTextValue;
        return this._email;
    }

    /**
     * 获取邮箱消息
     *
     * @returns 邮箱消息链接，若未找到则返回undefined
     */
    async getActiveLink(): Promise<string> {
        return new Promise(async (resolve) => {
            const spinner = ora(`尝试获取激活链接,请稍等`);
            spinner.start();

            try {
                await this._page.reload({
                    timeout: 10 * 1000,
                    waitUntil: 'domcontentloaded'
                });
            } catch (error) {
                logger.error(error);
                // eslint-disable-next-line no-promise-executor-return
                return this.getActiveLink();
            }

            // 等待元素出现
            let selector = '[id*="message-"]';
            await this._page.waitForFunction(
                (selector: any) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const textContent = element.textContent.trim();
                        return textContent !== ''; // 如果元素文本不为空，则返回true
                    }
                    return false; // 如果元素不存在，则返回false继续等待
                },
                { timeout: 0, polling: 100 },
                selector
            );
            const textContent = await this._page.evaluate((selector) => {
                const element = document.querySelector(selector);
                return element ? element.textContent.trim() : null;
            }, selector);

            // 关闭浏览器
            let browser = this._page.browser();
            browser.process()?.kill(`SIGINT`);
            await browser.close();

            spinner.stop();
            let link = textContent.match(/(https:\/\/tinypng.com\/login\?token=[^\s]+)/g)?.[0];
            logger.info('获取到激活链接：' + link);
            resolve(link);
        });
    }

    getEmail() {
        return this._email;
    }

    test() {
        this.getMailAddress();
    }
}

const mailTempNet = new MailTempNet();
// mailTempNet.test();
export default mailTempNet;
