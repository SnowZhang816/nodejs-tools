
class RigidBody3D {
	create() {
		let t = {
			"__type__": "cc.RigidBody3D",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_mass": 10,
			"_linearDamping": 0.1,
			"_angularDamping": 0.1,
			"_fixedRotation": false,
			"_isKinematic": false,
			"_useGravity": true,
			"_linearFactor": {
				"__type__": "cc.Vec3",
				"x": 1,
				"y": 1,
				"z": 1
			},
			"_angularFactor": {
				"__type__": "cc.Vec3",
				"x": 1,
				"y": 1,
				"z": 1
			},
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

let rigidBody3D = new RigidBody3D();
module.exports = rigidBody3D;