class Layout {
	create() {
		let t = {
			"__type__": "cc.Layout",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_layoutSize": {
				"__type__": "cc.Size",
				"width": 200,
				"height": 150
			},
			"_resize": 0,
			"_N$layoutType": 0,
			"_N$cellSize": {
				"__type__": "cc.Size",
				"width": 40,
				"height": 40
			},
			"_N$startAxis": 0,
			"_N$paddingLeft": 0,
			"_N$paddingRight": 0,
			"_N$paddingTop": 0,
			"_N$paddingBottom": 0,
			"_N$spacingX": 0,
			"_N$spacingY": 0,
			"_N$verticalDirection": 1,
			"_N$horizontalDirection": 0,
			"_N$affectedByScale": false,
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


let layout = new Layout();
module.exports = layout;