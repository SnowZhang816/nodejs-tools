class Skeleton {
	create() {
		let t = {
			"__type__": "sp.Skeleton",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_materials": [],
			"paused": false,
			"defaultSkin": "",
			"defaultAnimation": "",
			"_preCacheMode": -1,
			"_cacheMode": 0,
			"loop": true,
			"premultipliedAlpha": true,
			"timeScale": 1,
			"_accTime": 0,
			"_playCount": 0,
			"_frameCache": null,
			"_curFrame": null,
			"_skeletonCache": null,
			"_animationName": "",
			"_animationQueue": [],
			"_headAniInfo": null,
			"_playTimes": 0,
			"_isAniComplete": true,
			"_N$skeletonData": null,
			"_N$_defaultCacheMode": 0,
			"_N$debugSlots": false,
			"_N$debugBones": false,
			"_N$debugMesh": false,
			"_N$useTint": false,
			"_N$enableBatch": false,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "_frameCache");
		this.extendRefToIdWithKey(objs, t, "_curFrame");
		this.extendRefToIdWithKey(objs, t, "_skeletonCache");
		this.extendRefToIdWithKey(objs, t, "_headAniInfo");
		this.extendRefToIdWithKey(objs, t, "_N$skeletonData");

		this.extendRefsToIdWithKey(objs, t, "_materials");
		this.extendRefsToIdWithKey(objs, t, "_animationQueue");
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


let skeleton = new Skeleton();
module.exports = skeleton;