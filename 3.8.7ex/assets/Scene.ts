import { _decorator, assetManager, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Scene')
export class Scene extends Component {
	start() {}

	update(deltaTime: number) {}

	onAddTouch() {
		console.log('add touch');

		assetManager.loadBundle('game1', (err, bundle) => {
			if (bundle) {
				bundle.load('Node', Prefab, (err, prefab) => {
					if (prefab) {
						let node = instantiate(prefab);
						node.parent = this.node;
					}
				});
			}
		});
	}
}
