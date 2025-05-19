let path = require('path');
let { Pack } = require('../bundle/pack.js');
const { File, deserialize } = require('../deserialize/deserialize.js')
let fs = require('fs');
let imageMgr = require('./imageMgr.js');
let utils = require('../utils/utils.js');

const extNames = ['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.pvr', '.pkm', '.astc'];

const TextureType = {
	PNG: 0,
	JPG: 1,
	JPEG: 2,
	BMP: 3,
	WEBP: 4,
	PVR: 5,
	PKM: 6,
	ASTC: 7
}

const GL_NEAREST = 9728;                // gl.NEAREST
const GL_LINEAR = 9729;                 // gl.LINEAR
const GL_REPEAT = 10497;                // gl.REPEAT
const GL_CLAMP_TO_EDGE = 33071;         // gl.CLAMP_TO_EDGE
const GL_MIRRORED_REPEAT = 33648;       // gl.MIRRORED_REPEAT
const GL_RGBA = 6408;                   // gl.RGBA

const CHAR_CODE_0 = 48;    // '0'
const CHAR_CODE_1 = 49;    // '1'

function getModeStr(mode) {
	if (mode == GL_CLAMP_TO_EDGE) {
		return "point"
	} else if (mode == GL_REPEAT) {
		return "bilinear"
	} else if (mode == GL_MIRRORED_REPEAT) {
		return "trilinear"
	} else if (mode == GL_NEAREST) {
		return "clamp"
	} else if (mode == GL_LINEAR) {
		return "repeat"
	}
}

class SpriteFrame {
	export(assetInfo, destDir, bundleName, bundlePath, config) {
		let packInfo = assetInfo.packInfo;
		if (packInfo) {
			let rootIndex = deserialize.parseInstances(packInfo);
			let info = packInfo[File.Instances];
			if (info) {
				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.png`);
				this.handlerDepends(assetInfo, packInfo, destAsset, destDir, bundleName, bundlePath, config);
			}
		}
	}

	handlerDepends(assetInfo, packInfo, destAsset, destDir, bundleName, bundlePath, config) {
		let depends = packInfo[File.DependUuidIndices];
		if (depends && depends.length > 0) {
			let dependTextureUuid = utils.decodeUUID(depends[0]);
			// let dependTextureUuid = utils.decodeUUID(dependTexture);
			let textureAssetInfo = config.assetInfos.get(dependTextureUuid);
			// if (textureAssetInfo.path != assetInfo.path) {
			let info = packInfo[File.Instances]
			let texturePackInfo = textureAssetInfo.packInfo;
			if (texturePackInfo) {
				let rootIndex = deserialize.parseInstances(texturePackInfo)
				let textureInfo = texturePackInfo[File.Instances][0];

				let fields = textureInfo.split(',');
				// decode extname
				let extIdStr = fields[0];
				let extIds = extIdStr.split('_');
				let extId = parseInt(extIds[0]);
				if (!Number.isNaN(extId)) {
					// copy texture
					let ext = extNames[extId];
					let texturePath = path.join(bundlePath, `native/${dependTextureUuid.slice(0, 2)}/${dependTextureUuid}${ext}`);
					if (textureAssetInfo.nativeVer) {
						texturePath = path.join(bundlePath, `native/${dependTextureUuid.slice(0, 2)}/${dependTextureUuid}.${textureAssetInfo.nativeVer}${ext}`);
					}
					this.importPngFromAtlas(texturePath, info, destAsset, extId);

					// mate
					this.exportPngMate(textureAssetInfo, assetInfo, destDir, bundleName, bundlePath, ".png");
				}
			}
			// }
		}
	}

	importPngFromAtlas(atlasPath, infos, destDir, extId) {
		imageMgr.addImage(atlasPath, (success, image) => {
			if (image) {
				let info = infos[0];
				image.sharpToFile(info, destDir, (success1) => {
					if (success1) {
						// console.log(`${destDir} export success`);
					}
				});
			}
		});
	}

	exportPngMate(textureAssetInfo, spriteFrameAssetInfo, destDir, bundleName, bundlePath, ext) {
		// mate
		let { GetMetaVersion } = require('../utils/MateVersionHelp.js');

		let texturePackInfo = textureAssetInfo.packInfo;
		let textureInfo = texturePackInfo[File.Instances][0];
		let fields = textureInfo.split(',');
		let spriteFramePackInfo = spriteFrameAssetInfo.packInfo;
		let spriteFrameInfo = spriteFramePackInfo[File.Instances][0];
		let capInsets = spriteFrameInfo.capInsets;

		let version = GetMetaVersion('cc.Texture2D');
		let json = {
			"ver": version,
			"uuid": textureAssetInfo.uuid,
			"importer": "texture",
			"type": "sprite",
			"wrapMode": getModeStr(fields[1]),
			"filterMode": getModeStr(fields[3]),
			"premultiplyAlpha": fields[5].charCodeAt(0) === CHAR_CODE_1,
			"genMipmaps": fields[6].charCodeAt(0) === CHAR_CODE_1,
			"packable": fields[7].charCodeAt(0) === CHAR_CODE_1,
			"width": spriteFrameInfo.originalSize[0],
			"height": spriteFrameInfo.originalSize[1],
			"platformSettings": {},
			"subMetas": {

			}
		}
		let spVersion = GetMetaVersion('cc.SpriteFrame');
		json.subMetas[spriteFrameInfo.name] = {
			"ver": spVersion,
			"uuid": spriteFrameAssetInfo.uuid,
			"importer": "sprite-frame",
			"rawTextureUuid": textureAssetInfo.uuid,
			"trimType": "custom",
			"trimThreshold": 1,
			"rotated": false,
			"offsetX": spriteFrameInfo.offset[0],
			"offsetY": spriteFrameInfo.offset[1],
			"trimX": spriteFrameInfo.originalSize[0] - spriteFrameInfo.rect[2],
			"trimY": spriteFrameInfo.originalSize[1] - spriteFrameInfo.rect[3],
			"width": spriteFrameInfo.rect[2],
			"height": spriteFrameInfo.rect[3],
			"rawWidth": spriteFrameInfo.originalSize[0],
			"rawHeight": spriteFrameInfo.originalSize[1],
			"borderTop": capInsets[0],
			"borderBottom": capInsets[1],
			"borderLeft": capInsets[2],
			"borderRight": capInsets[3],
			"subMetas": {}
		}

		let metaDestAsset = path.join(destDir, bundleName, `${spriteFrameAssetInfo.path}${ext}.meta`);
		let str1 = JSON.stringify(json, null, "\t");
		utils.writeFileSync(metaDestAsset, str1);
	}
}

let spriteFrame = new SpriteFrame();
module.exports = spriteFrame;