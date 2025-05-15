let originKey = {
	"__type__": "",
	"_name": "",
	"_objFlags": 0,
	"node": null,
	"_enabled": true,
	"_id": ""
}

class CustomClass {
	type = "";

	create() {
		let t = {
			"__type__": this.type,
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

		for (let key in t) {
			if (originKey[key] === undefined) {
				if (typeof t[key] === "object") {
					this.extendRefToIdWithKey(objs, t, key);
				}
			}
		}
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

module.exports = CustomClass;