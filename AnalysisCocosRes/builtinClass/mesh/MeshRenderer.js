class MeshRenderer {
	create() {
		let t = {
			"__type__": "cc.MeshRenderer",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_materials": [],
			"_mesh": null,
			"_receiveShadows": false,
			"_shadowCastingMode": 0,
			"_enableAutoBatch": false,
			"textures": [],
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "_mesh");

		this.extendRefsToIdWithKey(objs, t, "_materials");
		this.extendRefsToIdWithKey(objs, t, "textures");
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


let meshRenderer = new MeshRenderer();
module.exports = meshRenderer;