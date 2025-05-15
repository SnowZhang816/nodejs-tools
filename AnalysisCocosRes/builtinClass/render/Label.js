class Label {
	create() {
		let t = {
			"__type__": "cc.Label",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_materials": [],
			"_srcBlendFactor": 770,
			"_dstBlendFactor": 771,
			"_string": "Label",
			"_N$string": "Label",
			"_fontSize": 40,
			"_lineHeight": 40,
			"_enableWrapText": true,
			"_N$file": null,
			"_isSystemFontUsed": true,
			"_spacingX": 0,
			"_batchAsBitmap": false,
			"_styleFlags": 0,
			"_underlineHeight": 0,
			"_N$horizontalAlign": 1,
			"_N$verticalAlign": 1,
			"_N$fontFamily": "Arial",
			"_N$overflow": 0,
			"_N$cacheMode": 0,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "_N$file");

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


let label = new Label();
module.exports = label;