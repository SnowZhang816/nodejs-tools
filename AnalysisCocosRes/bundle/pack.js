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

	ARRAY_LENGTH: 11,  // 通常不需要这个属性，因为可以通过Object.keys(File).length来获取
};
const SUPPORT_MIN_FORMAT_VERSION = 1;
const MASK_CLASS = 0;
const PACKED_SECTIONS = File.Instances;

class Pack {
	sharedUuids = [];
	version = 0;
	sharedStrings = [];
	sharedClasses = [];
	sharedMasks = [];

	files = {};

	cacheMasks(data) {
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

	unpack(json) {
		if (json[File.Version] < SUPPORT_MIN_FORMAT_VERSION) {
			throw new Error(`不支持的版本:${json[File.Version]}`);
		}

		this.cacheMasks(json);

		this.version = json[File.Version];
		this.sharedUuids = json[File.SharedUuids];
		this.sharedStrings = json[File.SharedStrings];
		this.sharedClasses = json[File.SharedClasses];
		this.sharedMasks = json[File.SharedMasks];

		let pack = json[PACKED_SECTIONS];
		for (let i = 0; i < pack.length; ++i) {
			pack[i].unshift(this.version, this.sharedUuids, this.sharedStrings, this.sharedClasses, this.sharedMasks);
		}
		return pack;
	}
}

module.exports = { Pack };