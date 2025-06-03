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
				this.handlerDepends(assetInfo, packInfo, destDir, bundleName, bundlePath, config);
			}
		} else {
			let texture2D = require('./texture.js');
			let textureInfo = config.getInfoWithPath(assetInfo.path, texture2D.constructor);
			if (textureInfo) {
				let packInfo = textureInfo.packInfo
				if (packInfo) {
					let rootIndex = deserialize.parseInstances(packInfo);
					let instances = packInfo[File.Instances];
					if (instances && instances[rootIndex]) {
						let jsonData = instances[rootIndex];
						let uuid = textureInfo.uuid;
						let fields = jsonData.split(',');
						// decode extname
						let extIdStr = fields[0];
						let extIds = extIdStr.split('_');
						let extId = parseInt(extIds[0]);
						if (!Number.isNaN(extId)) {
							// copy texture
							let ext = extNames[extId];
							let texturePath = path.join(bundlePath, `native/${uuid.slice(0, 2)}/${uuid}${ext}`);
							if (textureInfo.nativeVer) {
								texturePath = path.join(bundlePath, `native/${uuid.slice(0, 2)}/${uuid}.${textureInfo.nativeVer}${ext}`);
							}

							let destAsset = path.join(destDir, bundleName, `${assetInfo.path}${ext}`);
							if (fs.existsSync(texturePath)) {
								const Image = require('../utils/image.js');
								let image = new Image(texturePath);
								let data = fs.readFileSync(texturePath);
								image.initWithData(data, (success) => {
									// mate
									if (success) {
										utils.copyDirOrFile(texturePath, destAsset);
										this.exportPngMate(textureInfo, assetInfo, destDir, bundleName, bundlePath, ext, image.width, image.height);
									}
								})
							}
						}
					}
				}
			}
		}
	}

	handlerDepends(assetInfo, packInfo, destDir, bundleName, bundlePath, config) {
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
					if (ext != ".jpg") {
						ext = ".png";
					}
					let destAsset = path.join(destDir, bundleName, `${assetInfo.path}${ext}`);
					this.importPngFromAtlas(texturePath, info, destAsset, ext);

					// mate
					this.exportPngMate(textureAssetInfo, assetInfo, destDir, bundleName, bundlePath, ext);
				}
			}
			// }
		}
	}

	importPngFromAtlas(atlasPath, infos, destDir, ext) {
		imageMgr.addImage(atlasPath, (success, image) => {
			if (image) {
				let info = infos[0];
				image.sharpToFile(info, atlasPath, destDir, (success1) => {
					if (success1) {
						// console.log(`${destDir} export success`);
					}
				});
			}
		});
	}

	exportPngMate(textureAssetInfo, spriteFrameAssetInfo, destDir, bundleName, bundlePath, ext, width = 0, height = 0) {
		// mate
		let { GetMetaVersion } = require('../utils/MateVersionHelp.js');

		let texturePackInfo = textureAssetInfo.packInfo;
		let textureInfo = texturePackInfo[File.Instances][0];
		let fields = textureInfo.split(',');
		let spriteFramePackInfo = spriteFrameAssetInfo.packInfo;
		let capInsets = [0, 0, 0, 0]
		let originalSize = [width, height];
		let temps = spriteFrameAssetInfo.path.split('/')
		let name = temps[temps.length - 1];
		let offset = [0, 0]
		let rect = [0, 0, width, height]
		if (spriteFramePackInfo && spriteFramePackInfo[File.Instances] && spriteFramePackInfo[File.Instances][0]) {
			let spriteFrameInfo = spriteFramePackInfo[File.Instances][0];
			capInsets = spriteFrameInfo.capInsets;
			originalSize = spriteFrameInfo.originalSize;
			name = spriteFrameInfo.name;
			offset = spriteFrameInfo.offset;
			rect = spriteFrameInfo.rect;
		}

		let rawUuid = textureAssetInfo.uuid;
		if (!utils.isUuid(rawUuid)) {
			rawUuid = utils.generateUUID();
		}

		let version = GetMetaVersion('cc.Texture2D');
		let json = {
			"ver": version,
			"uuid": rawUuid,
			"importer": "texture",
			"type": "sprite",
			"wrapMode": getModeStr(fields[1]),
			"filterMode": getModeStr(fields[3]),
			"premultiplyAlpha": fields[5].charCodeAt(0) === CHAR_CODE_1,
			"genMipmaps": fields[6].charCodeAt(0) === CHAR_CODE_1,
			"packable": fields[7].charCodeAt(0) === CHAR_CODE_1,
			"width": originalSize[0],
			"height": originalSize[1],
			"platformSettings": {},
			"subMetas": {

			}
		}
		let spVersion = GetMetaVersion('cc.SpriteFrame');
		json.subMetas[name] = {
			"ver": spVersion,
			"uuid": spriteFrameAssetInfo.uuid,
			"importer": "sprite-frame",
			"rawTextureUuid": rawUuid,
			"trimType": "custom",
			"trimThreshold": 1,
			"rotated": false,
			"offsetX": offset[0],
			"offsetY": offset[1],
			"trimX": originalSize[0] - rect[2],
			"trimY": originalSize[1] - rect[3],
			"width": rect[2],
			"height": rect[3],
			"rawWidth": originalSize[0],
			"rawHeight": originalSize[1],
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