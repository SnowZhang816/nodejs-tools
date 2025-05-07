

let utils = require('../utils/utils.js');
let path = require('path');
let { Pack, File } = require('../bundle/pack.js');
let fs = require('fs');
let imageMgr = require('./imageMgr.js');

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

class SpriteFrame {
	export(assetInfo, destDir, bundleName, bundlePath, config) {
		let packInfo = assetInfo.packInfo;
		if (packInfo) {
			let info = packInfo[File.Instances];
			if (info) {
				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.png`);
				this.handlerDepends(assetInfo, packInfo, destAsset, bundlePath, config);
			}
		} else {
			let uuid = assetInfo.uuid;
			let importVer = assetInfo.ver;

			let importPath = path.join(bundlePath, `import/${uuid.slice(0, 2)}/${uuid}.json`);
			if (importVer) {
				importPath = path.join(bundlePath, `import/${uuid.slice(0, 2)}/${uuid}.${importVer}.json`);
			}
			if (fs.existsSync(importPath)) {
				let data = JSON.parse(fs.readFileSync(importPath, 'utf8'));
				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.png`);
				this.handlerDepends(assetInfo, data, destAsset, bundlePath, config);
			}
		}
	}

	handlerDepends(assetInfo, data, destDir, bundlePath, config) {
		let depends = Pack.prototype.getDependUuidList(data);
		if (depends && depends.length > 0) {
			let dependTexture = depends[0];
			let dependTextureUuid = utils.decodeUUID(dependTexture);
			let textureAssetInfo = config.assetInfos.get(dependTextureUuid);
			if (textureAssetInfo.path != assetInfo.path) {
				let info = data[File.Instances]
				let texturePackInfo = textureAssetInfo.packInfo;
				if (texturePackInfo) {
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
						this.importPngFromAtlas(texturePath, info, destDir, extId);
					}
				}
			}
		}
	}

	importPngFromAtlas(atlasPath, infos, destDir, extId) {
		imageMgr.addImage(atlasPath, (success, image) => {
			if (image) {
				let info = infos[0];
				image.sharpToFile({ x: info.rect[0], y: info.rect[1] }, { width: info.rect[2], height: info.rect[3] }, info.rotated, destDir, (success1) => {
					if (success1) {
						// console.log(`${destDir} export success`);
					}
				});
			}
		});
	}
}

let spriteFrame = new SpriteFrame();
module.exports = spriteFrame;