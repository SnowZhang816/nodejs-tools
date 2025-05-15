
class ConstantForce {
	create() {
		let t = {
			"__type__": "cc.ConstantForce",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_force": {
				"__type__": "cc.Vec3",
				"x": 0,
				"y": 0,
				"z": 0
			},
			"_localForce": {
				"__type__": "cc.Vec3",
				"x": 0,
				"y": 0,
				"z": 0
			},
			"_torque": {
				"__type__": "cc.Vec3",
				"x": 0,
				"y": 0,
				"z": 0
			},
			"_localTorque": {
				"__type__": "cc.Vec3",
				"x": 0,
				"y": 0,
				"z": 0
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

let constantForce = new ConstantForce();
module.exports = constantForce;