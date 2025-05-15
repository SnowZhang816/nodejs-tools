
class PrismaticJoint {
	create() {
		let t = {
			"__type__": "cc.PrismaticJoint",
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
			"localAxisA": {
				"__type__": "cc.Vec2",
				"x": 1,
				"y": 0
			},
			"referenceAngle": 0,
			"enableLimit": false,
			"enableMotor": false,
			"lowerLimit": 0,
			"upperLimit": 0,
			"_maxMotorForce": 0,
			"_motorSpeed": 0,
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

let prismaticJoint = new PrismaticJoint();
module.exports = prismaticJoint;