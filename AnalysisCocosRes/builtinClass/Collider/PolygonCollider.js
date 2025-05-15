class PolygonCollider {
	create() {
		let t = {
			"__type__": "cc.PolygonCollider",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"tag": 0,
			"_offset": {
				"__type__": "cc.Vec2",
				"x": 0,
				"y": 0
			},
			"points": [
				{
					"__type__": "cc.Vec2",
					"x": -50,
					"y": -50
				},
				{
					"__type__": "cc.Vec2",
					"x": 50,
					"y": -50
				},
				{
					"__type__": "cc.Vec2",
					"x": 50,
					"y": 50
				},
				{
					"__type__": "cc.Vec2",
					"x": -50,
					"y": 50
				}
			],
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

let polygonCollider = new PolygonCollider();
module.exports = polygonCollider;