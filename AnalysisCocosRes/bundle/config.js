let utils = require('../utils/utils.js');
let path = require('path');
let fs = require('fs');
let { Pack } = require('./pack.js');
const { findClass } = require('../deserialize/findClass.js')

function processOptions(options) {
	var uuids = options.uuids;
	var paths = options.paths;
	var types = options.types;
	var bundles = options.deps;
	var realEntries = (options.paths = Object.create(null));

	if (options.debug === false) {
		for (let i = 0, l = uuids.length; i < l; i++) {
			uuids[i] = utils.decodeUUID(uuids[i]);
		}

		for (let id in paths) {
			let entry = paths[id];
			let type = entry[1];
			entry[1] = types[type];
		}
	} else {
		var out = Object.create(null);
		for (let i = 0, l = uuids.length; i < l; i++) {
			let uuid = uuids[i];
			uuids[i] = out[uuid] = utils.decodeUUID(uuid);
		}
		uuids = out;
	}

	for (let id in paths) {
		let entry = paths[id];
		realEntries[uuids[id]] = entry;
	}

	var scenes = options.scenes;
	for (let name in scenes) {
		let uuid = scenes[name];
		scenes[name] = uuids[uuid];
	}

	var packs = options.packs;
	for (let packId in packs) {
		let packedIds = packs[packId];
		for (let j = 0; j < packedIds.length; ++j) {
			packedIds[j] = uuids[packedIds[j]];
		}
	}

	var versions = options.versions;
	if (versions) {
		for (let folder in versions) {
			var entries = versions[folder];
			for (let i = 0; i < entries.length; i += 2) {
				let uuid = entries[i];
				entries[i] = uuids[uuid] || uuid;
			}
		}
	}

	var redirect = options.redirect;
	if (redirect) {
		for (let i = 0; i < redirect.length; i += 2) {
			redirect[i] = uuids[redirect[i]];
			redirect[i + 1] = bundles[redirect[i + 1]];
		}
	}
}

function normalize(url) {
	if (url) {
		if (url.charCodeAt(0) === 46 && url.charCodeAt(1) === 47) {
			// strip './'
			url = url.slice(2);
		} else if (url.charCodeAt(0) === 47) {
			// strip '/'
			url = url.slice(1);
		}
	}
	return url;
}

class Config {
	name = '';

	bundlePath = '';

	base = '';

	importBase = '';

	nativeBase = '';

	deps = null;

	assetInfos = new Map();

	scenes = new Map();

	paths = new Map();

	packs = {};

	init(options, bundlePath) {
		this.bundlePath = bundlePath;
		processOptions(options);

		this.importBase = options.importBase || '';
		this.nativeBase = options.nativeBase || '';
		this.base = options.base || '';
		this.name = options.name || '';
		this.deps = options.deps || [];

		// init
		this._initUuid(options.uuids);
		this._initPath(options.paths);
		this._initScene(options.scenes);
		this._initPackage(options.packs);
		this._initVersion(options.versions);
		this._initRedirect(options.redirect);

		for (var packUuid in options.packs) {
			var uuids = options.packs[packUuid];

			let uuid = packUuid;
			let asset = this.assetInfos.get(uuid);
			let importVer = asset.ver;
			let srcAsset = path.join(this.bundlePath, `import/${uuid.slice(0, 2)}/${uuid}.json`);
			if (importVer) {
				srcAsset = path.join(this.bundlePath, `import/${uuid.slice(0, 2)}/${uuid}.${importVer}.json`);
			}
			if (fs.existsSync(srcAsset)) {
				let packJson = fs.readFileSync(srcAsset, 'utf8');
				let json = JSON.parse(packJson);
				if (Array.isArray(json)) {
					let pack = new Pack();
					let out = pack.unpack(json);
					for (var j = 0; j < uuids.length; ++j) {
						let assets = this.getAssetInfo(uuids[j]);
						assets.packInfo = out[j]
					}
				} else {
					if (json.type === 'cc.Texture2D') {
						if (json.data) {
							var datas = json.data.split('|');
							if (datas.length !== uuids.length) {
								console.error(`texture pack data length not match: ${datas.length} !== ${pack.length}`);
							}
							for (let i = 0; i < uuids.length; i++) {
								let assets = this.getAssetInfo(uuids[i]);
								assets.packInfo = Pack.prototype.packCustomObjData('cc.Texture2D', datas[i], true)
							}
						}
					}
				}
			}
		}
	}

	_initUuid(uuidList) {
		if (!uuidList) return;
		this.assetInfos.clear();
		for (var i = 0, l = uuidList.length; i < l; i++) {
			var uuid = uuidList[i];
			this.assetInfos.set(uuid, { uuid });
		}
	}

	_initPath(pathList) {
		if (!pathList) return;
		var paths = this.paths;
		paths.clear();
		for (var uuid in pathList) {
			var info = pathList[uuid];
			var path = info[0];
			var type = info[1];
			var isSubAsset = info.length === 3;

			var assetInfo = this.assetInfos.get(uuid);
			assetInfo.path = path;
			assetInfo.ctor = findClass(type);
			if (paths.has(path)) {
				if (isSubAsset) {
					paths.get(path).push(assetInfo);
				} else {
					paths.get(path).unshift(assetInfo);
				}
			} else {
				paths.set(path, [assetInfo]);
			}
		}
	}

	_initScene(sceneList) {
		if (!sceneList) return;
		var scenes = this.scenes;
		scenes.clear();
		var assetInfos = this.assetInfos;
		for (var sceneName in sceneList) {
			var uuid = sceneList[sceneName];
			var assetInfo = assetInfos.get(uuid);
			assetInfo.url = sceneName;
			scenes.set(sceneName, assetInfo);
		}
	}

	_initPackage(packageList) {
		if (!packageList) return;
		var assetInfos = this.assetInfos;
		for (var packUuid in packageList) {
			var uuids = packageList[packUuid];
			var pack = { uuid: packUuid, packs: uuids, ext: '.json' };
			assetInfos.set(packUuid, pack);

			for (var i = 0, l = uuids.length; i < l; i++) {
				var uuid = uuids[i];
				var assetInfo = assetInfos.get(uuid);
				var assetPacks = assetInfo.packs;
				if (assetPacks) {
					if (l === 1) {
						assetPacks.unshift(pack);
					} else {
						assetPacks.push(pack);
					}
				} else {
					assetInfo.packs = [pack];
				}
			}
		}
	}

	_initVersion(versions) {
		if (!versions) return;
		var assetInfos = this.assetInfos;
		var entries = versions.import;
		if (entries) {
			for (var i = 0, l = entries.length; i < l; i += 2) {
				var uuid = entries[i];
				var assetInfo = assetInfos.get(uuid);
				assetInfo.ver = entries[i + 1];
			}
		}
		entries = versions.native;
		if (entries) {
			for (var i = 0, l = entries.length; i < l; i += 2) {
				var uuid = entries[i];
				var assetInfo = assetInfos.get(uuid);
				assetInfo.nativeVer = entries[i + 1];
			}
		}
	}

	_initRedirect(redirect) {
		if (!redirect) return;
		var assetInfos = this.assetInfos;
		for (var i = 0, l = redirect.length; i < l; i += 2) {
			var uuid = redirect[i];
			var assetInfo = assetInfos.get(uuid);
			assetInfo.redirect = redirect[i + 1];
		}
	}

	getInfoWithPath(path, type) {
		if (!path) {
			return null;
		}
		path = normalize(path);
		var items = this.paths.get(path);
		if (items) {
			if (type) {
				for (var i = 0, l = items.length; i < l; i++) {
					var assetInfo = items[i];
					if (assetInfo.ctor === type) {
						return assetInfo;
					}
				}
			} else {
				return items[0];
			}
		}
		return null;
	}

	getDirWithPath(path, type, out) {
		path = normalize(path);
		if (path[path.length - 1] === '/') {
			path = path.slice(0, -1);
		}

		var infos = out || [];
		function isMatchByWord(path, test) {
			if (path.length > test.length) {
				var nextAscii = path.charCodeAt(test.length);
				return nextAscii === 47; // '/'
			}
			return true;
		}
		this.paths.forEach(function (items, p) {
			if ((p.startsWith(path) && isMatchByWord(p, path)) || !path) {
				for (var i = 0, l = items.length; i < l; i++) {
					var entry = items[i];
					if (!type || entry.ctor == type) {
						infos.push(entry);
					}
				}
			}
		});

		return infos;
	}

	getAssetInfo(uuid) {
		return this.assetInfos.get(uuid);
	}

	getSceneInfo(name) {
		if (!name.endsWith('.fire')) {
			name += '.fire';
		}
		if (name[0] !== '/' && !name.startsWith('db://')) {
			name = '/' + name; // 使用全名匹配
		}
		// search scene
		var info = this.scenes.find(function (val, key) {
			return key.endsWith(name);
		});
		return info;
	}

	clear() {
		this.paths.clear();
		this.scenes.clear();
		this.assetInfos.clear();
	}
}

module.exports = Config;
