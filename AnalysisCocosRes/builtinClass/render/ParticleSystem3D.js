class ParticleSystem3D {
	create() {
		let t = {
			"__type__": "cc.ParticleSystem3D",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_materials": [],
			"duration": 5,
			"_capacity": 100,
			"loop": true,
			"playOnAwake": true,
			"_prewarm": false,
			"_simulationSpace": 1,
			"simulationSpeed": 1,
			"startDelay": null,
			"startLifetime": null,
			"startColor": null,
			"scaleSpace": 1,
			"startSize": null,
			"startSpeed": null,
			"startRotation": null,
			"gravityModifier": null,
			"rateOverTime": null,
			"rateOverDistance": null,
			"bursts": [],
			"_renderMode": 0,
			"_velocityScale": 1,
			"_lengthScale": 1,
			"_mesh": null,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "startDelay");
		this.extendRefToIdWithKey(objs, t, "startLifetime");
		this.extendRefToIdWithKey(objs, t, "startColor");
		this.extendRefToIdWithKey(objs, t, "startSize");
		this.extendRefToIdWithKey(objs, t, "startSpeed");
		this.extendRefToIdWithKey(objs, t, "startRotation");
		this.extendRefToIdWithKey(objs, t, "gravityModifier");
		this.extendRefToIdWithKey(objs, t, "rateOverTime");
		this.extendRefToIdWithKey(objs, t, "rateOverDistance");
		this.extendRefToIdWithKey(objs, t, "_mesh");

		this.extendRefsToIdWithKey(objs, t, "_materials");
		this.extendRefsToIdWithKey(objs, t, "bursts");
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

	extendRefsToIdWithKey(objs, t, key) {
		let keysValue = t[key];
		for (let i = 0; i < keysValue.length; ++i) {
			let value = keysValue[i];
			for (let j = 0; j < objs.length; ++j) {
				let obj = objs[j];
				if (obj === value) {
					keysValue[i] = {
						"__id__": j
					}
					break;
				}
			}
		}
	}
}


let particleSystem3D = new ParticleSystem3D();
module.exports = particleSystem3D;