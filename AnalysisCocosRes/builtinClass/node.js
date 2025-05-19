class Node {
	create() {
		let t = {
			"__type__": "cc.Node",
			"_name": "aaa",
			"_objFlags": 0,
			"_parent": null,
			"_children": [],
			"_active": true,
			"_components": [],
			"_prefab": null,
			"_opacity": 255,
			"_color": {
				"__type__": "cc.Color",
				"r": 255,
				"g": 255,
				"b": 255,
				"a": 255
			},
			"_contentSize": {
				"__type__": "cc.Size",
				"width": 0,
				"height": 0
			},
			"_anchorPoint": {
				"__type__": "cc.Vec2",
				"x": 0.5,
				"y": 0.5
			},
			"_trs": {
				"__type__": "TypedArray",
				"ctor": "Float64Array",
				"array": [
					0,
					0,
					0,
					0,
					0,
					0,
					1,
					1,
					1,
					1
				]
			},
			"_eulerAngles": {
				"__type__": "cc.Vec3",
				"x": 0,
				"y": 0,
				"z": 0
			},
			"_skewX": 0,
			"_skewY": 0,
			"_is3DNode": false,
			"_groupIndex": 0,
			"groupIndex": 0,
			"_id": ""
		};

		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "_prefab");
		this.extendRefToIdWithKey(objs, t, "_parent");

		this.extendRefsToIdWithKey(objs, t, "_children");
		this.extendRefsToIdWithKey(objs, t, "_components");
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

let node = new Node();
module.exports = node;