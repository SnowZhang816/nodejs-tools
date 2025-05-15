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
	} else if (type === "cc.Node") {
		return require('../builtinClass/node.js');
	} else if (type === "cc.PrefabInfo") {
		return require('../builtinClass/prefabInfo.js');
	} else if (type === "cc.Widget") {
		return require('../builtinClass/UI/widget.js');
	} else if (type === "cc.BlockInputEvents") {
		return require('../builtinClass/UI/blockInputEvents.js');
	} else if (type === "cc.Button") {
		return require('../builtinClass/UI/button.js');
	} else if (type === "cc.ClickEvent") {
		return require('../builtinClass/ClickEvent.js');
	} else if (type === "cc.Label") {
		return require('../builtinClass/render/Label.js');
	} else if (type === "cc.Sprite") {
		return require('../builtinClass/render/Sprite.js');
	} else if (type === "cc.Canvas") {
		return require('../builtinClass/UI/Canvas.js');
	} else if (type === "cc.Camera") {
		return require('../builtinClass/Other/Camera.js');
	} else if (type === "cc.Animation") {
		return require('../builtinClass/Other/Animation.js');
	} else if (type === "cc.AudioSource") {
		return require('../builtinClass/Other/AudioSource.js');
	} else if (type === "cc.MotionStreak") {
		return require('../builtinClass/Other/MotionStreak.js');
	} else if (type === "cc.SkeletonAnimation") {
		return require('../builtinClass/Other/SkeletonAnimation.js');
	} else if (type === "cc.SubContextView") {
		return require('../builtinClass/Other/SubContextView.js');
	} else if (type === "cc.EditBox") {
		return require('../builtinClass/UI/EditBox.js');
	} else if (type === "cc.Layout") {
		return require('../builtinClass/UI/Layout.js');
	} else if (type === "cc.Scrollbar") {
		return require('../builtinClass/UI/Scrollbar.js');
	} else if (type === "cc.ScrollView") {
		return require('../builtinClass/UI/ScrollView.js');
	} else if (type === "cc.Mask") {
		return require('../builtinClass/render/Mask.js');
	} else if (type === "cc.Slider") {
		return require('../builtinClass/UI/Slider.js');
	} else if (type === "cc.PageViewIndicator") {
		return require('../builtinClass/UI/PageViewIndicator.js');
	} else if (type === "cc.PageView") {
		return require('../builtinClass/UI/PageView.js');
	} else if (type === "cc.ProgressBar") {
		return require('../builtinClass/UI/ProgressBar.js');
	} else if (type === "cc.Toggle") {
		return require('../builtinClass/UI/Toggle.js');
	} else if (type === "cc.ToggleContainer") {
		return require('../builtinClass/UI/ToggleContainer.js');
	} else if (type === "cc.ToggleGroup") {
		return require('../builtinClass/UI/ToggleGroup.js');
	} else if (type === "cc.VideoPlayer") {
		return require('../builtinClass/UI/VideoPlayer.js');
	} else if (type === "cc.SafeArea") {
		return require('../builtinClass/UI/SafeArea.js');
	} else if (type === "cc.WebView") {
		return require('../builtinClass/UI/WebView.js');
	} else if (type === "cc.RichText") {
		return require('../builtinClass/render/RichText.js');
	} else if (type === "cc.ParticleSystem") {
		return require('../builtinClass/render/ParticleSystem.js');
	} else if (type === "cc.TiledMap") {
		return require('../builtinClass/render/TiledMap.js');
	} else if (type === "cc.TiledTile") {
		return require('../builtinClass/render/TiledTile.js');
	} else if (type === "dragonBones.ArmatureDisplay") {
		return require('../builtinClass/render/DragonBones.js');
	} else if (type === "cc.Graphics") {
		return require('../builtinClass/render/Graphics.js');
	} else if (type === "cc.LabelOutline") {
		return require('../builtinClass/render/LabelOutline.js');
	} else if (type === "cc.LabelShadow") {
		return require('../builtinClass/render/LabelShadow.js');
	} else if (type === "cc.Light") {
		return require('../builtinClass/render/Light.js');
	} else if (type === "cc.ParticleSystem3D") {
		return require('../builtinClass/render/ParticleSystem3D.js');
	} else if (type === "cc.CurveRange") {
		return require('../builtinClass/CurveRange.js');
	} else if (type === "cc.GradientRange") {
		return require('../builtinClass/GradientRange.js');
	} else if (type === "sp.Skeleton") {
		return require('../builtinClass/render/Skeleton.js');
	} else if (type === "cc.MeshRenderer") {
		return require('../builtinClass/mesh/MeshRenderer.js');
	} else if (type === "cc.SkinnedMeshRenderer") {
		return require('../builtinClass/mesh/SkinnedMeshRenderer.js');
	} else if (type === "cc.BoxCollider") {
		return require('../builtinClass/Collider/BoxCollider.js');
	} else if (type === "cc.CircleCollider") {
		return require('../builtinClass/Collider/CircleCollider.js');
	} else if (type === "cc.PolygonCollider") {
		return require('../builtinClass/Collider/PolygonCollider.js');
	} else if (type === "cc.PhysicsBoxCollider") {
		return require('../builtinClass/Physics/Collider/PhysicsBoxCollider.js');
	} else if (type === "cc.RigidBody") {
		return require('../builtinClass/Physics/RigidBody.js');
	} else if (type === "cc.BoxCollider3D") {
		return require('../builtinClass/Physics/Collider/BoxCollider3D.js');
	} else if (type === "cc.PhysicsChainCollider") {
		return require('../builtinClass/Physics/Collider/PhysicsChainCollider.js');
	} else if (type === "cc.PhysicsCircleCollider") {
		return require('../builtinClass/Physics/Collider/PhysicsCircleCollider.js');
	} else if (type === "cc.PhysicsPolygonCollider") {
		return require('../builtinClass/Physics/Collider/PhysicsPolygonCollider.js');
	} else if (type === "cc.SphereCollider3D") {
		return require('../builtinClass/Physics/Collider/SphereCollider3D.js');
	} else if (type === "cc.RigidBody3D") {
		return require('../builtinClass/Physics/RigidBody3D.js');
	} else if (type === "cc.ConstantForce") {
		return require('../builtinClass/Physics/ConstantForce.js');
	} else if (type === "cc.DistanceJoint") {
		return require('../builtinClass/Physics/Joint/DistanceJoint.js');
	} else if (type === "cc.MotorJoint") {
		return require('../builtinClass/Physics/Joint/MotorJoint.js');
	} else if (type === "cc.MouseJoint") {
		return require('../builtinClass/Physics/Joint/MouseJoint.js');
	} else if (type === "cc.PrismaticJoint") {
		return require('../builtinClass/Physics/Joint/PrismaticJoint.js');
	} else if (type === "cc.RevoluteJoint") {
		return require('../builtinClass/Physics/Joint/RevoluteJoint.js');
	} else if (type === "cc.RopeJoint") {
		return require('../builtinClass/Physics/Joint/RopeJoint.js');
	} else if (type === "cc.WeldJoint") {
		return require('../builtinClass/Physics/Joint/WeldJoint.js');
	} else if (type === "cc.WheelJoint") {
		return require('../builtinClass/Physics/Joint/WheelJoint.js');
	} else {
		// 判断是base64格式
		// exp ：0f852GyiHhPrKKPTqhF38Il 
		// Base64字符集的正则表达式
		const base64Regex = /^[A-Za-z0-9+\/]+={0,2}$/;

		// 检查字符串是否匹配Base64字符集
		if (!base64Regex.test(type)) {
			return null;
		} else {
			let ctor = require('../builtinClass/CustomClass.js');
			let cls = new ctor();
			cls.type = type;
			return cls
		}
	}
}

module.exports = {
	findClass: findClass
};