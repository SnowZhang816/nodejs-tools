const ObsClient = require("esdk-obs-nodejs")
const path = require('path'); // 添加 path 模块引用
const fs = require('fs'); // 添加 path 模块引用
const { config } = require("dotenv");
const crypto = require('crypto');
const core = require('@huaweicloud/huaweicloud-sdk-core');
const cdn = require('@huaweicloud/huaweicloud-sdk-cdn');

class upload {

    bucket = "learn-s"
    bucketPath = '';
    client = null
    executing = []
    maxConnections = 100
    curConnections = 0
    completed = 0

    constructor(env) {
        config({ path: path.join(__dirname, `env/.env.${env}`) });

        console.log(`当前环境: BUCKET：${process.env.BUCKET}, BUCKET_PATH: ${process.env.BUCKET_PATH}, 
            ACCESS_KEY_ID: ${process.env.ACCESS_KEY_ID}, SECRET_ACCESS_KEY: ${process.env.SECRET_ACCESS_KEY}, SERVER: ${process.env.BUCKET_SERVER}`)

        this.bucket = process.env.BUCKET;
        this.bucketPath = process.env.BUCKET_PATH;

        this.client = new ObsClient({
            access_key_id: process.env.ACCESS_KEY_ID,
            secret_access_key: process.env.SECRET_ACCESS_KEY,
            server: process.env.BUCKET_SERVER
        })

        process.setMaxListeners(0)
    }

    async getObject(Key, SaveAsFile) {
        try {
            const params = {
                // 指定存储桶名称
                Bucket: this.bucket,
                // 指定对象名，此处以 example/objectname 为例
                Key,
                // 指定下载对象的目标路径
                SaveAsFile
            };

            // 文件下载对象
            const result = await this.client.getObject(params);
            if (result.CommonMsg.Status <= 300) {
                console.log("Get object(%s) under the bucket(%s) successful!", params.Key, params.Bucket);
                console.log("RequestId: %s", result.CommonMsg.RequestId);
                return true;
            };
            console.log("An ObsError was found, which means your request sent to OBS was rejected with an error response.");
            console.log("Status: %d", result.CommonMsg.Status);
            console.log("Code: %s", result.CommonMsg.Code);
            console.log("Message: %s", result.CommonMsg.Message);
            console.log("RequestId: %s", result.CommonMsg.RequestId);
            return false;
        } catch (error) {
            console.log("An Exception was found, which means the client encountered an internal problem when attempting to communicate with OBS, for example, the client was unable to access the network.");
            console.log(error);
        };
    };

    async putFile(Key, srcFile) {
        try {
            console.log(`上传文件: ${srcFile} 到桶: ${this.bucket}, 路径: ${Key}`)
            const params = {
                // 指定存储桶名称
                Bucket: this.bucket,
                // 指定对象名，此处以 example/objectname 为例
                Key: this.bucketPath ? this.bucketPath + "/" + Key : Key,
                // 指定文本对象
                SourceFile: srcFile
            };
            // 文本上传对象
            const result = await this.client.putObject(params);
            if (result.CommonMsg.Status <= 300) {
                console.log("upload (%s) to the bucket(%s) successful!!", params.Key, params.Bucket);
                // console.log("RequestId: %s", result.CommonMsg.RequestId);
                // console.log("StorageClass:%s, ETag:%s", result.InterfaceResult.StorageClass, result.InterfaceResult.ETag);
                this.completed++;
                return;
            };



            console.log("An ObsError was found, which means your request sent to OBS was rejected with an error response.");
            console.log("Status: %d", result.CommonMsg.Status);
            console.log("Code: %s", result.CommonMsg.Code);
            console.log("Message: %s", result.CommonMsg.Message);
            console.log("RequestId: %s", result.CommonMsg.RequestId);
        } catch (error) {
            console.log("An Exception was found, which means the client encountered an internal problem when attempting to communicate with OBS, for example, the client was unable to access the network.");
            console.log(error);
        };
    };

    async _putObject(Key, file) {
        // 如果当前执行的任务数达到最大并发限制，则等待其中一个完成
        if (this.curConnections >= this.maxConnections) {
            await Promise.race(this.executing);
        }
        // const promise = this.putObject(Key, Body).finally(() => {
        // 	// 从执行队列中移除已完成的任务
        // 	this.executing.splice(this.executing.indexOf(promise), 1);
        // 	this.curConnections--;
        // });

        const promise = this.putFile(Key, file).finally(() => {
            // 从执行队列中移除已完成的任务
            this.executing.splice(this.executing.indexOf(promise), 1);
            this.curConnections--;
        });

        this.curConnections++;
        this.executing.push(promise);

        return promise;
    }

    async _uploadDir(root, dir) {
        let all = [];
        let files = fs.readdirSync(dir);
        for (let i = 0; i < files.length; i++) {
            let file = path.join(dir, files[i]);
            if (fs.statSync(file).isDirectory()) {
                all.push(this._uploadDir(root, file));
            } else {
                let relationPath = path.relative(root, path.join(dir, files[i]));
                relationPath = relationPath.replace(/\\/g, '/');
                all.push(this._putObject(relationPath, file));
            }
        }
        return Promise.all(all);
    }

    getFileMD5(file) {
        const data = fs.readFileSync(file);
        const md5 = crypto.createHash('md5');
        md5.update(data, 'utf8');
        let md5Hex = md5.digest('hex');
        return md5Hex;
    }

    async checkFileNeedRefresh(dir, htmlFile) {
        if (htmlFile) {
            let htmlPath = path.join(dir, htmlFile);
            let md5Hex = this.getFileMD5(htmlPath);
            console.log(`文件: ${htmlFile} 的MD5为：${md5Hex}`);

            let relationPath = path.relative(dir, htmlPath);
            let remoteFile = this.bucketPath + "/" + relationPath
            let saveFile = path.join(__dirname, `temp/${remoteFile}`);
            let value = await this.getObject(remoteFile, saveFile);
            if (value) {
                let remoteMD5 = this.getFileMD5(saveFile);
                console.log(`远程文件: ${remoteFile} 的MD5为：${remoteMD5}`);
                if (md5Hex === remoteMD5) {
                    console.log(`文件: ${htmlFile} 未修改，无需上传`);
                    return false;
                }
            }
        }
        return true;
    }

    async refreshFile(key) {
        const credentials = new core.GlobalCredentials()
            .withAk(process.env.ACCESS_KEY_ID)
            .withSk(process.env.SECRET_ACCESS_KEY)

        const client = cdn.CdnClient.newBuilder().withCredential(credentials).withRegion(cdn.CdnRegion.valueOf("ap-southeast-1")).build();
        const request = new cdn.CreateRefreshTasksRequest();
        const body = new cdn.RefreshTaskRequestBody();
        body.type = 'file';
        body.url = `https://res.xevogames.com/${process.env.BUCKET_PATH}/${key}`;

        request.withBody(body);

        try {
            let response = await client.createRefreshTasks(request);
            if (response) {
                console.log(`刷新文件: ${key} 成功`);
            } else {
                console.log(`刷新文件: ${key} 失败`);
            }
        } catch (error) {
            console.log("An ObsError of refreshFile was found.", error);
        }

        // let response = await fetch('https://iam.myhuaweicloud.com/v3/auth/tokens', {
        //     method: 'POST',
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({
        //         "auth": {
        //             "identity": {
        //                 "methods": ["password"],
        //                 "password": {
        //                     "user": {
        //                         "name": "haihui",
        //                         "password": "zhh123456",
        //                         "domain": {
        //                             "name": "hid_d4o8we_umb4ljqv"
        //                         }
        //                     }
        //                 }
        //             },
        //             "scope": {
        //                 "domain": {
        //                     "name": "hid_d4o8we_umb4ljqv"
        //                 }
        //             }
        //         }
        //     })
        // });

        // if (response) {
        //     console.log(response);
        //     let data = await response.json();
        //     let st = response.status

        //     console.log(response.statusText)
        // }
    }

    async uploadDir(dir) {
        let htmlFiles = [];
        let files = this.getAllFiles(dir, dir, [], htmlFiles);

        let refresh = await this.checkFileNeedRefresh(dir, htmlFiles[0]);

        console.log(`${files.length}个文件待上传`)
        await this._uploadDir(dir, dir);
        console.log(`${files.length}个文件需要上传, 完成${this.completed} 个文件`);

        if (true || refresh) {
            this.refreshFile(htmlFiles[0]);
        }
    }

    getAllFiles(dir, rootLocalPath, allFiles, htmlFiles) {
        allFiles = allFiles || [];
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                this.getAllFiles(filePath, rootLocalPath, allFiles);
            } else {
                const relationPath = path.relative(rootLocalPath, filePath);
                allFiles.push({ filePath, relationPath });

                if (/\.html$/.test(relationPath)) {
                    htmlFiles.push(relationPath);
                }
            }
        }
        return allFiles;
    }

    close() {
        this.client.close()
    }
}

module.exports = upload;