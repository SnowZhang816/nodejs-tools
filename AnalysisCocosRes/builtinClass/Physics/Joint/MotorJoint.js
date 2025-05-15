
class MotorJoint {
	create() {
		let t = {
			"__type__": "cc.MotorJoint",
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
			"_linearOffset": {
				"__type__": "cc.Vec2",
				"x": 0,
				"y": 0
			},
			"_angularOffset": 0,
			"_maxForce": 1,
			"_maxTorque": 1,
			"_correctionFactor": 0.3,
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

let motorJoint = new MotorJoint();
module.exports = motorJoint;