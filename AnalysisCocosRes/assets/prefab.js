let utils = require('../utils/utils.js');
let path = require('path');
const { File, deserialize, Refs } = require('../deserialize/deserialize.js')
const { findClass } = require('../deserialize/findClass.js');

let fs = require('fs');

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
		} else {
			let uuid = assetInfo.uuid;
			let importVer = assetInfo.ver;
			let importAsset = path.join(bundlePath, `import/${uuid.slice(0, 2)}/${uuid}.json`);
			if (importVer) {
				importAsset = path.join(bundlePath, `import/${uuid.slice(0, 2)}/${uuid}.${importVer}.json`);
			}
			if (fs.existsSync(importAsset)) {
				let data = fs.readFileSync(importAsset, 'utf8');
				let packInfo = JSON.parse(data);
				let objs = []
				deserialize.parseInstances(packInfo, objs);
				this.exportInstances(assetInfo, packInfo, objs, destDir, bundleName, bundlePath);
			}
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
	}
}


let prefab = new Prefab();
module.exports = prefab;