class ClickEvent {
	create() {
		let t = {
			"__type__": "cc.ClickEvent",
			"target": null,
			"component": "",
			"_componentId": "",
			"handler": "",
			"customEventData": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "target");
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

let clickEvent = new ClickEvent();
module.exports = clickEvent;