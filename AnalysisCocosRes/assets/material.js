let utils = require('../utils/utils.js');
let path = require('path');
let { Pack, File } = require('../bundle/pack.js');

class Material {
	export(assetInfo, destDir, bundleName, bundlePath) {
		let packInfo = assetInfo.packInfo
		if (packInfo) {
			let info = packInfo[File.Instances];
			if (info) {
				let jsonData = info[0];
				let depends = Pack.prototype.getDependUuidList(packInfo);
				let effectAssetId = jsonData[2];
				let effectAssetUuid = depends[effectAssetId] ? depends[effectAssetId] : '';


				let data = {
					__type__: 'cc.AnimationClip',
					_name: jsonData[1],
					_objFlags: 0,
					_native: '',
					_effectAsset: {
						__uuid__: effectAssetUuid,
					},
					_techniqueIndex: 1,
					_techniqueData: {}
				}



				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.mtl`);
				utils.writeFileSync(destAsset, JSON.stringify(data, null, '\t'));
			}
		}
	}
}


let material = new Material();
module.exports = material;