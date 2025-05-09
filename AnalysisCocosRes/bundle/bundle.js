let Config = require('./config.js');

const audioClip = require('../assets/audioClip.js');
const skeletonData = require('../assets/skeletonData.js');
const texture2D = require('../assets/texture2D.js');
const animationClip = require('../assets/animationClip.js');
const asset = require('../assets/asset.js');
const bitmapFont = require('../assets/bitmapFont.js');
const spriteAtlas = require('../assets/spriteAtlas.js');
const spriteFrame = require('../assets/spriteFrame.js');
const material = require('../assets/material.js');
const prefab = require('../assets/prefab.js');
const effectAsset = require('../assets/effectAsset.js');
const jsonAsset = require('../assets/json.js');

class Bundle {
	bundleName = "";
	bundlePath = "";
	config = null;

	pack = null;

	assetsHandler = {};

	constructor(bundleName, bundlePath, data) {
		this.bundleName = bundleName;
		this.bundlePath = bundlePath;

		let config = new Config();
		config.init(data, bundlePath);
		this.config = config;

		this.assetsHandler = {
			"sp.SkeletonData": skeletonData,
			"cc.AudioClip": audioClip,
			"cc.Texture2D": texture2D,
			"cc.AnimationClip": animationClip,
			"cc.Asset": asset,
			"cc.BitmapFont": bitmapFont,
			"cc.SpriteAtlas": spriteAtlas,
			"cc.SpriteFrame": spriteFrame,
			"cc.Material": material,
			"cc.Prefab": prefab,
			"cc.EffectAsset": effectAsset,
			"cc.JsonAsset": jsonAsset,
			"cc.TextAsset": jsonAsset,
		};
	}

	exportAssets(destDir) {
		for (let [key, info] of this.config.assetInfos) {
			if (info.ctor && this.assetsHandler[info.ctor]) {
				let handler = this.assetsHandler[info.ctor];
				handler["export"](info, destDir, this.bundleName, this.bundlePath, this.config);
			} else {
				if (info.ctor) {
					console.warn(`${info.ctor} has no handler`);
				} else if (info.path) {
					console.warn(`${info.path} has no ctor`);
				} else {
					console.warn(`${key} has no ctor and path`);
				}
			}
		}
	}
}

module.exports = {
	Bundle: Bundle
};