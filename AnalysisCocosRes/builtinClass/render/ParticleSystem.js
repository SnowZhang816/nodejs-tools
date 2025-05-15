class ParticleSystem {
	create() {
		let t = {
			"__type__": "cc.ParticleSystem",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_materials": [],
			"_srcBlendFactor": 770,
			"_dstBlendFactor": 1,
			"_custom": false,
			"_file": null,
			"_spriteFrame": null,
			"_texture": null,
			"_stopped": false,
			"playOnLoad": true,
			"autoRemoveOnFinish": false,
			"totalParticles": 200,
			"duration": -1,
			"emissionRate": 999.999985098839,
			"life": 0.20000000298023224,
			"lifeVar": 0.5,
			"_startColor": {
				"__type__": "cc.Color",
				"r": 202,
				"g": 200,
				"b": 86,
				"a": 163
			},
			"_startColorVar": {
				"__type__": "cc.Color",
				"r": 229,
				"g": 255,
				"b": 173,
				"a": 198
			},
			"_endColor": {
				"__type__": "cc.Color",
				"r": 173,
				"g": 161,
				"b": 19,
				"a": 214
			},
			"_endColorVar": {
				"__type__": "cc.Color",
				"r": 107,
				"g": 249,
				"b": 249,
				"a": 188
			},
			"angle": 360,
			"angleVar": 360,
			"startSize": 3.369999885559082,
			"startSizeVar": 50,
			"endSize": 30.31999969482422,
			"endSizeVar": 0,
			"startSpin": -47.369998931884766,
			"startSpinVar": 0,
			"endSpin": -47.369998931884766,
			"endSpinVar": -142.11000061035156,
			"sourcePos": {
				"__type__": "cc.Vec2",
				"x": 0,
				"y": 0
			},
			"posVar": {
				"__type__": "cc.Vec2",
				"x": 7,
				"y": 7
			},
			"_positionType": 1,
			"positionType": 1,
			"emitterMode": 0,
			"gravity": {
				"__type__": "cc.Vec2",
				"x": 0.25,
				"y": 0.8600000143051147
			},
			"speed": 0,
			"speedVar": 190.7899932861328,
			"tangentialAccel": -92.11000061035156,
			"tangentialAccelVar": 65.79000091552734,
			"radialAccel": -671.0499877929688,
			"radialAccelVar": 65.79000091552734,
			"rotationIsDir": false,
			"startRadius": 0,
			"startRadiusVar": 0,
			"endRadius": 0,
			"endRadiusVar": 0,
			"rotatePerS": 0,
			"rotatePerSVar": 0,
			"_N$preview": true,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "_file");
		this.extendRefToIdWithKey(objs, t, "_spriteFrame");
		this.extendRefToIdWithKey(objs, t, "_texture");

		this.extendRefsToIdWithKey(objs, t, "_materials");
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


let particleSystem = new ParticleSystem();
module.exports = particleSystem;