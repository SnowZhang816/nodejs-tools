let utils = require('../utils/utils.js');
let path = require('path');
let { File } = require('../bundle/pack.js');

class AnimationClip {
	export(assetInfo, destDir, bundleName, bundlePath) {
		//TODO: 动画剪辑打包
		let packInfo = assetInfo.packInfo;

		if (packInfo) {
			let info = packInfo[File.Instances];
			if (info) {
				let jsonData = info[0];
				let data = {
					__type__: 'cc.AnimationClip',
					_name: jsonData[1],
					_objFlags: 0,
					_native: '',
					_duration: jsonData[2],
					sample: jsonData[3],
					speed: 1,
					wrapMode: 1,
					curveData: jsonData[4],
					events: jsonData[5] || [],
					wrapRepeatMode: 1,
					_durationUnit: jsonData[6],
					_durationUnitTimeScale: jsonData[7]
				}

				let destAsset = path.join(destDir, bundleName, `${assetInfo.path}.json`);
				utils.writeFileSync(destAsset, JSON.stringify(data, null, '\t'));
			}

		} else {
			console.log('material unpack is not supported now.');
		}
	}
}

let animationClip = new AnimationClip();
module.exports = animationClip;


