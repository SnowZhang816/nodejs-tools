let utils = require('../utils/utils.js');
let path = require('path');
let fs = require('fs');
const { File, deserialize } = require('../deserialize/deserialize.js')

class PhysicsMaterial {
	export(assetInfo, destDir, bundleName, bundlePath) {
		let packInfo = assetInfo.packInfo
		if (packInfo) {
			let rootIndex = deserialize.parseInstances(packInfo);
			let instances = packInfo[File.Instances];
			if (instances && instances[rootIndex]) {
				let jsonData = instances[rootIndex];
				let data = {
					"__type__": "cc.PhysicsMaterial"
				}
				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.pmtl`);
				utils.writeFileSync(destAsset, JSON.stringify(data, null, '\t'));

				// mate
				let { GetMetaVersion } = require('../utils/MateVersionHelp.js');
				let version = GetMetaVersion('cc.PhysicsMaterial');
				let json = {
					"ver": version,
					"uuid": assetInfo.uuid,
					"importer": "physics-material",
					"friction": jsonData._friction,
					"restitution": jsonData._restitution,
					"subMetas": {}
				}

				let metaDestAsset = path.join(destDir, bundleName, `${assetInfo.path}.pmtl.meta`);
				utils.writeFileSync(metaDestAsset, JSON.stringify(json, null, "\t"));
			}
		}
	}
}

let physicsMaterial = new PhysicsMaterial();
module.exports = physicsMaterial;
