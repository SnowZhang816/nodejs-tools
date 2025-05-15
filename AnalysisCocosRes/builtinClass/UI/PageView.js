class PageView {
	create() {
		let t = {
			"__type__": "cc.PageView",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"horizontal": true,
			"vertical": true,
			"inertia": true,
			"brake": 0.5,
			"elastic": true,
			"bounceDuration": 0.5,
			"scrollEvents": [],
			"cancelInnerEvents": true,
			"_N$content": null,
			"content": null,
			"scrollThreshold": 0.5,
			"autoPageTurningThreshold": 100,
			"pageTurningEventTiming": 0.1,
			"pageTurningSpeed": 0.3,
			"pageEvents": [],
			"_N$sizeMode": 0,
			"_N$direction": 0,
			"_N$indicator": null,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "_N$content");
		this.extendRefToIdWithKey(objs, t, "_N$indicator");

		this.extendRefsToIdWithKey(objs, t, "scrollEvents");
		this.extendRefsToIdWithKey(objs, t, "pageEvents");

		t.content = t._N$content;
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


let pageView = new PageView();
module.exports = pageView;