class VideoPlayer {
	create() {
		let t = {
			"__type__": "cc.VideoPlayer",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_resourceType": 1,
			"_remoteURL": "",
			"_clip": null,
			"_volume": 1,
			"_mute": false,
			"_isFullscreen": false,
			"_N$isFullscreen": false,
			"_stayOnBottom": false,
			"videoPlayerEvent": [],
			"_N$keepAspectRatio": true,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "_clip");

		this.extendRefsToIdWithKey(objs, t, "videoPlayerEvent");

		t._isFullscreen = t._N$isFullscreen;
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


let videoPlayer = new VideoPlayer();
module.exports = videoPlayer;