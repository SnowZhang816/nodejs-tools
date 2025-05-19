let utils = require('../utils/utils.js');
let path = require('path');
const { File, deserialize, Refs } = require('../deserialize/deserialize.js')
const { findClass } = require('../deserialize/findClass.js');
let fs = require('fs');

let OptimizationPolicyTypes = [
	"AUTO",
	"SINGLE_INSTANCE",
	"MULTI_INSTANCE"
]

class Prefab {

	create() {
		let t = {
			"__type__": "cc.Prefab",
			"_name": "",
			"_objFlags": 0,
			"_native": "",
			"data": null,
			"optimizationPolicy": 0,
			"asyncLoadAssets": false,
			"readonly": false
		};
		return t;
	}

	extendRefToId(objs, t) {
		let data = t.data;
		if (data) {
			for (let i = 0; i < objs.length; ++i) {
				let obj = objs[i];
				if (obj === data) {
					t.data = {
						"__id__": i
					}
					break;
				}
			}
		}
	}

	export(assetInfo, destDir, bundleName, bundlePath) {
		let packInfo = assetInfo.packInfo
		if (packInfo) {
			let objs = []
			deserialize.parseInstances(packInfo, objs);
			this.exportInstances(assetInfo, packInfo, objs, destDir, bundleName, bundlePath);
		}
	}

	exportInstances(assetInfo, packInfo, objs, destDir, bundleName, bundlePath) {
		for (let i = 0; i < objs.length; ++i) {
			let type = objs[i].__type__;
			let cls = findClass(type);
			if (cls && cls.extendRefToId) {
				cls.extendRefToId(objs, objs[i]);
			}
		}

		let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.prefab`);
		utils.writeFileSync(destAsset, JSON.stringify(objs, null, '\t'));

		// mate
		let { GetMetaVersion } = require('../utils/MateVersionHelp.js');
		let version = GetMetaVersion('cc.Prefab');
		let info = packInfo[File.Instances][0];
		let json = {
			"ver": version,
			"uuid": assetInfo.uuid,
			"importer": "prefab",
			"optimizationPolicy": OptimizationPolicyTypes[info.optimizationPolicy] || "AUTO",
			"asyncLoadAssets": info.asyncLoadAssets,
			"readonly": info.readonly,
			"subMetas": {}
		}

		let metaDestAsset = path.join(destDir, bundleName, `${assetInfo.path}.prefab.meta`);
		utils.writeFileSync(metaDestAsset, JSON.stringify(json, null, "\t"));
	}
}


let prefab = new Prefab();
module.exports = prefab;