class Camera {
	create() {
		let t = {
			"__type__": "cc.Camera",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_cullingMask": 4294967295,
			"_clearFlags": 7,
			"_backgroundColor": {
				"__type__": "cc.Color",
				"r": 0,
				"g": 0,
				"b": 0,
				"a": 255
			},
			"_depth": -1,
			"_zoomRatio": 1,
			"_targetTexture": null,
			"_fov": 60,
			"_orthoSize": 10,
			"_nearClip": 1,
			"_farClip": 4096,
			"_ortho": true,
			"_rect": {
				"__type__": "cc.Rect",
				"x": 0,
				"y": 0,
				"width": 1,
				"height": 1
			},
			"_renderStages": 1,
			"_alignWithScreen": true,
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


let camera = new Camera();
module.exports = camera;