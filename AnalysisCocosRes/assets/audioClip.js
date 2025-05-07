let utils = require('../utils/utils.js');
let path = require('path');
let { File } = require('../bundle/pack.js');
let fs = require('fs');

class AudioClip {
	export(assetInfo, destDir, bundleName, bundlePath) {
		let relationPath = assetInfo.path;
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
				let destAsset = path.join(destDir, bundleName, `${relationPath}${ext}`);

				if (fs.existsSync(srcAsset)) {
					utils.copyDirOrFile(srcAsset, destAsset);
				}
			}
		}
	}
}

let audioClip = new AudioClip();
module.exports = audioClip;