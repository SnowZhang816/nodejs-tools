export class DB {
	dbName: string;
	storeName: string;
	version: number;
	db: IDBDatabase | null = null;

	constructor(storeName: string, dbName: string = 'casual-db', version: number = 1) {
		this.dbName = dbName;
		this.storeName = storeName;
		this.version = version;
	}

	getDB() {
		return new Promise<IDBDatabase | null>((resolve, reject) => {
			// 优先返回缓存的数据库实例
			if (this.db) {
				resolve(this.db);
			} else {
				// 打开数据库
				let request = indexedDB.open(this.dbName, this.version);
				// 当数据库初始化或升级时创建仓库
				request.onupgradeneeded = (event) => {
					let target = event.target as IDBOpenDBRequest;
					let db = target.result;
					// 当仓库不存在时创建仓库，同时规定 key 为索引
					if (!db.objectStoreNames.contains(this.storeName)) {
						db.createObjectStore(this.storeName, { keyPath: 'key' });
					}
				};
				request.onsuccess = (event) => {
					let target = event.target as IDBRequest;
					this.db = target.result;
					resolve(this.db);
				};

				request.onerror = (event) => {
					resolve(null);
				};
			}
		});
	}

	setItem(key: string, value: any) {
		return new Promise<any>((resolve, reject) => {
			// 获取数据库
			this.getDB().then((db) => {
				// 创建事务，指定使用到的仓库名以及读写权限
				let transaction = db!.transaction([this.storeName], 'readwrite');
				// 获取仓库实例
				let objectStore = transaction.objectStore(this.storeName);
				// 将 key 和 value 包装成对象 {key, value} 并存入仓库
				let request = objectStore.put({ key, value });
				request.onsuccess = (event) => {
					resolve(true);
				};
				request.onerror = (event) => {
					resolve(false);
				};
			});
		});
	}

	getItem(key: string) {
		return new Promise<any>((resolve, reject) => {
			// 获取数据库实例
			this.getDB().then((db) => {
				// 创建事务，并指定好仓库名以及操作的只读权限
				let transaction = db!.transaction([this.storeName], 'readonly');
				// 获取仓库实例
				let objectStore = transaction.objectStore(this.storeName);
				// 查找对应的数据并通过 Promise 对象包装后返回
				let request = objectStore.get(key);
				request.onsuccess = (event) => {
					let target = event.target as IDBRequest;
					resolve(target.result);
				};
				request.onerror = (event) => {
					resolve(null);
				};
			});
		});
	}

	removeItem(key: string) {
		return new Promise<any>((resolve, reject) => {
			// 获取数据库实例
			this.getDB().then((db) => {
				// 创建事务，并指定好仓库名以及删除操作的读写权限
				let transaction = db!.transaction([this.storeName], 'readwrite');
				let objectStore = transaction.objectStore(this.storeName);
				// 删除数据，并用 Promise 进行包裹
				let request = objectStore.delete(key);
				request.onsuccess = (event) => {
					resolve(true);
				};
				request.onerror = (event) => {
					resolve(false);
				};
			});
		});
	}
}
