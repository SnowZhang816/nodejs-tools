let utils = require('../utils/utils.js');
let path = require('path');
const { File, deserialize } = require('../deserialize/deserialize.js')
let fs = require('fs');

class EffectAsset {
	create() {
		let jsonData = {};
		return jsonData;
	}

	export(assetInfo, destDir, bundleName, bundlePath) {
		let packInfo = assetInfo.packInfo
		if (packInfo) {
			let rootIndex = deserialize.parseInstances(packInfo);
			let instances = packInfo[File.Instances];
			if (instances && instances[rootIndex]) {
				let jsonData = instances[rootIndex];
				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.effect`);
				utils.writeFileSync(destAsset, JSON.stringify(jsonData, null, '\t'));

				let vert = path.join(destDir, bundleName, `${assetInfo.path}.vert`);
				utils.writeFileSync(vert, jsonData.shaders[0].glsl3.vert);

				let frag = path.join(destDir, bundleName, `${assetInfo.path}.frag`);
				utils.writeFileSync(frag, jsonData.shaders[0].glsl3.frag);

				// mate
				let { GetMetaVersion } = require('../utils/MateVersionHelp.js');
				let version = GetMetaVersion('cc.EffectAsset');
				let json = {
					"ver": version,
					"uuid": assetInfo.uuid,
					"importer": "effect",
					"compiledShaders": [
					],
					"subMetas": {}
				}

				let shaders = jsonData.shaders;
				for (let i = 0; i < shaders.length; ++i) {
					let shader = shaders[i];
					json.compiledShaders.push({
						glsl1: shader.glsl1,
						glsl3: shader.glsl3,
					});
				}

				let metaDestAsset = path.join(destDir, bundleName, `${assetInfo.path}.effect.meta`);
				utils.writeFileSync(metaDestAsset, JSON.stringify(json, null, "\t"));
			}
		}
	}

	exportEffect(jsonData, assetInfo, destDir, bundleName, bundlePath) {
		let CCEffect = `CCEffect %{\n`

	}
}


let effectAsset = new EffectAsset();
module.exports = effectAsset;