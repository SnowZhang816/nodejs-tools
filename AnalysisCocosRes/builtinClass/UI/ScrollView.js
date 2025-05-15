class ScrollView {
	create() {
		let t = {
			"__type__": "cc.ScrollView",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"horizontal": false,
			"vertical": true,
			"inertia": true,
			"brake": 0.75,
			"elastic": true,
			"bounceDuration": 0.23,
			"scrollEvents": [],
			"cancelInnerEvents": true,
			"_N$content": null,
			"content": null,
			"_N$horizontalScrollBar": null,
			"_N$verticalScrollBar": null,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "_N$content");
		this.extendRefToIdWithKey(objs, t, "_N$horizontalScrollBar");
		this.extendRefToIdWithKey(objs, t, "_N$verticalScrollBar");

		this.extendRefsToIdWithKey(objs, t, "scrollEvents");

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


let scrollView = new ScrollView();
module.exports = scrollView;