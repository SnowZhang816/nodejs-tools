
let utils = require('../utils/utils.js');

const { File, lookupClasses, cacheMasks } = require('../deserialize/deserialize.js')

const SUPPORT_MIN_FORMAT_VERSION = 1;
const MASK_CLASS = 0;
const PACKED_SECTIONS = File.Instances;
const EMPTY_PLACEHOLDER = 0;

class Pack {
	sharedUuids = [];
	version = 0;
	sharedStrings = [];
	sharedClasses = [];
	sharedMasks = [];

	files = {};

	unpack(json) {
		if (json[File.Version] < SUPPORT_MIN_FORMAT_VERSION) {
			throw new Error(`不支持的版本:${json[File.Version]}`);
		}

		lookupClasses(json, true);
		cacheMasks(json);

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

	packCustomObjData(type, data, hasNativeDep) {
		return [
			SUPPORT_MIN_FORMAT_VERSION, EMPTY_PLACEHOLDER, EMPTY_PLACEHOLDER,
			[type],
			EMPTY_PLACEHOLDER,
			hasNativeDep ? [data, ~0] : [data],
			[0],
			EMPTY_PLACEHOLDER, [], [], []
		];
	}

	hasNativeDep(data) {
		let instances = data[File.Instances];
		let rootInfo = instances[instances.length - 1];
		if (typeof rootInfo !== 'number') {
			return false;
		}
		else {
			return rootInfo < 0;
		}
	}
}

module.exports = { Pack, File };