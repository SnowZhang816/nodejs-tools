const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function zipFolder(sourceDir, outputPath) {
	const output = fs.createWriteStream(outputPath);
	const archive = archiver('zip', {
		zlib: { level: 9 } // 设置压缩级别（0-9）
	});

	return new Promise((resolve, reject) => {
		output.on('close', () => {
			console.log(`压缩完成，大小：${archive.pointer()} 字节`);
			resolve();
		});

		archive.on('error', err => reject(err));
		archive.pipe(output);

		// 递归添加文件夹内容
		archive.directory(sourceDir, false); // 第二个参数避免包含父文件夹
		archive.finalize();
	});
}

function findIndexJs(dir) {
	const files = fs.readdirSync(dir);
	const regex = /index(?:\.[a-f0-9]{5})?\.js/;
	for (const file of files) {
		if (regex.test(file)) {
			console.log('find index file', file);
			return path.join(dir, file); // 返回匹配的文件路径
		}
	}

	return null; // 如果没有匹配的文件，返回 null
}

async function bundleToZip(dir) {
	let files = fs.readdirSync(dir);
	let list = [];
	for (let i = 0; i < files.length; i++) {
		let bundleName = files[i];
		let filePath = path.join(dir, bundleName);
		if (fs.statSync(filePath).isDirectory()) {
			let indexJs = findIndexJs(filePath);
			if (indexJs) {
				let matchs = indexJs.match(/\.([a-f0-9]{5})\./i);
				let version = matchs ? matchs[1] : '';
				// 生成ZIP文件
				let outputFilePath = path.join(dir, `${bundleName}.zip`);
				if (version) {
					outputFilePath = path.join(dir, `${bundleName}.${version}.zip`);
				}
				console.log('zipBundle', outputFilePath);
				list.push(zipFolder(filePath, outputFilePath));
			}
		}
	}

	await Promise.all(list);
}

function findSWJs(dir) {
	console.log('find findSWJs', dir);
	const files = fs.readdirSync(dir);
	const regex = /sw(?:\.[a-f0-9]{5})?\.js/;
	for (const file of files) {
		if (regex.test(file)) {
			console.log('find sw file', file);
			return path.join(dir, file); // 返回匹配的文件路径
		}
	}

	return null; // 如果没有匹配的文件，返回 null
}

function installServiceWorker(dir) {
	console.log('installServiceWorker');
	let swPath = findSWJs(dir);
	if (swPath) {
		let version = swPath.match(/\.([a-f0-9]{5})\./i);
		console.log('sw版本：', version);
		let destPath = path.dirname(swPath);
		let newFileName = path.join(destPath, `sw.js`);
		fs.renameSync(swPath, newFileName);
		let htmlPath = path.join(dir, 'index.html');
		let data = fs.readFileSync(htmlPath, 'utf8');
		// 检查是否匹配成功
		if (version) {
			const regex = /\.\/sw(?:\.[a-f0-9]{5})?\.js/;
			if (regex.test(data)) {
				data = data.replace(regex, `./sw.js?=${version[1]}`);
				console.log('changeSw:', `./sw.js?=${version[1]}`);
			}
		}
		fs.writeFileSync(htmlPath, data);
	} else {
		console.error('找不到sw文件');
	}
}

function findCocos2dJs(dir) {
	console.log('find Cocos2dJs', dir);
	let result = {};
	const files = fs.readdirSync(dir);
	const regex = /^cocos2d-js(?:\.[a-f0-9]{5})?\.js$/; // 匹配 cocos2d-js.<MD5>.js 的正则表达式
	for (const file of files) {
		if (regex.test(file)) {
			console.log('find cocos2d-js.js file', file);
			result.cocos2djs = path.join(dir, file); // 返回匹配的文件路径
			break;
		}
	}

	const regex_min = /^cocos2d-js-min(?:\.[a-f0-9]{5})?\.js$/; // 匹配 cocos2d-js-min.<MD5>.js 的正则表达式
	for (const file of files) {
		if (regex_min.test(file)) {
			console.log('find cocos2d-js-min.js file', file);
			result.cocos2djs_min = path.join(dir, file); // 返回匹配的文件路径
			break;
		}
	}

	return result;
}

// 修改 cocos2d-js.xxxxx.js or cocos2d-js-min.xxxxx.js 目录到internal 包
function changeCocosJsDir(buildPath) {
	let htmlPath = path.join(buildPath, 'index.html');
	let data = fs.readFileSync(htmlPath, 'utf8');
	let result = findCocos2dJs(buildPath);
	let cocos2djsPath = result.cocos2djs;
	if (cocos2djsPath) {
		// 拷贝到 internal
		let fileName = path.basename(result.cocos2djs);

		let destPath = path.join(buildPath, 'assets/internal');
		fs.renameSync(cocos2djsPath, path.join(destPath, fileName));

		const regex = /cocos2d-js(?:\.[a-f0-9]{5})?\.js/;
		if (regex.test(data)) {
			let finalPath = `assets/internal/${fileName}`;
			data = data.replace(regex, `${finalPath}`);

			console.log('changeCocosJsDir:', finalPath);
		}
	}

	let cocos2djs_minPath = result.cocos2djs_min;
	if (cocos2djs_minPath) {
		// 拷贝到 internal
		let fileName = path.basename(result.cocos2djs_min);
		let destPath = path.join(buildPath, 'assets/internal');
		fs.renameSync(cocos2djs_minPath, path.join(destPath, fileName));

		const regex_min = /cocos2d-js-min(?:\.[a-f0-9]{5})?\.js/;
		if (regex_min.test(data)) {
			let finalPath = `assets/internal/${fileName}`;
			data = data.replace(regex_min, `${finalPath}`);
			console.log('changeCocosJsDir:', finalPath);
		}
	}

	fs.writeFileSync(htmlPath, data);
}

module.exports = {
	bundleToZip,
	installServiceWorker,
	changeCocosJsDir
};
