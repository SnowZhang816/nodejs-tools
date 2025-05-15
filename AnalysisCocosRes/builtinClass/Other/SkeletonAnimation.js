class SkeletonAnimation {
	create() {
		let t = {
			"__type__": "cc.SkeletonAnimation",
			"_name": "",
			"_objFlags": 0,
			"node": {
				"__id__": 88
			},
			"_enabled": true,
			"_defaultClip": null,
			"_clips": [],
			"playOnLoad": false,
			"_model": null,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "_defaultClip");
		this.extendRefToIdWithKey(objs, t, "_model");

		this.extendRefsToIdWithKey(objs, t, "_clips");
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

	extendRefsToIdWithKey(objs, t, key) {
		let keysValue = t[key];
		for (let i = 0; i < keysValue.length; ++i) {
			let value = keysValue[i];
			for (let j = 0; j < objs.length; ++j) {
				let obj = objs[j];
				if (obj === value) {
					keysValue[i] = {
						"__id__": j
					}
					break;
				}
			}
		}
	}
}


let skeletonAnimation = new SkeletonAnimation();
module.exports = skeletonAnimation;