let utils = require('../utils/utils.js');
let path = require('path');
const { File, deserialize } = require('../deserialize/deserialize.js')
let fs = require('fs');

class SpriteAtlas {
	export(assetInfo, destDir, bundleName, bundlePath) {
		let packInfo = assetInfo.packInfo;
		if (packInfo) {
			let rootIndex = deserialize.parseInstances(packInfo);
			let instances = packInfo[File.Instances];
			if (instances && instances[rootIndex]) {
				let jsonData = instances[rootIndex];

				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.pac`);
				let json = {
					"__type__": "cc.SpriteAtlas"
				}
				utils.writeFileSync(destAsset, JSON.stringify(json, null, "\t"));

				// mate
				let { GetMetaVersion } = require('../utils/MateVersionHelp.js');
				let version = GetMetaVersion('cc.SpriteAtlas');
				let mateJson = {
					"ver": version,
					"uuid": assetInfo.uuid,
					"importer": "auto-atlas",
					"maxWidth": 2048,
					"maxHeight": 2048,
					"padding": 2,
					"compressionLevel": 6,
					"allowRotation": true,
					"forceSquared": false,
					"powerOfTwo": true,
					"algorithm": "MaxRects",
					"format": "png",
					"quality": 80,
					"contourBleed": true,
					"paddingBleed": true,
					"filterUnused": true,
					"packable": false,
					"premultiplyAlpha": false,
					"filterMode": "bilinear",
					"platformSettings": {},
					"subMetas": {}
				}

				let metaDestAsset = path.join(destDir, bundleName, `${assetInfo.path}.pac.meta`);
				utils.writeFileSync(metaDestAsset, JSON.stringify(mateJson, null, "\t"));
			}
		}
	}
}

let spriteAtlas = new SpriteAtlas();
module.exports = spriteAtlas;

