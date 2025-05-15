class Widget {
	create() {
		let t = {
			"__type__": "cc.Widget",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"alignMode": 1,
			"_target": null,
			"_alignFlags": 0,
			"_left": 0,
			"_right": 0,
			"_top": 0,
			"_bottom": 0,
			"_verticalCenter": 0,
			"_horizontalCenter": 0,
			"_isAbsLeft": true,
			"_isAbsRight": true,
			"_isAbsTop": true,
			"_isAbsBottom": true,
			"_isAbsHorizontalCenter": true,
			"_isAbsVerticalCenter": true,
			"_originalWidth": 0,
			"_originalHeight": 0,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		let node = t.node;
		if (node) {
			for (let i = 0; i < objs.length; ++i) {
				let obj = objs[i];
				if (obj === node) {
					t.node = {
						"__id__": i
					}
					break;
				}
			}
		}

		let target = t._target;
		if (target) {
			for (let i = 0; i < objs.length; ++i) {
				let obj = objs[i];
				if (obj === target) {
					t._target = {
						"__id__": i
					}
					break;
				}
			}
		}
	}
}

let widget = new Widget();
module.exports = widget;