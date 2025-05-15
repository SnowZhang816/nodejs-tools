class BlockInputEvents {
	create() {
		let t = {
			"__type__": "cc.BlockInputEvents",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
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
}

let blockInputEvents = new BlockInputEvents();
module.exports = blockInputEvents;