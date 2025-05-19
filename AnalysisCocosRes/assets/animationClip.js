let utils = require('../utils/utils.js');
let path = require('path');
const { File, deserialize } = require('../deserialize/deserialize.js')

class AnimationClip {
	create() {
		let t = {
			"__type__": "cc.AnimationClip",
			"_name": "",
			"_objFlags": 0,
			"_native": "",
			"_duration": 0,
			"sample": 60,
			"speed": 1,
			"wrapMode": 1,
			"curveData": null,
			"events": [],
			"wrapRepeatMode": 1
		};
		return t;
	}

	export(assetInfo, destDir, bundleName, bundlePath) {
		let packInfo = assetInfo.packInfo;
		if (packInfo) {
			let rootIndex = deserialize.parseInstances(packInfo);
			let instances = packInfo[File.Instances];
			if (instances && instances[rootIndex]) {
				let jsonData = instances[rootIndex];
				let data = {
					__type__: jsonData.__type__,
					_name: jsonData._name,
					_objFlags: jsonData._objFlags,
					_native: jsonData._native,
					_duration: jsonData._duration,
					sample: jsonData.sample || 60,
					speed: jsonData.speed || 1,
					wrapMode: jsonData.wrapMode || 1,
					curveData: jsonData.curveData,
					events: jsonData.events || [],
				}

				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.anim`);
				utils.writeFileSync(destAsset, JSON.stringify(data, null, '\t'));

				// mate
				let { GetMetaVersion } = require('../utils/MateVersionHelp.js');
				let version = GetMetaVersion('cc.AnimationClip');
				let json = {
					"ver": version,
					"uuid": assetInfo.uuid,
					"importer": "animation-clip",
					"subMetas": {}
				}

				let metaDestAsset = path.join(destDir, bundleName, `${assetInfo.path}.anim.meta`);
				utils.writeFileSync(metaDestAsset, JSON.stringify(json, null, "\t"));
			}

		}
	}
}

let animationClip = new AnimationClip();
module.exports = animationClip;


