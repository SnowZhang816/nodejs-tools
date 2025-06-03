let globalInfo = { ENGINE_VERSION: "2.0.0" }


function GetMetaVersion(ctor) {
	if (globalInfo.ENGINE_VERSION == '2.1.14') {
		if (ctor == "cc.BitmapFont") {
			return "2.1.2"
		} else if (ctor == "cc.AudioClip") {
			return "2.0.3"
		} else if (ctor == "cc.SpriteFrame") {
			return "1.0.6"
		} else if (ctor == "cc.Texture2D") {
			return "2.3.7"
		} else if (ctor == "cc.Asset") {
			return "1.0.3"
		} else if (ctor == "cc.SkeletonData") {
			return "1.2.5"
		} else if (ctor == "cc.Prefab") {
			return "1.3.2"
		} else if (ctor == "cc.AnimationClip") {
			return "2.1.2"
		} else if (ctor == "cc.JsonAsset") {
			return "1.0.2"
		} else if (ctor == "cc.SpriteAtlas") {
			return "1.2.5"
		} else if (ctor == "cc.EffectAsset") {
			return "1.0.27"
		} else if (ctor == "cc.Material") {
			return "1.0.5"
		} else if (ctor == "cc.TTFFont") {
			return "1.1.2"
		} else if (ctor == "cc.PhysicsMaterial") {
			return "1.0.2"
		} else if (ctor == "cc.LabelAtlas") {
			return "1.1.2"
		} else if (ctor == "cc.Scene") {
			return "1.3.2"
		} else if (ctor == "cc.TextAsset") {
			return "1.0.1"
		}
	}
}

module.exports = { GetMetaVersion, globalInfo };