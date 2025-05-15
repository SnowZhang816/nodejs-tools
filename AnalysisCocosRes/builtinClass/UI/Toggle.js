class Toggle {
	create() {
		let t = {
			"__type__": "cc.Toggle",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_normalMaterial": null,
			"_grayMaterial": null,
			"duration": 0.1,
			"zoomScale": 1.2,
			"clickEvents": [],
			"_N$interactable": true,
			"_N$enableAutoGrayEffect": false,
			"_N$transition": 3,
			"transition": 3,
			"_N$normalColor": {
				"__type__": "cc.Color",
				"r": 214,
				"g": 214,
				"b": 214,
				"a": 255
			},
			"_N$pressedColor": {
				"__type__": "cc.Color",
				"r": 211,
				"g": 211,
				"b": 211,
				"a": 255
			},
			"pressedColor": {
				"__type__": "cc.Color",
				"r": 211,
				"g": 211,
				"b": 211,
				"a": 255
			},
			"_N$hoverColor": {
				"__type__": "cc.Color",
				"r": 255,
				"g": 255,
				"b": 255,
				"a": 255
			},
			"hoverColor": {
				"__type__": "cc.Color",
				"r": 255,
				"g": 255,
				"b": 255,
				"a": 255
			},
			"_N$disabledColor": {
				"__type__": "cc.Color",
				"r": 124,
				"g": 124,
				"b": 124,
				"a": 255
			},
			"_N$normalSprite": null,
			"_N$pressedSprite": null,
			"pressedSprite": null,
			"_N$hoverSprite": null,
			"hoverSprite": null,
			"_N$disabledSprite": null,
			"_N$target": null,
			"_N$isChecked": true,
			"toggleGroup": null,
			"checkMark": null,
			"checkEvents": [],
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "_normalMaterial");
		this.extendRefToIdWithKey(objs, t, "_grayMaterial");

		this.extendRefToIdWithKey(objs, t, "_N$normalSprite");
		this.extendRefToIdWithKey(objs, t, "_N$pressedSprite");
		this.extendRefToIdWithKey(objs, t, "pressedSprite");
		this.extendRefToIdWithKey(objs, t, "_N$hoverSprite");
		this.extendRefToIdWithKey(objs, t, "hoverSprite");
		this.extendRefToIdWithKey(objs, t, "_N$disabledSprite");

		this.extendRefToIdWithKey(objs, t, "_N$target");
		this.extendRefToIdWithKey(objs, t, "toggleGroup");
		this.extendRefToIdWithKey(objs, t, "checkMark");

		this.extendRefsToIdWithKey(objs, t, "clickEvents");
		this.extendRefsToIdWithKey(objs, t, "checkEvents");

		t.pressedSprite = t._N$pressedSprite;
		t.hoverSprite = t._N$hoverSprite;
		t.transition = t._N$transition;
		t.pressedColor = t._N$pressedColor;
		t.hoverColor = t._N$hoverColor;
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


let toggle = new Toggle();
module.exports = toggle;