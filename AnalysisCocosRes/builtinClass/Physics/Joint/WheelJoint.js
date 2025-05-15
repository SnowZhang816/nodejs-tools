
class WheelJoint {
	create() {
		let t = {
			"__type__": "cc.WheelJoint",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"anchor": {
				"__type__": "cc.Vec2",
				"x": 0,
				"y": 0
			},
			"connectedAnchor": {
				"__type__": "cc.Vec2",
				"x": 0,
				"y": 0
			},
			"connectedBody": null,
			"collideConnected": false,
			"_maxMotorTorque": 0,
			"_motorSpeed": 0,
			"_enableMotor": false,
			"_frequency": 2,
			"_dampingRatio": 0.7,
			"localAxisA": {
				"__type__": "cc.Vec2",
				"x": 1,
				"y": 0
			},
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "connectedBody");
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

let wheelJoint = new WheelJoint();
module.exports = wheelJoint;