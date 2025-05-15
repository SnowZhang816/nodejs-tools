class ProgressBar {
	create() {
		let t = {
			"__type__": "cc.ProgressBar",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_N$totalLength": 300,
			"_N$barSprite": null,
			"_N$mode": 0,
			"_N$progress": 0.5,
			"_N$reverse": false,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "_N$barSprite");
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


let progressBar = new ProgressBar();
module.exports = progressBar;