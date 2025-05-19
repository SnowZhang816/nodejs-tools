let utils = require('../utils/utils.js');
let path = require('path');
const { File } = require('../deserialize/deserialize.js')
const { deserialize } = require('../deserialize/deserialize.js');
let fs = require('fs');

class Material {
	create() {
		let jsonData = {};
		jsonData.__type__ = 'cc.Material';
		jsonData._objFlags = 0;
		jsonData._native = '';
		jsonData._effectAsset = null;
		return jsonData;
	}

	export(assetInfo, destDir, bundleName, bundlePath) {
		let packInfo = assetInfo.packInfo
		if (packInfo) {
			let rootIndex = deserialize.parseInstances(packInfo);
			let instances = packInfo[File.Instances];
			if (instances && instances[rootIndex]) {
				let jsonData = instances[rootIndex];
				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.mtl`);
				utils.writeFileSync(destAsset, JSON.stringify(jsonData, null, '\t'));


				// mate
				let { GetMetaVersion } = require('../utils/MateVersionHelp.js');
				let version = GetMetaVersion('cc.Material');
				let json = {
					"ver": version,
					"uuid": assetInfo.uuid,
					"importer": "material",
					"dataAsSubAsset": null,
					"subMetas": {}
				}

				let metaDestAsset = path.join(destDir, bundleName, `${assetInfo.path}.mtl.meta`);
				utils.writeFileSync(metaDestAsset, JSON.stringify(json, null, "\t"));
			}
		}
	}
}


let material = new Material();
module.exports = material;