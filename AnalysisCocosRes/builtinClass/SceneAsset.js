
class SceneAsset {
	create(id) {
		let t = {
			"__type__": "cc.SceneAsset",
			"_name": "",
			"_objFlags": 0,
			"_native": "",
			"scene": null
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, 'scene');
	}

	extendRefToIdWithKey(objs, t, key) {
		let ketValue = t[key];
		if (ketValue) {
			for (let i = 0; i < objs.length; ++i) {
				let obj = objs[i];
				if (obj === ketValue) {
					t[key] = {
						"__id__": i
					}
					break;
				}
			}
		}
	}
}

let sceneAsset = new SceneAsset();
module.exports = sceneAsset;