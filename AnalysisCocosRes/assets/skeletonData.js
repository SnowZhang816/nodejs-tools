let utils = require('../utils/utils.js');
let path = require('path');
const { File, deserialize } = require('../deserialize/deserialize.js')
let fs = require('fs');

class SkeletonData {
	export(assetInfo, destDir, bundleName, bundlePath) {
		let packInfo = assetInfo.packInfo;
		if (packInfo) {
			let rootIndex = deserialize.parseInstances(packInfo);
			let instances = packInfo[File.Instances];
			if (instances && instances[rootIndex]) {
				let jsonData = instances[rootIndex];
				let ext = ".json"
				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}${ext}`);
				utils.writeFileSync(destAsset, JSON.stringify(jsonData._skeletonJson));

				// mate
				let { GetMetaVersion } = require('../utils/MateVersionHelp.js');
				let version = GetMetaVersion('cc.SkeletonData');
				let json = {
					"ver": version,
					"uuid": assetInfo.uuid,
					"importer": "spine",
					"textures": [],
					"scale": 1,
					"subMetas": {}
				}
				for (let i = 0; i < jsonData.textures.length; ++i) {
					let texture = jsonData.textures[i];
					json.textures.push(texture.__uuid__);
				}

				let metaDestAsset = path.join(destDir, bundleName, `${assetInfo.path}${ext}.meta`);
				utils.writeFileSync(metaDestAsset, JSON.stringify(json, null, "\t"));

			}
		}
	}
}

let skeletonData = new SkeletonData();
module.exports = skeletonData;