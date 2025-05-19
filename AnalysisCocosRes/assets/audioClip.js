let utils = require('../utils/utils.js');
let path = require('path');
const { File, deserialize } = require('../deserialize/deserialize.js')
let fs = require('fs');

class AudioClip {
	export(assetInfo, destDir, bundleName, bundlePath) {
		let relationPath = assetInfo.path;
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
				let destAsset = path.join(destDir, bundleName, `${relationPath}${ext}`);
				utils.copyDirOrFile(srcAsset, destAsset);

				// mate
				let { GetMetaVersion } = require('../utils/MateVersionHelp.js');
				let version = GetMetaVersion('cc.AudioClip');
				let json = {
					"ver": version,
					"uuid": assetInfo.uuid,
					"importer": "audio-clip",
					"downloadMode": jsonData.downloadMode || 0,
					"duration": jsonData.duration,
					"subMetas": {}
				}

				let metaDestAsset = path.join(destDir, bundleName, `${assetInfo.path}${ext}.meta`);
				utils.writeFileSync(metaDestAsset, JSON.stringify(json, null, "\t"));
			}
		}
	}
}

let audioClip = new AudioClip();
module.exports = audioClip;