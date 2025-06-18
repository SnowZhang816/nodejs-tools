import { ServiceWorkerWare } from './sww';
import { BundleCache } from './bundleCache';
import { Logger } from './Logger';

Logger.init();

let worker = new ServiceWorkerWare(true);
worker.init();

let bundleCache = new BundleCache();
worker.addWare(bundleCache);
