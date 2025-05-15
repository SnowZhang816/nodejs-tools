class Light {
	create() {
		let t = {
			"__type__": "cc.Light",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_type": 0,
			"_color": {
				"__type__": "cc.Color",
				"r": 255,
				"g": 255,
				"b": 255,
				"a": 255
			},
			"_intensity": 1,
			"_range": 1000,
			"_spotAngle": 60,
			"_spotExp": 1,
			"_shadowType": 0,
			"_shadowResolution": 1024,
			"_shadowDarkness": 0.5,
			"_shadowMinDepth": 1,
			"_shadowMaxDepth": 4096,
			"_shadowFrustumSize": 1024,
			"_shadowBias": 0.0005,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
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


let light = new Light();
module.exports = light;