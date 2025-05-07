let utils = require('../utils/utils.js');
let path = require('path');
let { File } = require('../bundle/pack.js');

class AnimationClip {
	export(assetInfo, destDir, bundleName, bundlePath) {
		// TODO: 动画剪辑打包
		// let packInfo = assetInfo.packInfo;

		// if (packInfo) {
		// 	let info = packInfo[File.Instances];
		// 	if (info) {
		// 		let jsonData = info[0][4];
		// 		let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.json`);
		// 		utils.writeFileSync(destAsset, JSON.stringify(jsonData));
		// 	}
		// } else {
		// 	let relationPath = assetInfo.path;
		// 	let uuid = assetInfo.uuid;
		// 	let nativeVer = assetInfo.ver;

		// 	let srcAsset = path.join(bundlePath, `native/${uuid.slice(0, 2)}/${uuid}.json`);
		// 	if (nativeVer) {
		// 		srcAsset = path.join(bundlePath, `native/${uuid.slice(0, 2)}/${uuid}.${nativeVer}.json`);
		// 	}
		// 	let destAsset = path.join(destDir, bundleName, `${relationPath}.json`);
		// 	utils.copyDirOrFile(srcAsset, destAsset);
		// }
	}
}

let animationClip = new AnimationClip();
module.exports = animationClip;


