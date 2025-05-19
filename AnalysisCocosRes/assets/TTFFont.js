let utils = require('../utils/utils.js');
let path = require('path');
let fs = require('fs');
const { File, deserialize } = require('../deserialize/deserialize.js')

class TTFFont {
	export(assetInfo, destDir, bundleName, bundlePath) {
		let packInfo = assetInfo.packInfo
		if (packInfo) {
			let rootIndex = deserialize.parseInstances(packInfo);
			let instances = packInfo[File.Instances];
			if (instances && instances[rootIndex]) {
				let jsonData = instances[rootIndex];
				let ext = jsonData._native;
				let relationPath = assetInfo.path;
				let uuid = assetInfo.uuid;
				let nativeVer = assetInfo.nativeVer;

				let srcAsset = path.join(bundlePath, `native/${uuid.slice(0, 2)}/${uuid}/${ext}`);
				if (nativeVer) {
					srcAsset = path.join(bundlePath, `native/${uuid.slice(0, 2)}/${uuid}.${nativeVer}/${ext}`);
				}
				let destAsset = path.join(destDir, bundleName, `${relationPath}.ttf`);
				utils.copyDirOrFile(srcAsset, destAsset);


				// mate
				let { GetMetaVersion } = require('../utils/MateVersionHelp.js');
				let version = GetMetaVersion('cc.TTFFont');
				let json = {
					"ver": version,
					"uuid": assetInfo.uuid,
					"importer": "ttf-font",
					"subMetas": {}
				}

				let metaDestAsset = path.join(destDir, bundleName, `${assetInfo.path}.ttf.meta`);
				utils.writeFileSync(metaDestAsset, JSON.stringify(json, null, "\t"));
			}
		}
	}
}

let tTFFont = new TTFFont();
module.exports = tTFFont;
