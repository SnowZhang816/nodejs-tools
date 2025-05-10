let utils = require('../utils/utils.js');
let path = require('path');
const { File } = require('../deserialize/deserialize.js')
let fs = require('fs');

class BitmapFont {
	export(assetInfo, destDir, bundleName, bundlePath) {
		let packInfo = assetInfo.packInfo
		if (packInfo) {
			let info = packInfo[File.Instances];
			if (info) {
				let jsonData = info[0][3];
				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.fnt`);
				utils.writeFileSync(destAsset, JSON.stringify(jsonData));
			}
		} else {
			let relationPath = assetInfo.path;
			let uuid = assetInfo.uuid;
			let nativeVer = assetInfo.nativeVer;

			let srcAsset = path.join(bundlePath, `native/${uuid.slice(0, 2)}/${uuid}.fnt`);
			if (nativeVer) {
				srcAsset = path.join(bundlePath, `native/${uuid.slice(0, 2)}/${uuid}.${nativeVer}.fnt`);
			}
			let destAsset = path.join(destDir, bundleName, `${relationPath}.fnt`);
			utils.copyDirOrFile(srcAsset, destAsset);
		}
	}
}

let bitmapFont = new BitmapFont();
module.exports = bitmapFont;