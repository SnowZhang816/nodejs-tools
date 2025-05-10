let utils = require('../utils/utils.js');
let path = require('path');
const { File } = require('../deserialize/deserialize.js')
const { deserialize } = require('../deserialize/deserialize.js');
let fs = require('fs');

class Material {
	create() {
		let jsonData = {};
		jsonData.__type__ = 'cc.Material';
		jsonData._objFlags = 0;
		jsonData._native = '';
		jsonData._effectAsset = null;
		return jsonData;
	}

	export(assetInfo, destDir, bundleName, bundlePath) {
		let packInfo = assetInfo.packInfo
		if (packInfo) {
			let rootIndex = deserialize.parseInstances(packInfo);
			let instances = packInfo[File.Instances];
			if (instances && instances[rootIndex]) {
				let jsonData = instances[rootIndex];
				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.mtl`);
				utils.writeFileSync(destAsset, JSON.stringify(jsonData, null, '\t'));
			}
		} else {
			let uuid = assetInfo.uuid;
			let importVer = assetInfo.ver;
			let importAsset = path.join(bundlePath, `import/${uuid.slice(0, 2)}/${uuid}.json`);
			if (importVer) {
				importAsset = path.join(bundlePath, `import/${uuid.slice(0, 2)}/${uuid}.${importVer}.json`);
			}
			if (fs.existsSync(importAsset)) {
				let data = fs.readFileSync(importAsset, 'utf8');
				let packInfo = JSON.parse(data);
				let rootIndex = deserialize.parseInstances(packInfo);
				let instances = packInfo[File.Instances];
				if (instances && instances[rootIndex]) {
					let jsonData = instances[rootIndex];
					let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.mtl`);
					utils.writeFileSync(destAsset, JSON.stringify(jsonData, null, '\t'));
				}
			}
		}
	}
}


let material = new Material();
module.exports = material;