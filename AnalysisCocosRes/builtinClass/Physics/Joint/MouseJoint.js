
class MouseJoint {
	create() {
		let t = {
			"__type__": "cc.MouseJoint",
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
			"collideConnected": true,
			"_target": 1,
			"_frequency": 5,
			"_dampingRatio": 0.7,
			"_maxForce": 0,
			"mouseRegion": null,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "connectedBody");
		this.extendRefToIdWithKey(objs, t, "mouseRegion");
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

let mouseJoint = new MouseJoint();
module.exports = mouseJoint;