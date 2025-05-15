class Graphics {
	create() {
		let t = {
			"__type__": "cc.Graphics",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_materials": [],
			"_lineWidth": 2,
			"_strokeColor": {
				"__type__": "cc.Color",
				"r": 0,
				"g": 0,
				"b": 0,
				"a": 255
			},
			"_lineJoin": 2,
			"_lineCap": 0,
			"_fillColor": {
				"__type__": "cc.Color",
				"r": 255,
				"g": 255,
				"b": 255,
				"a": 255
			},
			"_miterLimit": 10,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefsToIdWithKey(objs, t, "_materials");
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


let graphics = new Graphics();
module.exports = graphics;