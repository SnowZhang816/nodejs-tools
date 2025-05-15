class DragonBones {
	create() {
		let t = {
			"__type__": "dragonBones.ArmatureDisplay",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_materials": [],
			"_armatureName": "",
			"_animationName": "",
			"_preCacheMode": -1,
			"_cacheMode": 0,
			"playTimes": -1,
			"premultipliedAlpha": false,
			"_armatureKey": "",
			"_accTime": 0,
			"_playCount": 0,
			"_frameCache": null,
			"_curFrame": null,
			"_playing": false,
			"_armatureCache": null,
			"_N$dragonAsset": null,
			"_N$dragonAtlasAsset": null,
			"_N$_defaultArmatureIndex": 0,
			"_N$_animationIndex": 0,
			"_N$_defaultCacheMode": 0,
			"_N$timeScale": 1,
			"_N$debugBones": false,
			"_N$enableBatch": false,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "_frameCache");
		this.extendRefToIdWithKey(objs, t, "_curFrame");
		this.extendRefToIdWithKey(objs, t, "_N$dragonAsset");
		this.extendRefToIdWithKey(objs, t, "_N$dragonAtlasAsset");
		this.extendRefToIdWithKey(objs, t, "_armatureCache");

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


let dragonBones = new DragonBones();
module.exports = dragonBones;