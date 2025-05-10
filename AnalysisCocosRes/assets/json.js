let utils = require('../utils/utils.js');
let path = require('path');
const { File } = require('../deserialize/deserialize.js')
let fs = require('fs');

class JsonAsset {
	export(assetInfo, destDir, bundleName, bundlePath) {
		let packInfo = assetInfo.packInfo
		if (packInfo) {
			let info = packInfo[File.Instances];
			if (info) {
				let jsonData = info[0][2];
				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.json`);
				utils.writeFileSync(destAsset, JSON.stringify(jsonData, null, "\t"));
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


let jsonAsset = new JsonAsset();
module.exports = jsonAsset;