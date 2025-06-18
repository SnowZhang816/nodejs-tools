import { Logger } from './Logger';

interface Ware {
	onInstall?(evt: ExtendableEvent): void;
	onActivate?(evt: ExtendableEvent): void;
	onFetch?(request: Request): Promise<Response> | null;
	onMessage?(evt: ExtendableMessageEvent): void;
}

export class ServiceWorkerWare {
	wares: Ware[] = [];
	autoClaim: boolean = true;
	constructor(autoClaim: boolean) {
		this.autoClaim = autoClaim;
	}

	init() {
		// lifecycle events
		addEventListener('install', this);
		addEventListener('activate', this);
		// network events
		addEventListener('fetch', this);
		// misc events
		addEventListener('message', this);
	}

	addWare(ware: Ware): void {
		this.wares.push(ware);
	}

	handleEvent(evt: Event): void {
		switch (evt.type) {
			case 'install':
				this.onInstall(evt as ExtendableEvent);
				break;
			case 'fetch':
				this.onFetch(evt as FetchEvent);
				break;
			case 'activate':
				this.onActivate(evt as ExtendableEvent);
				break;
			case 'message':
				this.onMessage(evt as ExtendableMessageEvent);
				break;
			default:
				Logger.warn('未知事件类型', evt.type);
		}
	}

	onInstall(evt: ExtendableEvent): void {
		Logger.log('onInstall');
		// self.skipWaiting();
		const installation = this.getWareTasks('onInstall');
		evt.waitUntil(installation);
	}

	onActivate(evt: ExtendableEvent): void {
		Logger.log('onActivate');
		let activation = this.getWareTasks('onActivate');
		if (this.autoClaim) {
			activation = activation.then(() => self.clients.claim());
		}
		evt.waitUntil(activation);
	}

	onFetch(evt: FetchEvent): void {
		let response = this.runMiddleware(this.wares, 0, evt.request, null);
		if (response) {
			evt.respondWith(response);
		}
	}

	runMiddleware(wares: Ware[], current: number, request: Request, response: Promise<Response> | Response | null): Promise<Response> | Response | null {
		// Example implementation: Replace this with your actual middleware logic
		if (response) {
			return response;
		}

		if (current >= wares.length) {
			return response;
		}

		let result = null;
		const mw = wares[current];
		if (typeof mw.onFetch === 'function') {
			result = mw.onFetch(request);
		}
		return this.runMiddleware(wares, current + 1, request, result);
	}

	onMessage(evt: ExtendableMessageEvent): void {
		this.wares.forEach(function (mw) {
			var handlerName =
				'on' +
				evt.type.replace(/^[a-z]/, function (m) {
					return m.toUpperCase();
				});
			if (typeof (mw as any)[handlerName] !== 'undefined') {
				(mw as any)[handlerName].call(mw, evt);
			}
		});
	}

	getWareTasks(method: string): Promise<any[] | void> {
		const tasks = this.wares.reduce((tasks: Promise<any>[], ware) => {
			if (typeof (ware as any)[method] === 'function') {
				tasks.push((ware as any)[method]());
			}
			return tasks;
		}, []);
		return Promise.all(tasks);
	}
}
