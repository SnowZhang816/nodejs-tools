let Config = require('./config.js');
let scene = require('../assets/scene.js');

// const audioClip = require('../assets/audioClip.js');
// const skeletonData = require('../assets/skeletonData.js');
// const texture2D = require('../assets/texture2D.js');
// const animationClip = require('../assets/animationClip.js');
// const asset = require('../assets/asset.js');
// const bitmapFont = require('../assets/bitmapFont.js');
// const spriteAtlas = require('../assets/spriteAtlas.js');
// const spriteFrame = require('../assets/spriteFrame.js');
// const material = require('../assets/material.js');
// const prefab = require('../assets/prefab.js');
// const effectAsset = require('../assets/effectAsset.js');
// const jsonAsset = require('../assets/json.js');

class Bundle {
	bundleName = "";
	bundlePath = "";
	config = null;

	pack = null;

	constructor(bundleName, bundlePath, data) {
		this.bundleName = bundleName;
		this.bundlePath = bundlePath;

		let config = new Config();
		config.init(data, bundlePath);
		this.config = config;
	}

	exportAssets(destDir) {
		for (let [key, assetInfos] of this.config.paths) {
			for (let assetInfo of assetInfos) {
				if (assetInfo.ctor && assetInfo.ctor["export"]) {
					let handler = assetInfo.ctor["export"]
					handler.call(assetInfo.ctor, assetInfo, destDir, this.bundleName, this.bundlePath, this.config);
				} else {
					console.warn(`${key} has no handler`);
				}
			}
		}

		for (let [key, assetInfo] of this.config.scenes) {
			scene.export(assetInfo, destDir, this.bundleName, this.bundlePath, this.config)
		}
	}
}

module.exports = {
	Bundle: Bundle
}