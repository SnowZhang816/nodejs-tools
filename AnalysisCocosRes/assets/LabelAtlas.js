let utils = require('../utils/utils.js');
let path = require('path');
const { File } = require('../deserialize/deserialize.js')
const { deserialize } = require('../deserialize/deserialize.js');
let fs = require('fs');
const { analysis } = require("../analysis.js")

class LabelAtlas {
	export(assetInfo, destDir, bundleName, bundlePath) {
		let packInfo = assetInfo.packInfo
		if (packInfo) {
			let rootIndex = deserialize.parseInstances(packInfo);
			let instances = packInfo[File.Instances];
			if (instances && instances[rootIndex]) {
				let jsonData = instances[rootIndex];
				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.labelAtlas`);
				let data = {
					"__type__": "cc.LabelAtlas"
				}
				utils.writeFileSync(destAsset, JSON.stringify(data, null, '\t'));


				// mate
				let { GetMetaVersion } = require('../utils/MateVersionHelp.js');
				let version = GetMetaVersion('cc.LabelAtlas');
				let json = {
					"ver": version,
					"uuid": assetInfo.uuid,
					"importer": "label-atlas",
					"itemWidth": 0,
					"itemHeight": jsonData._fntConfig.commonHeight,
					"startChar": "0",
					"rawTextureUuid": "50e6cdc1-48a9-4a14-b814-d62d031f8eff",
					"fontSize": jsonData.fontSize,
					"subMetas": {}
				}

				let fontDefDictionary = jsonData._fntConfig.fontDefDictionary || {};
				// 获取fontDefDictionary中的第一个字符作为起始字符
				let ascii = ''
				let itemWidth = 0;
				for (let key in fontDefDictionary) {
					ascii = key;
					itemWidth = fontDefDictionary[key].xAdvance;
					break;
				}
				// ascii 转char
				json.startChar = String.fromCharCode(parseInt(ascii));

				let dependUuid = utils.decodeUUID(packInfo[File.DependUuidIndices][0]);
				let bundle = analysis.getBundle(bundleName);
				let dependSpriteFrame = bundle.config.getAssetInfo(dependUuid);
				let dependSpriteFramePackInfo = dependSpriteFrame.packInfo;
				deserialize.parseInstances(dependSpriteFramePackInfo);
				json.itemWidth = itemWidth;
				json.rawTextureUuid = utils.decodeUUID(dependSpriteFramePackInfo[File.DependUuidIndices][0]);

				let metaDestAsset = path.join(destDir, bundleName, `${assetInfo.path}.labelAtlas.meta`);
				utils.writeFileSync(metaDestAsset, JSON.stringify(json, null, "\t"));
			}
		}
	}
}


let labelAtlas = new LabelAtlas();
module.exports = labelAtlas;