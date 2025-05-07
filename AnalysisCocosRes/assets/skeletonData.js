let utils = require('../utils/utils.js');
let path = require('path');
let { File } = require('../bundle/pack.js');
let fs = require('fs');

class SkeletonData {
	export(assetInfo, destDir, bundleName, bundlePath) {
		let packInfo = assetInfo.packInfo;
		if (packInfo) {
			let info = packInfo[File.Instances];
			if (info) {
				let jsonData = info[0][4];
				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.json`);
				utils.writeFileSync(destAsset, JSON.stringify(jsonData));
			}
		} else {
			let relationPath = assetInfo.path;
			let uuid = assetInfo.uuid;
			let importVer = assetInfo.ver;

			let srcAsset = path.join(bundlePath, `import/${uuid.slice(0, 2)}/${uuid}.json`);
			if (importVer) {
				srcAsset = path.join(bundlePath, `import/${uuid.slice(0, 2)}/${uuid}.${importVer}.json`);
			}
			let destAsset = path.join(destDir, bundleName, `${relationPath}.json`);
			if (fs.existsSync(srcAsset)) {
				utils.copyDirOrFile(srcAsset, destAsset);
			}
		}
	}
}

let skeletonData = new SkeletonData();
module.exports = skeletonData;