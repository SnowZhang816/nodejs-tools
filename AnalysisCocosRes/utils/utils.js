/**
 * uuid 是HexChars里面的字符串生成的。只有16个字符。需要4位表示
 * base64 是BASE64_KEYS里面的字符串生成的。只有64个字符。需要6位表示
 * uuid->base64 就是将3个uuid字符(12位)，转换成2个base64字符(12位)。第一个字符的4位+第二个字符的前2位组成base64的第一个字符，第二个字符的后2位+第三个字符4位组成base64的第二个字符。
 * base64->uuid 就是将2个base64字符(12位)，转换成3个uuid字符(12位)。
 * ex: fc991dd7-0033-4b80-9d41-c8a86a702e59 -> fcmR3XADNLgJ1ByKhqcC5Z
 */
const { randomInt } = require('crypto');
const fs = require('fs-extra');
const path = require('path');

var BASE64_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var BASE64_VALUES = new Array(123); // max char code in base64Keys
for (let i = 0; i < 123; ++i) {
	BASE64_VALUES[i] = 64; // fill with placeholder('=') index
}

for (let i = 0; i < 64; ++i) {
	let code = BASE64_KEYS.charCodeAt(i);
	BASE64_VALUES[code] = i;
}

var Base64Values = BASE64_VALUES;
var HexChars = '0123456789abcdef'.split('');
var _t = ['', '', '', ''];
var UuidTemplate = _t.concat(_t, '-', _t, '-', _t, '-', _t, '-', _t, _t, _t);
var Indices = UuidTemplate.map(function (x, i) {
	return x == '-' ? NaN : i;
}).filter(isFinite);

class Utils {

	/**
	 *	是否UUID 
	 */
	isUuid(uuid) {
		//uuid: fc991dd7-0033-4b80-9d41-c8a86a702e59
		return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid);
	}

	/**
	 * 根据当前的时间戳生产一个UUID
	 */
	generateUUID() {
		let date = new Date();
		let time = date.getTime() + date.getMilliseconds() + randomInt(100000000);
		let uuid = this.encodeUUID(time.toString(16));
		return uuid;
	}

	/**
	 * base64->uuid
	 * @param {*} base64
	 * @param {*} fixed 固定几位不变
	 * @returns
	 */
	decodeUUID = function (base64, fixed = 2) {
		if (base64.length !== 22) {
			return base64;
		}
		for (let i = 0; i < fixed; i++) {
			UuidTemplate[i] = base64[i];
		}

		for (var i = fixed, j = fixed; i < 22; i += 2) {
			var lhs = BASE64_VALUES[base64.charCodeAt(i)];
			var rhs = BASE64_VALUES[base64.charCodeAt(i + 1)];
			UuidTemplate[Indices[j++]] = HexChars[lhs >> 2];
			UuidTemplate[Indices[j++]] = HexChars[((lhs & 3) << 2) | (rhs >> 4)];
			UuidTemplate[Indices[j++]] = HexChars[rhs & 0xf];
		}
		return UuidTemplate.join('');
	};

	/**
	 * uuid->base64
	 * @param {*} uuid
	 * @param {*} fixed 固定几位不变
	 * @returns
	 */
	encodeUUID = function (uuid, fixed) {
		var encodeTmp = [];
		if (uuid.length !== 36) {
			return uuid;
		}

		for (let i = 0; i < fixed; i++) {
			encodeTmp[i] = uuid[i];
		}
		uuid = uuid.replace(/-/g, '');

		for (var i = fixed; i < uuid.length; i += 3) {
			var c1 = uuid.at(i);
			c1 = HexChars.indexOf(c1);
			var c2 = uuid.at(i + 1);
			c2 = HexChars.indexOf(c2);
			var c3 = uuid.at(i + 2);
			c3 = HexChars.indexOf(c3);

			var lhs = (c1 << 2) | (c2 >> 2);
			var rhs = ((c2 & 3) << 4) | c3;

			var Base64ValuesIndex1 = Base64Values.indexOf(lhs);
			var base1 = String.fromCharCode(Base64ValuesIndex1);

			var Base64ValuesIndex2 = Base64Values.indexOf(rhs);
			var base2 = String.fromCharCode(Base64ValuesIndex2);

			encodeTmp.push(base1);
			encodeTmp.push(base2);
		}
		return encodeTmp.join('');
	};

	ensurePathExist = function (origin, destDir) {
		let relative = path.relative(origin, destDir);
		let paths = relative.split(path.sep);
		let toPath = origin;
		for (let index = 0; index < paths.length; index++) {
			let str = paths[index];
			toPath = path.join(toPath, str);

			// 创建目标目录
			if (!fs.existsSync(toPath)) {
				fs.mkdirSync(toPath, { recursive: true });
			}
		}
	};

	/** 删除目录 */
	deleteFolderRecursive = function (folderPath) {
		if (fs.existsSync(folderPath)) {
			fs.readdirSync(folderPath).forEach((file) => {
				const curPath = path.join(folderPath, file);
				if (fs.lstatSync(curPath).isDirectory()) {
					// 递归删除子目录
					this.deleteFolderRecursive(curPath);
				} else {
					// 删除文件
					fs.unlinkSync(curPath);
				}
			});
			// 删除空目录
			fs.rmdirSync(folderPath);
		}
	};

	/** 拷贝目录或文件 */
	copyDirOrFile = function (srcDir, destDir) {
		// console.log('copyDir', srcDir, destDir);
		// 检查源目录是否存在
		if (!fs.existsSync(srcDir)) {
			console.error(`源目录不存在: ${srcDir}`);
			return;
		}

		let isFile = fs.lstatSync(srcDir).isFile();
		let destDirPath = isFile ? path.dirname(destDir) : destDir;

		// 创建目标目录
		if (!fs.existsSync(destDirPath)) {
			fs.mkdirSync(destDirPath, { recursive: true });
		}

		if (fs.lstatSync(srcDir).isDirectory()) {
			// 读取源目录中的所有文件/子目录
			const entries = fs.readdirSync(srcDir, { withFileTypes: true });

			for (const entry of entries) {
				const srcPath = path.join(srcDir, entry.name);
				const destPath = path.join(destDir, entry.name);

				if (entry.isDirectory()) {
					// 如果是目录，递归拷贝
					this.copyDirOrFile(srcPath, destPath);
				} else if (entry.isFile()) {
					// 如果是文件，拷贝文件
					fs.copyFileSync(srcPath, destPath);
				}
			}
		} else {
			fs.copyFileSync(srcDir, destDir);
		}
	};

	ensureDirExist = function (destDir) {
		let destDirPath = path.dirname(destDir);
		if (!fs.existsSync(destDirPath)) {
			fs.mkdirSync(destDirPath, { recursive: true });
		}
	}

	writeFileSync = function (destDir, data) {
		this.ensureDirExist(destDir);
		fs.writeFileSync(destDir, data);
	};
}

const utils = new Utils();

module.exports = utils;
