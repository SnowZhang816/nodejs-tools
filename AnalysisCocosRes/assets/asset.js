let utils = require('../utils/utils.js');
let path = require('path');
const { File } = require('../deserialize/deserialize.js')
let fs = require('fs');

class Asset {

	export(assetInfo, destDir, bundleName, bundlePath) {
		let uuid = assetInfo.uuid;
		let nativeVer = assetInfo.nativeVer;

		let packInfo = assetInfo.packInfo
		if (packInfo) {
			let info = packInfo[File.Instances];
			if (info) {
				let ext = info[0][2];
				let srcAsset = path.join(bundlePath, `native/${uuid.slice(0, 2)}/${uuid}${ext}`);
				if (nativeVer) {
					srcAsset = path.join(bundlePath, `native/${uuid.slice(0, 2)}/${uuid}.${nativeVer}${ext}`);
				}
				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}${ext}`);
				if (fs.existsSync(srcAsset)) {
					utils.copyDirOrFile(srcAsset, destAsset);
				}
			}
		} else {
			let importVer = assetInfo.ver;
			let importAsset = path.join(bundlePath, `import/${uuid.slice(0, 2)}/${uuid}.json`);
			if (importVer) {
				importAsset = path.join(bundlePath, `import/${uuid.slice(0, 2)}/${uuid}.${importVer}.json`);
			}
			if (fs.existsSync(importAsset)) {
				let data = fs.readFileSync(importAsset, 'utf8');
				let json = JSON.parse(data);
				let info = json[File.Instances];
				if (info) {
					let ext = info[0][2];
					let srcAsset = path.join(bundlePath, `native/${uuid.slice(0, 2)}/${uuid}${ext}`);
					if (nativeVer) {
						srcAsset = path.join(bundlePath, `native/${uuid.slice(0, 2)}/${uuid}.${nativeVer}${ext}`);
					}

					let destAsset = path.join(destDir, bundleName, `${assetInfo.path}${ext}`);
					if (fs.existsSync(srcAsset)) {
						utils.copyDirOrFile(srcAsset, destAsset);
					}
				}
			}

		}
	}
}

let asset = new Asset();
module.exports = asset;