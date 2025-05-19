let utils = require('../utils/utils.js');
let path = require('path');
let fs = require('fs');
const { File, deserialize } = require('../deserialize/deserialize.js')

class Texture2D {
	export(assetInfo, destDir, bundleName, bundlePath) {
		// let packInfo = assetInfo.packInfo
		// if (packInfo) {
		// 	let rootIndex = deserialize.parseInstances(packInfo);
		// 	let info = packInfo[File.Instances];
		// 	if (info) {
		// 		let data = info[rootIndex];
		// 	}
		// }

		// let relationPath = assetInfo.path;
		// let uuid = assetInfo.uuid;
		// let nativeVer = assetInfo.nativeVer;

		// let srcAsset = path.join(bundlePath, `native/${uuid.slice(0, 2)}/${uuid}`);
		// if (nativeVer) {
		// 	srcAsset = path.join(bundlePath, `native/${uuid.slice(0, 2)}/${uuid}.${nativeVer}`);
		// }

		// let destAsset = path.join(destDir, bundleName, `${relationPath}`);
		// if (fs.existsSync(srcAsset + ".png")) {
		// 	utils.copyDirOrFile(srcAsset + ".png", destAsset + ".png");
		// } else if (fs.existsSync(srcAsset + ".jpg")) {
		// 	utils.copyDirOrFile(srcAsset + ".jpg", destAsset + ".jpg");
		// } else if (fs.existsSync(srcAsset + ".jpeg")) {
		// 	utils.copyDirOrFile(srcAsset + ".jpeg", destAsset + ".jpeg");
		// } else if (fs.existsSync(srcAsset + ".webp")) {
		// 	utils.copyDirOrFile(srcAsset + ".webp", destAsset + ".webp");
		// }
	}
}

let texture2D = new Texture2D();
module.exports = texture2D;
