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

class Scene {
	create(id) {
		let t = {
			"__type__": "cc.Scene",
			"_objFlags": 0,
			"_parent": null,
			"_children": [],
			"_active": true,
			"_components": [],
			"_prefab": null,
			"_opacity": 255,
			"_color": {
				"__type__": "cc.Color",
				"r": 255,
				"g": 255,
				"b": 255,
				"a": 255
			},
			"_contentSize": {
				"__type__": "cc.Size",
				"width": 0,
				"height": 0
			},
			"_anchorPoint": {
				"__type__": "cc.Vec2",
				"x": 0,
				"y": 0
			},
			"_trs": {
				"__type__": "TypedArray",
				"ctor": "Float64Array",
				"array": [
					0,
					0,
					0,
					0,
					0,
					0,
					1,
					1,
					1,
					1
				]
			},
			"_is3DNode": true,
			"_groupIndex": 0,
			"groupIndex": 0,
			"autoReleaseAssets": false,
			"_id": id
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "_parent");
		this.extendRefToIdWithKey(objs, t, "_prefab");
		this.extendRefToIdWithKey(objs, t, "_id");

		this.extendRefsToIdWithKey(objs, t, "_children");
		this.extendRefsToIdWithKey(objs, t, "_components");
	}

	extendRefToIdWithKey(objs, t, key) {
		let ketValue = t[key];
		if (ketValue) {
			for (let i = 0; i < objs.length; ++i) {
				let obj = objs[i];
				if (obj === ketValue) {
					t[key] = {
						"__id__": i
					}
					break;
				}
			}
		}
	}

	extendRefsToIdWithKey(objs, t, key) {
		let keysValue = t[key];
		for (let i = 0; i < keysValue.length; ++i) {
			let value = keysValue[i];
			for (let j = 0; j < objs.length; ++j) {
				let obj = objs[j];
				if (obj === value) {
					keysValue[i] = {
						"__id__": j
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

		let url = assetInfo.url;
		let filePath = url.replace("db://assets/", '');
		let destAsset = path.join(destDir, `${filePath}`);
		utils.writeFileSync(destAsset, JSON.stringify(objs, null, '\t'));

		// mate
		let { GetMetaVersion } = require('../utils/MateVersionHelp.js');
		let version = GetMetaVersion('cc.Scene');
		let info = packInfo[File.Instances][0];
		let scene = info.scene.__id__;
		let sceneInstance = objs[scene];
		let json = {
			"ver": version,
			"uuid": assetInfo.uuid,
			"importer": "scene",
			"asyncLoadAssets": !info.asyncLoadAssets,
			"autoReleaseAssets": sceneInstance.sceneInstance,
			"subMetas": {}
		}

		let metaDestAsset = path.join(destDir, `${filePath}.meta`);
		utils.writeFileSync(metaDestAsset, JSON.stringify(json, null, "\t"));
	}
}


let scene = new Scene();
module.exports = scene;