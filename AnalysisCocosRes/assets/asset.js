let utils = require('../utils/utils.js');
let path = require('path');
const { File, deserialize } = require('../deserialize/deserialize.js')
let fs = require('fs');

class Asset {

	export(assetInfo, destDir, bundleName, bundlePath, config) {
		let uuid = assetInfo.uuid;
		let nativeVer = assetInfo.nativeVer;

		let packInfo = assetInfo.packInfo
		if (packInfo) {
			let rootIndex = deserialize.parseInstances(packInfo);
			let instances = packInfo[File.Instances];
			if (instances && instances[rootIndex]) {
				let jsonData = instances[rootIndex];
				let ext = jsonData._native

				let srcAsset = path.join(bundlePath, `native/${uuid.slice(0, 2)}/${uuid}${ext}`);
				if (nativeVer) {
					srcAsset = path.join(bundlePath, `native/${uuid.slice(0, 2)}/${uuid}.${nativeVer}${ext}`);
				}
				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}${ext}`);
				if (fs.existsSync(srcAsset)) {
					utils.copyDirOrFile(srcAsset, destAsset);
				}


				// mate
				let { GetMetaVersion } = require('../utils/MateVersionHelp.js');
				let version = GetMetaVersion("cc.Asset");
				let json = {
					"ver": version,
					"uuid": assetInfo.uuid,
					"importer": "asset",
					"subMetas": {}
				}

				let metaDestAsset = path.join(destDir, bundleName, `${assetInfo.path}${ext}.meta`);
				utils.writeFileSync(metaDestAsset, JSON.stringify(json, null, "\t"));
			}
		} else {
			let skeletonData = require('./skeletonData.js');
			let skeletonInfo = config.getInfoWithPath(assetInfo.path, skeletonData.constructor);
			if (skeletonInfo) {
				let packInfo = skeletonInfo.packInfo
				if (packInfo) {
					let rootIndex = deserialize.parseInstances(packInfo);
					let instances = packInfo[File.Instances];
					if (instances && instances[rootIndex]) {
						let jsonData = instances[rootIndex];
						let ext = ".atlas";
						let destAsset = path.join(destDir, bundleName, `${assetInfo.path}${ext}`);
						utils.writeFileSync(destAsset, jsonData._atlasText);

						// mate
						let { GetMetaVersion } = require('../utils/MateVersionHelp.js');
						let version = GetMetaVersion("cc.Asset");
						let json = {
							"ver": version,
							"uuid": assetInfo.uuid,
							"importer": "asset",
							"subMetas": {}
						}

						let metaDestAsset = path.join(destDir, bundleName, `${assetInfo.path}${ext}.meta`);
						utils.writeFileSync(metaDestAsset, JSON.stringify(json, null, "\t"));
					}
				}
			}
		}
	}
}

let asset = new Asset();
module.exports = asset;