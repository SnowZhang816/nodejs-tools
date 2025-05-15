class RichText {
	create() {
		let t = {
			"__type__": "cc.RichText",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_fontFamily": "Arial",
			"_isSystemFontUsed": true,
			"_N$string": "<color=#00ff00>Rich</c><color=#0fffff>Text</color>",
			"_N$horizontalAlign": 0,
			"_N$fontSize": 40,
			"_N$font": null,
			"_N$cacheMode": 0,
			"_N$maxWidth": 0,
			"_N$lineHeight": 50,
			"_N$imageAtlas": null,
			"_N$handleTouchEvent": true,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "_N$font");
		this.extendRefToIdWithKey(objs, t, "_N$imageAtlas");
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


let richText = new RichText();
module.exports = richText;