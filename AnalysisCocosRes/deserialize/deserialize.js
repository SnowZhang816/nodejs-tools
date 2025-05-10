let utils = require('../utils/utils.js');

const File = {
	Version: 0,
	Context: 0,

	SharedUuids: 1,
	SharedStrings: 2,
	SharedClasses: 3,
	SharedMasks: 4,

	Instances: 5,
	InstanceTypes: 6,

	Refs: 7,

	DependObjs: 8,
	DependKeys: 9,
	DependUuidIndices: 10,

	ARRAY_LENGTH: 11,
};

const DataTypeID = {
	SimpleType: 0,
	InstanceRef: 1,
	Array_InstanceRef: 2,
	Array_AssetRefByInnerObj: 3,
	Class: 4,
	ValueTypeCreated: 5,
	AssetRefByInnerObj: 6,
	TRS: 7,
	ValueType: 8,
	Array_Class: 9,
	CustomizedClass: 10,
	Dict: 11,
	Array: 12,
	ARRAY_LENGTH: 13,
}

const Refs = {
	EACH_RECORD_LENGTH: 3,
	OWNER_OFFSET: 0,
	KEY_OFFSET: 1,
	TARGET_OFFSET: 2,
}
const DICT_JSON_LAYOUT = 0;

const OBJ_DATA_MASK = 0;
const MASK_CLASS = 0;
const CLASS_TYPE = 0;
const CLASS_KEYS = 1;
const CLASS_PROP_TYPE_OFFSET = 2;

function findClass(type) {
	if (type === "cc.AnimationClip") {
		return require('../assets/animationClip.js');
	} else if (type === "cc.Asset") {
		return require('../assets/asset.js');
	} else if (type === "cc.AudioClip") {
		return require('../assets/audioClip.js');
	} else if (type === "cc.BitmapFont") {
		return require('../assets/bitmapFont.js');
	} else if (type === "cc.EffectAsset") {
		return require('../assets/effectAsset.js');
	} else if (type === "cc.JsonAsset") {
		return require('../assets/json.js');
	} else if (type === "cc.Material") {
		return require('../assets/material.js');
	} else if (type === "cc.Prefab") {
		return require('../assets/prefab.js');
	} else if (type === "cc.SkeletonData") {
		return require('../assets/skeletonData.js');
	} else if (type === "cc.SpriteAtlas") {
		return require('../assets/spriteAtlas.js');
	} else if (type === "cc.SpriteFrame") {
		return require('../assets/spriteFrame.js');
	} else if (type === "cc.Texture2D") {
		return require('../assets/texture2d.js');
	}
}

function genArrayParser(parser) {
	return function (data, owner, key, value) {
		owner[key] = value;
		for (let i = 0; i < value.length; ++i) {
			parser(data, value, i, value[i]);
		}
	};
}

function assignSimple(data, owner, key, value) {
	owner[key] = value;
}

function assignInstanceRef(data, owner, key, value) {
	if (value >= 0) {
		owner[key] = data[File.Instances][value];
	}
	else {
		(data[File.Refs])[(~value) * Refs.EACH_RECORD_LENGTH] = owner;
	}
}


function parseAssetRefByInnerObj(data, owner, key, value) {
	owner[key] = null;
	data[File.DependObjs][value] = owner;
}


function parseClass(data, owner, key, value) {
	owner[key] = deserializeCCObject(data, value);
}


const BuiltinValueTypeSetters = [
	// Vec2
	function (data) {
		return {
			"__type__": "cc.Vec2",
			"x": data[1],
			"y": data[2]
		}
	},
	// Vec3
	function (data) {
		return {
			"__type__": "cc.Vec3",
			"x": data[1],
			"y": data[2],
			"z": data[3]
		}
	},
	// Vec4
	function (data) {
		return {
			"__type__": "cc.Vec4",
			"x": data[1],
			"y": data[2],
			"z": data[3],
			"w": data[4]
		}
	},
	// Quat
	function (data) {
		return {
			"__type__": "cc.Quat",
			"x": data[1],
			"y": data[2],
			"z": data[3],
			"w": data[4]
		}
	},
	// Color
	function (data) {
		let val = data[1];
		return {
			"__type__": "cc.Color",
			"r": (val & 0x000000ff),
			"g": (val & 0x0000ff00) >> 8,
			"b": (val & 0x00ff0000) >>> 16,
			"a": (val & 0xff000000) >>> 24
		}
	},
	// Size
	function (data) {
		return {
			"__type__": "cc.Size",
			"width": data[1],
			"height": data[2]
		}
	},
	// Rect
	function (data) {
		return {
			"__type__": "cc.Rect",
			"x": data[1],
			"y": data[2],
			"width": data[3],
			"height": data[4]
		}
	},
	// Mat4
	function (data) {
		return {
			"__type__": "cc.Mat4",
			"m00": data[1],
			"m01": data[2],
			"m02": data[3],
			"m03": data[4],
			"m10": data[5],
			"m11": data[6],
			"m12": data[7],
			"m13": data[8],
			"m20": data[9],
			"m21": data[10],
			"m22": data[11],
			"m23": data[12],
			"m30": data[13],
			"m31": data[14],
			"m32": data[15],
			"m33": data[16],
		}
	}
];

function parseValueTypeCreated(data, owner, key, value) {
	owner[key] = BuiltinValueTypeSetters[value[VALUETYPE_SETTER]](value);
}

function parseTRS(data, owner, key, value) {
	owner[key] = {
		"__type__": "TypedArray",
		"ctor": "Float64Array",
		"array": [
			value[0],
			value[1],
			value[2],
			value[3],
			value[4],
			value[5],
			value[6],
			value[7],
			value[8],
			value[9],
		]
	}
}

const VALUETYPE_SETTER = 0;
function parseValueType(data, owner, key, value) {
	owner[key] = BuiltinValueTypeSetters[value[VALUETYPE_SETTER]](value);
}

function parseCustomClass(data, owner, key, value) {

}

function parseDict(data, owner, key, value) {
	let dict = value[DICT_JSON_LAYOUT];
	owner[key] = dict;
	for (let i = DICT_JSON_LAYOUT + 1; i < value.length; i += 3) {
		let key = value[i];
		let type = value[i + 1];
		let subValue = value[i + 2];
		let op = Assignment[type];
		op(data, dict, key, subValue);
	}
}

const ARRAY_ITEM_VALUES = 0;
function parseArray(data, owner, key, value) {
	let array = value[ARRAY_ITEM_VALUES];
	owner[key] = array;
	for (let i = 0; i < array.length; ++i) {
		let subValue = array[i];
		let type = value[i + 1];
		if (type !== DataTypeID.SimpleType) {
			let op = Assignment[type];
			op(data, array, i, subValue);
		}
	}
}

const Assignment = {
	[DataTypeID.SimpleType]: assignSimple,
	[DataTypeID.InstanceRef]: assignInstanceRef,
	[DataTypeID.Array_InstanceRef]: genArrayParser(assignInstanceRef),
	[DataTypeID.Array_AssetRefByInnerObj]: genArrayParser(parseAssetRefByInnerObj),
	[DataTypeID.Class]: parseClass,
	[DataTypeID.ValueTypeCreated]: parseValueTypeCreated,
	[DataTypeID.AssetRefByInnerObj]: parseAssetRefByInnerObj,
	[DataTypeID.TRS]: parseTRS,
	[DataTypeID.ValueType]: parseValueType,
	[DataTypeID.Array_Class]: genArrayParser(parseClass),
	[DataTypeID.CustomizedClass]: parseCustomClass,
	[DataTypeID.Dict]: parseDict,
	[DataTypeID.Array]: parseArray,
}

function parseResult(data) {
	let instances = data[File.Instances];
	let sharedStrings = data[File.SharedStrings];
	let dependSharedUuids = data[File.SharedUuids];

	let dependObjs = data[File.DependObjs];
	let dependKeys = data[File.DependKeys];
	let dependUuids = data[File.DependUuidIndices];

	for (let i = 0; i < dependObjs.length; ++i) {
		let obj = dependObjs[i];
		if (typeof obj === 'number') {
			dependObjs[i] = instances[obj];
		}
		else {
			// assigned by DataTypeID.AssetRefByInnerObj or added by Details object directly in _deserialize
		}
		let key = dependKeys[i];
		if (typeof key === 'number') {
			if (key >= 0) {
				key = sharedStrings[key];
			}
			else {
				key = ~key;
			}
			dependKeys[i] = key;
		}
		else {
			// added by Details object directly in _deserialize
		}
		let uuid = dependUuids[i];
		if (typeof uuid === 'number') {
			dependUuids[i] = dependSharedUuids[uuid];
		}
		else {
			// added by Details object directly in _deserialize
		}
	}
}

function getMissingClass(hasCustomFinder, type) {
	if (!hasCustomFinder) {
		// @ts-ignore
		deserialize.reportMissingClass(type);
	}
	return Object;
}

function doLookupClass(classFinder, type, container, index, silent, hasCustomFinder) {
	let klass = classFinder(type);
	if (!klass) {
		if (silent) {
			// generate a lazy proxy for ctor
			container[index] = (function (container, index, type) {
				return function proxy() {
					let klass = classFinder(type) || getMissingClass(hasCustomFinder, type);
					container[index] = klass;
					return new klass();
				};
			})(container, index, type);
			return;
		}
		else {
			klass = getMissingClass(hasCustomFinder, type);
		}
	}
	container[index] = klass;
}

function lookupClasses(data, silent) {
	let classFinder = findClass;
	let classes = data[File.SharedClasses];
	for (let i = 0; i < classes.length; ++i) {
		let klassLayout = classes[i];
		if (typeof klassLayout !== 'string') {
			let type = klassLayout[0];
			doLookupClass(classFinder, type, klassLayout, CLASS_TYPE, silent);
		}
		else {
			doLookupClass(classFinder, klassLayout, classes, i, silent);
		}
	}
}

function cacheMasks(data) {
	let masks = data[File.SharedMasks];
	if (masks) {
		let classes = data[File.SharedClasses];
		for (let i = 0; i < masks.length; ++i) {
			let mask = masks[i];
			// @ts-ignore
			mask[MASK_CLASS] = classes[mask[MASK_CLASS]];
		}
	}
}

function deserializeCCObject(data, objectData) {
	let mask = data[File.SharedMasks][objectData[OBJ_DATA_MASK]];
	let clazz = mask[MASK_CLASS];
	let ctor = clazz[CLASS_TYPE];

	if (!ctor) {
		lookupClasses(data, true);
		cacheMasks(data);
	}

	clazz = mask[MASK_CLASS];
	ctor = clazz[CLASS_TYPE];
	let obj = {}
	if (ctor && ctor.create) {
		obj = ctor.create();
	}

	let keys = clazz[CLASS_KEYS];
	let classTypeOffset = clazz[CLASS_PROP_TYPE_OFFSET];
	let maskTypeOffset = mask[mask.length - 1];

	// parse simple type
	let i = MASK_CLASS + 1;
	for (; i < maskTypeOffset; ++i) {
		let maskIndex = mask[i];
		let key = keys[maskIndex];
		obj[key] = objectData[i];
	}

	// parse advanced type
	for (; i < objectData.length; ++i) {
		let maskIndex = mask[i];
		let key = keys[maskIndex];
		let type = clazz[maskIndex + classTypeOffset];
		let op = Assignment[type];
		op(data, obj, key, objectData[i]);
	}

	return obj;
}

class Deserialize {
	parseInstances(data) {
		let instances = data[File.Instances];
		let instanceTypes = data[File.InstanceTypes];
		let instanceTypesLen = instanceTypes === 0 ? 0 : instanceTypes.length;
		let rootIndex = instances[instances.length - 1]
		let normalObjectCount = instances.length - instanceTypesLen;
		if (typeof rootIndex !== 'number') {
			rootIndex = 0;
		} else {
			if (rootIndex < 0) {
				rootIndex = ~rootIndex;
			}
			normalObjectCount--;
		}

		let insIndex = 0;
		for (; insIndex < normalObjectCount; ++insIndex) {
			instances[insIndex] = deserializeCCObject(data, instances[insIndex]);
		}

		parseResult(data);

		let dependObjs = data[File.DependObjs];
		let dependKeys = data[File.DependKeys];
		let dependUuids = data[File.DependUuidIndices];
		for (var i = 0; i < dependUuids.length; i++) {
			var dependUuid = utils.decodeUUID(dependUuids[i]);
			let owner = dependObjs[i];
			let key = dependKeys[i];
			for (let k in owner) {
				if (k === key) {
					owner[k] = {
						__uuid__: dependUuid,
					}
				}
			}
		}

		return rootIndex;
	}
}


let deserialize = new Deserialize();
module.exports = {
	deserialize,
	File,
	findClass,
	lookupClasses,
	cacheMasks,
};