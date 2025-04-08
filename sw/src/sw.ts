import { ServiceWorkerWare } from './sww';
import { BundleCache } from './bundleCache';

let worker = new ServiceWorkerWare(true);
worker.init();

let bundleCache = new BundleCache();
worker.addWare(bundleCache);
