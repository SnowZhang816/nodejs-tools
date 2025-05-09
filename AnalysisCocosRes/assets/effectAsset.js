let utils = require('../utils/utils.js');
let path = require('path');
let { File } = require('../bundle/pack.js');
let fs = require('fs');

class EffectAsset {
	export(assetInfo, destDir, bundleName, bundlePath) {
		let relationPath = assetInfo.path;
		let uuid = assetInfo.uuid;
		let nativeVer = assetInfo.nativeVer;

		let packInfo = assetInfo.packInfo
		if (packInfo) {
			// TODO
			console.log('effectAsset unpack is not supported now.');
		}
	}
}


let effectAsset = new EffectAsset();
module.exports = effectAsset;