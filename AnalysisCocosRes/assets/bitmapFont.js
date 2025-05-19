let utils = require('../utils/utils.js');
let path = require('path');
const { File, deserialize } = require('../deserialize/deserialize.js')
let fs = require('fs');
const { analysis } = require("../analysis.js")
let { GetMetaVersion } = require('../utils/MateVersionHelp.js');

class BitmapFont {
	export(assetInfo, destDir, bundleName, bundlePath) {
		let packInfo = assetInfo.packInfo
		if (packInfo) {
			let rootIndex = deserialize.parseInstances(packInfo);
			let info = packInfo[File.Instances];
			if (info) {
				let data = info[rootIndex];
				let dependUuids = packInfo[File.DependUuidIndices];
				let dependUuid = utils.decodeUUID(dependUuids[0]);
				let bundle = analysis.getBundle(bundleName);

				let dependSpriteFrame = bundle.config.getAssetInfo(dependUuid);
				let dependSpriteFramePackInfo = dependSpriteFrame.packInfo;
				let dependSpriteFrameInfo = dependSpriteFramePackInfo[File.Instances][0];
				let size = dependSpriteFrameInfo.originalSize;
				this.exportFnt(data._fntConfig, size, assetInfo, destDir, bundleName);
			}
		}
	}

	exportFnt(config, size, assetInfo, destDir, bundleName) {
		let charsStr = '';
		let fontDefDictionary = config.fontDefDictionary;
		let count = 0
		for (let key in fontDefDictionary) {
			let fontDef = fontDefDictionary[key];
			let rect = fontDef.rect;
			count++;
			let str = `char id=${key} x=${rect.x} y=${rect.y} width=${rect.width} height=${rect.height} xoffset=${fontDef.xOffset} yoffset=${fontDef.yOffset} xadvance=${fontDef.xAdvance} page=0  chnl=15`
			charsStr += str + '\n';
		}

		let str = `info face="Arial" size=${config.fontSize} bold=0 italic=0 charset="" unicode=1 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=1,1 outline=0\n` +
			`common lineHeight=${config.fontSize} base=26 scaleW=${size[0]} scaleH=${size[1]} pages=1 packed=0 alphaChnl=1 redChnl=0 greenChnl=0 blueChnl=0\n` +
			`page id=0 file="${config.atlasName}"\n` +
			`chars count=${count}\n` +
			`${charsStr}`
		let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.fnt`);
		utils.writeFileSync(destAsset, str);


		//meta
		let dependUuids = assetInfo.packInfo[File.DependUuidIndices];
		let dependUuid = utils.decodeUUID(dependUuids[0]);
		let bundle = analysis.getBundle(bundleName);

		let dependSpriteFrame = bundle.config.getAssetInfo(dependUuid);
		let dependSpriteFramePackInfo = dependSpriteFrame.packInfo;

		let spriteFrameDependUuids = dependSpriteFramePackInfo[File.DependUuidIndices];
		let textureUuid = spriteFrameDependUuids[0];
		if (typeof textureUuid === 'number') {
			let dependSharedUuids = dependSpriteFramePackInfo[File.SharedUuids];
			textureUuid = dependSharedUuids[textureUuid];
			textureUuid = utils.decodeUUID(textureUuid);
		}
		let version = GetMetaVersion('cc.BitmapFont');
		let metaDestAsset = path.join(destDir, bundleName, `${assetInfo.path}.fnt.meta`);
		let json = {
			"ver": version,
			"uuid": assetInfo.uuid,
			"importer": "bitmap-font",
			"textureUuid": textureUuid,
			"fontSize": config.fontSize,
			"subMetas": {}
		}


		let str1 = JSON.stringify(json, null, "\t");
		utils.writeFileSync(metaDestAsset, str1);
	}
}

let bitmapFont = new BitmapFont();
module.exports = bitmapFont;