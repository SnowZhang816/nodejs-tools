import { Mail } from "./mail.js";
import axios from "axios";
import tinify from "tinify";
import * as fs from "node:fs";
import { compressTread } from "./compressThread.js";
import * as path from "node:path";

const extras = [".png", ".jpg", ".jpeg", ".webp"]

interface FileInfo {
    path: string;
    originSize: number;
    compressSize: number;
}

export class TinyPng {
    mail: Mail = new Mail();

    files: FileInfo[] = [];
    maxThread: number = 10;
    threadStatus: Map<compressTread, boolean> = new Map();

    isInCreateKey = false;

    constructor() {
        for (let i = 1; i <= this.maxThread; i++) {
            this.threadStatus.set(new compressTread(), false);
        }
    }

    getIdleThread(): compressTread | null {
        let thread = null;
        this.threadStatus.forEach((v, k) => {
            if (!v) {
                thread = k;
            }
        });
        return thread;
    }

    async run(dir: string) {
        let files: FileInfo[] = [];
        this.getFiles(dir, files);
        this.files = files;
        console.log("files total", files.length);
        if (files.length <= 0) {
            console.log("no files");
            this.endCompress();
            return;
        }

        let keys = await this.getNewKey();
        if (keys && keys.length > 0) {
            tinify.key = keys && keys[0] || "";
            // tinify.key = 'cT0H0R4cc2CyyYJPL9fqHXpkhq7V7VLR';
            this.startCompress();
        } else {
            console.error("get key fail");
            this.endCompress();
        }
    }

    async getNewKey() {
        this.isInCreateKey = true;
        let mailAddress = await this.mail.getMailAddress();
        if (!mailAddress) {
            console.error("get mail address fail");
            return;
        }

        let result = await this.registerAccount(mailAddress, mailAddress);
        if (!result) {
            console.error("register account fail");
            return;
        }

        let link = await this.mail.activeAccount();
        if (!link && link === undefined) {
            console.error("active account fail");
            return;
        }

        let params = await this.activeAccount(link);
        if (!params) {
            console.error("active account and get id fail");
            return;
        }

        console.log("id", params.cookie, params.id);

        let authorization = await this.getAuthorization(params.id, params.cookie || "");
        if (!authorization) {
            console.error("get authorization fail");
            return;
        }
        let keys = await this.getKeys(authorization);
        if (keys.length <= 0) {
            console.error("get keys fail");
            return;
        }

        console.log("keys", keys);
        this.isInCreateKey = false;
        return keys;
    }


    async registerAccount(fullName: string, mail: string) {
        console.log("register account");
        let res = await axios.post("https://tinypng.com/web/api", {
            fullName: fullName,
            mail: mail
        },
            {
                headers: {
                    "X-Forwarded-For": Array(4)
                        .fill(1)
                        .map(() => parseInt(String(Math.random() * 254 + 1)))
                        .join("."),
                },
            });

        console.log("res", res);
        return res.status === 200;
    }

    async activeAccount(link: string) {
        console.log("active account");
        let res = await axios.get(link);

        console.log("activeAccount", res);

        if (res.status === 200) {
            let id = res.data.id;
            let cookieStr1 = res.headers["set-cookie"] ? res.headers["set-cookie"][0] : '';
            let cookie1 = cookieStr1.split(";")[0];
            let cookieStr2 = res.headers["set-cookie"] ? res.headers["set-cookie"][1] : '';
            let cookie2 = cookieStr2.split(";")[0];
            // let cookie = cookieStr.split(";")[0];
            return { id: id, cookie: cookie1 + ";" + cookie2 };
        }
        return null;
    }

    async getAuthorization(id: string, cookie: string) {
        console.log("cookie", cookie);
        console.log("id", id);

        // let dashboard = await axios.get(`https://tinypng.com/dashboard/api`, {
        //     headers: {
        //         "Set-Cookie": `sess=${cookie}`,
        //     },
        // });

        // console.log("dashboard", dashboard);

        let session = await axios.get(`https://tinify.com/web/session`, {
            headers: {
                "Cookie": `${cookie}`,
            },
        });
        if (session.status !== 200) {
            console.log("session get fail");
            return "";
        }
        console.log("session", session);
        let token = session.data.token || '';
        return token;
    }

    async getKeys(authorization: string): Promise<string[]> {
        console.log("authorization", authorization);

        let api = await axios.get(`https://api.tinify.com/api`, {
            headers: {
                "Authorization": `Bearer ${authorization}`,
            },
        });
        if (api.status !== 200) {
            console.log("api get fail");
            return [];
        }

        console.log("api", api);
        let keys = []
        if (api.data.keys.length > 0) {
            for (let i = 0; i < api.data.keys.length; ++i) {
                let keyInfo = api.data.keys[i];
                if (keyInfo.state === "active") {
                    keys.push(keyInfo.key);
                }
            }
        }

        if (keys.length === 0) {
            console.log("no api key");
            return this.getKeys(authorization);
        } else {
            return keys;
        }
    }

    getFiles(dir: string, files: FileInfo[] = []) {
        fs.readdirSync(dir, { recursive: true, withFileTypes: true }).forEach((file: any) => {
            console.log("file", file);
            if (!file.isDirectory() && extras.includes(path.extname(file.name))) {
                // this.getFiles(file.path);
                let fileStat = fs.statSync(`${file.path}/${file.name}`);
                files.push({ path: `${file.path}/${file.name}`, originSize: fileStat.size, compressSize: fileStat.size });
            }
        });
        return files;
    }

    startCompress() {
        let count = Math.min(this.maxThread, this.files.length)
        for (let i = 0; i < count; ++i) {
            this.trtCompress();
        }
    }

    trtCompress() {
        let key = this.getIdleThread();
        let file = this.files.shift();
        if (file && key) {
            this.compress(key, file);
        } else {
            let isIdle = true;
            for (let [key, value] of this.threadStatus.entries()) {
                if (value) {
                    isIdle = false;
                    break;
                }
            }
            if (isIdle) {
                this.endCompress();
            }
        }
    }

    async compress(thread: compressTread, file: FileInfo) {
        this.threadStatus.set(thread, true);

        console.log(`${file.path} compress start`);
        let result = await thread.start(file.path);

        this.threadStatus.set(thread, false);

        if (result.result) {
            console.log(`${file.path} compress success`);
        } else {
            console.log(`${file.path} compress fail and add to queue`);
            this.files.push(file);

            if (result.code === 429 && !this.isInCreateKey) {
                let keys = await this.getNewKey();
                if (keys && keys.length > 0) {
                    tinify.key = keys && keys[0] || "";
                    // tinify.key = 'cT0H0R4cc2CyyYJPL9fqHXpkhq7V7VLR';
                    this.startCompress();
                } else {
                    console.error("get key fail");
                    this.endCompress();
                }
            }
        }

        this.trtCompress();
    }

    async endCompress() {
        console.log("end compress");
        process.exit(0);
    }
}