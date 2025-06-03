let utils = require('../utils/utils.js');
let path = require('path');
let fs = require('fs');
const { File, deserialize } = require('../deserialize/deserialize.js')

class TextAsset {
	export(assetInfo, destDir, bundleName, bundlePath) {
		let packInfo = assetInfo.packInfo
		if (packInfo) {
			let rootIndex = deserialize.parseInstances(packInfo);
			let instances = packInfo[File.Instances];
			if (instances && instances[rootIndex]) {
				let jsonData = instances[rootIndex];

				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.text`);
				utils.writeFileSync(destAsset, jsonData.text);


				// mate
				let { GetMetaVersion } = require('../utils/MateVersionHelp.js');
				let version = GetMetaVersion('cc.TextAsset');
				let json = {
					"ver": version,
					"uuid": assetInfo.uuid,
					"importer": "text",
					"subMetas": {}
				}

				let metaDestAsset = path.join(destDir, bundleName, `${assetInfo.path}.ttf.meta`);
				utils.writeFileSync(metaDestAsset, JSON.stringify(json, null, "\t"));
			}
		}
	}
}

let textAsset = new TextAsset();
module.exports = textAsset;
