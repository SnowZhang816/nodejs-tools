let utils = require('../utils/utils.js');
let path = require('path');
const { File, deserialize } = require('../deserialize/deserialize.js')
let fs = require('fs');

class JsonAsset {
	export(assetInfo, destDir, bundleName, bundlePath) {
		let packInfo = assetInfo.packInfo
		if (packInfo) {
			let rootIndex = deserialize.parseInstances(packInfo);
			let instances = packInfo[File.Instances];
			if (instances && instances[rootIndex]) {
				let jsonData = instances[rootIndex];
				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.json`);
				utils.writeFileSync(destAsset, JSON.stringify(jsonData.json, null, "\t"));

				// mate
				let { GetMetaVersion } = require('../utils/MateVersionHelp.js');
				let version = GetMetaVersion('cc.JsonAsset');
				let json = {
					"ver": version,
					"uuid": assetInfo.uuid,
					"importer": "json",
					"subMetas": {}
				}

				let metaDestAsset = path.join(destDir, bundleName, `${assetInfo.path}.json.meta`);
				utils.writeFileSync(metaDestAsset, JSON.stringify(json, null, "\t"));

			}
		}
	}
}


let jsonAsset = new JsonAsset();
module.exports = jsonAsset;