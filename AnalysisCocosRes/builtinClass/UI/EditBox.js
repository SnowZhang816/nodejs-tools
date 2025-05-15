class EditBox {
	create() {
		let t = {
			"__type__": "cc.EditBox",
			"_name": "",
			"_objFlags": 0,
			"node": null,
			"_enabled": true,
			"_string": "",
			"returnType": 0,
			"maxLength": 8,
			"_tabIndex": 0,
			"editingDidBegan": [],
			"textChanged": [],
			"editingDidEnded": [],
			"editingReturn": [],
			"_N$textLabel": null,
			"_N$placeholderLabel": null,
			"_N$background": null,
			"_N$inputFlag": 5,
			"_N$inputMode": 6,
			"_N$stayOnTop": false,
			"_id": ""
		};
		return t;
	}

	extendRefToId(objs, t) {
		this.extendRefToIdWithKey(objs, t, "node");
		this.extendRefToIdWithKey(objs, t, "_N$textLabel");
		this.extendRefToIdWithKey(objs, t, "_N$placeholderLabel");
		this.extendRefToIdWithKey(objs, t, "_N$background");

		this.extendRefsToIdWithKey(objs, t, "editingDidBegan");
		this.extendRefsToIdWithKey(objs, t, "textChanged");
		this.extendRefsToIdWithKey(objs, t, "editingDidEnded");
		this.extendRefsToIdWithKey(objs, t, "editingReturn");
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


let editBox = new EditBox();
module.exports = editBox;