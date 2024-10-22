
import ora from 'ora';
import puppeteer, { Page } from 'puppeteer';

export class Mail {
    page: Page | null = null;

    public async getMailAddress(): Promise<string> {
        const spinner = ora("Get mail address...");
        spinner.start();

        const browser = await puppeteer.launch({ headless: true });
        const context = await browser.createBrowserContext();
        let page = await context.newPage();
        this.page = page;
        await page.goto('https://www.mailtemp.net/', {
            timeout: 0,
            waitUntil: 'domcontentloaded',
        });

        let selector = "div font";
        await page.waitForFunction((selector: any) => {
            const element = document.querySelector(selector);
            if (element) {
                const text = element.textContent?.trim();
                console.log('getMailAddress', text);
                return text !== "";
            }
            return false;
        }, {
            timeout: 0,
            polling: 100,
        }, selector);

        const value = await page.evaluate((selector: any) => {
            const element = document.querySelector(selector);
            return element?.textContent?.trim();
        }, selector);

        // browser.close();

        spinner.stop();

        console.log(`邮箱地址: ${value}`);

        return value;
    }

    public async activeAccount(): Promise<string> {
        const spinner = ora("Active account...");
        spinner.start();
        try {
            await this.page?.reload({ timeout: 10 * 1000, waitUntil: 'domcontentloaded' });
        } catch (error) {
            return this.activeAccount();
        }

        // let value = '';
        let selector = '[id*="message-"]';
        await this.page?.waitForFunction((selector: any) => {
            const elements = document.querySelectorAll('iframe');
            for (let element of elements) {
                console.log('element.srcdoc', element.srcdoc);
                let text = element.srcdoc?.match(/(https:\/\/tinypng.com\/login\?token=[^\s]+)/g);
                if (text) {
                    console.log('activeAccount', text);
                    return true;
                }
            }
            return false;
        }, {
            timeout: 0,
            polling: 1000,
        }, selector);

        const value = await this.page?.evaluate((selector: any) => {
            const elements = document.querySelectorAll('iframe');
            for (let element of elements) {
                console.log('element.srcdoc', element.srcdoc);
                let matches = element.srcdoc?.match(/(https:\/\/tinypng.com\/login\?token=[^\s]+)/g);
                if (matches && matches.length > 0) {
                    return matches[0];
                }
            }
        }, selector);

        console.log(`激活链接: ${value}`);

        spinner.stop();

        return value || "";
    }
}