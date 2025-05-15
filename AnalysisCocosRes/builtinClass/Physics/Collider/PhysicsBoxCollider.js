class PhysicsBoxCollider {
	create() {
		let t = {
			"__type__": "cc.PhysicsBoxCollider",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"tag": 0,
			"_density": 1,
			"_sensor": false,
			"_friction": 0.2,
			"_restitution": 0,
			"body": null,
			"_offset": {
				"__type__": "cc.Vec2",
				"x": 0,
				"y": 0
			},
			"_size": {
				"__type__": "cc.Size",
				"width": 100,
				"height": 100
			},
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "body");
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

let physicsBoxCollider = new PhysicsBoxCollider();
module.exports = physicsBoxCollider;