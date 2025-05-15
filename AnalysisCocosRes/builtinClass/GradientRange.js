class GradientRange {
	create() {
		let t = {
			"__type__": "cc.GradientRange",
			"_mode": 0,
			"color": {
				"__type__": "cc.Color",
				"r": 255,
				"g": 255,
				"b": 255,
				"a": 255
			}
		};
		return t;
	}

	extendRefToId(objs, t) {
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


let gradientRange = new GradientRange();
module.exports = gradientRange;