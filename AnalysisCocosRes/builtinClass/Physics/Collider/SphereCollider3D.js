
class SphereCollider3D {
	create() {
		let t = {
			"__type__": "cc.SphereCollider3D",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_material": null,
			"_isTrigger": false,
			"_center": {
				"__type__": "cc.Vec3",
				"x": 0,
				"y": 0,
				"z": 0
			},
			"_radius": 0.5,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "_material");
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

let sphereCollider3D = new SphereCollider3D();
module.exports = sphereCollider3D;