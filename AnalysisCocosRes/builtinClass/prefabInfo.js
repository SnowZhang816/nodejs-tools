class PrefabInfo {
	create() {
		let t = {
			"__type__": "cc.PrefabInfo",
			"root": null,
			"asset": null,
			"fileId": "85j6K114BJzIDMSIKdqg3w",
			"sync": false
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, 'root');
		this.extendRefToIdWithKey(objs, t, 'asset');
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

let prefabInfo = new PrefabInfo();
module.exports = prefabInfo;