const ObsClient = require("esdk-obs-nodejs")
const path = require('path'); // 添加 path 模块引用
const fs = require('fs'); // 添加 path 模块引用
const { config } = require("dotenv");

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

        this.bucket = process.env.BUCKET;
        this.bucketPath = process.env.BUCKET_PATH;

        this.client = new ObsClient({
            access_key_id: process.env.ACCESS_KEY_ID,
            secret_access_key: process.env.SECRET_ACCESS_KEY,
            server: process.env.SERVER
        })

        process.setMaxListeners(0)
    }

    async putFile(Key, srcFile) {
        try {
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

    async uploadDir(dir) {
        let files = this.getAllFiles(dir, dir);
        console.log(`${files.length}个文件待上传`)
        await this._uploadDir(dir, dir);
        console.log(`${files.length}个文件需要上传, 完成${this.completed} 个文件`);
    }

    getAllFiles(dir, rootLocalPath, allFiles) {
        allFiles = allFiles || [];
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                this.getAllFiles(filePath, rootLocalPath, allFiles);
            } else {
                const relationPath = path.relative(rootLocalPath, filePath);
                allFiles.push({ filePath, relationPath });
            }
        }
        return allFiles;
    }
}

module.exports = upload;