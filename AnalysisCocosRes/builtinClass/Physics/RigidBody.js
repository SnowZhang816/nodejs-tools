
class RigidBody {
	create() {
		let t = {
			"__type__": "cc.RigidBody",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_type": 2,
			"_allowSleep": true,
			"_gravityScale": 1,
			"_linearDamping": 0,
			"_angularDamping": 0,
			"_linearVelocity": {
				"__type__": "cc.Vec2",
				"x": 0,
				"y": 0
			},
			"_angularVelocity": 0,
			"_fixedRotation": false,
			"enabledContactListener": false,
			"bullet": false,
			"awakeOnLoad": true,
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

let rigidBody = new RigidBody();
module.exports = rigidBody;