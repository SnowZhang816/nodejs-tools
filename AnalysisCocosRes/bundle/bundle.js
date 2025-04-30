let Config = require('./config.js');
let path = require('path');
let utils = require('../utils/utils.js');
let fs = require('fs');
let { Pack } = require('./pack.js');

class Bundle {
	bundleName = "";
	bundlePath = "";
	config = null;

	pack = null;

	exportsOfHandler = {};

	constructor(bundleName, bundlePath, data) {
		this.bundleName = bundleName;
		this.bundlePath = bundlePath;

		let config = new Config();
		config.init(data, bundlePath);
		this.config = config;

		for (let [key, info] of this.config.assetInfos) {
			if (info.ext === '.json') {
				let uuid = info.uuid;
				let nativeVer = info.nativeVer;

				let srcAsset = path.join(this.bundlePath, `import/${uuid.slice(0, 2)}/${uuid}.json`);
				if (nativeVer) {
					srcAsset = path.join(this.bundlePath, `import/${uuid.slice(0, 2)}/${uuid}.${nativeVer}.json`);
				}
				if (fs.existsSync(srcAsset)) {
					let packJson = fs.readFileSync(srcAsset, 'utf8');
					let json = JSON.parse(packJson);
					this.pack = new Pack();
					this.pack.unpack(json);
				}
			}
		}

		this.exportsOfHandler = {
			"sp.SkeletonData": this.exportsSkeletonData.bind(this),
			"cc.AudioClip": this.exportsAudioClip.bind(this)
		};
	}


	exportAssets(destDir) {
		for (let [key, info] of this.config.assetInfos) {
			if (info.ctor && this.exportsOfHandler[info.ctor]) {
				this.exportsOfHandler[info.ctor](info, destDir);
			}
		}
	}

	exportsAudioClip(assetInfo, destDir) {
		let relationPath = assetInfo.path;
		let uuid = assetInfo.uuid;
		let nativeVer = assetInfo.nativeVer;

		let srcAsset = path.join(this.bundlePath, `native/${uuid.slice(0, 2)}/${uuid}.mp3`);
		if (nativeVer) {
			srcAsset = path.join(this.bundlePath, `native/${uuid.slice(0, 2)}/${uuid}.${nativeVer}.mp3`);
		}
		let destAsset = path.join(destDir, this.bundleName, `${relationPath}.mp3`);
		utils.copyDirOrFile(srcAsset, destAsset);
	}

	exportsSkeletonData(assetInfo, destDir) {

	}
}
module.exports = {
	Bundle: Bundle
};