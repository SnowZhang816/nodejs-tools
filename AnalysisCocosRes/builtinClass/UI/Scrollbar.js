class Scrollbar {
	create() {
		let t = {
			"__type__": "cc.Scrollbar",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_scrollView": null,
			"_touching": false,
			"_opacity": 255,
			"enableAutoHide": true,
			"autoHideTime": 1,
			"_N$handle": null,
			"_N$direction": 1,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "_scrollView");
		this.extendRefToIdWithKey(objs, t, "_N$handle");
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


let scrollbar = new Scrollbar();
module.exports = scrollbar;