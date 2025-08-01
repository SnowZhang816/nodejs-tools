import { Logger } from './Logger';

export * from './register';

let nav = navigator;
let userAgent = nav.userAgent;
let ua = userAgent.toLowerCase();
let isAndroid = false,
	iOS = false,
	osVersion = '',
	osMainVersion = 0;
var uaResult = /android\s*(\d+(?:\.\d+)*)/i.exec(ua) || /android\s*(\d+(?:\.\d+)*)/i.exec(nav.platform);
if (uaResult) {
	isAndroid = true;
	osVersion = uaResult[1] || '';
	osMainVersion = parseInt(osVersion) || 0;
}
uaResult = /(iPad|iPhone|iPod).*OS ((\d+_?){2,3})/i.exec(ua);
if (uaResult) {
	iOS = true;
	osVersion = uaResult[2] || '';
	osMainVersion = parseInt(osVersion) || 0;
	//@ts-ignore
} else if (/(iPhone|iPad|iPod)/.exec(nav.platform) || /iphone|ipad|ipod/.test(ua) || ((nav.platform === 'MacIntel' || /mac os/.test(ua)) && nav.maxTouchPoints && nav.maxTouchPoints > 2)) {
	iOS = true;
	osVersion = '';
	osMainVersion = 0;
}

let isMobile = iOS || /mobile|android|iphone|ipad/.test(ua);
let isVConsole = isMobile;

let openLog = false;
let localParams = new URLSearchParams(window.location.search);
if (localParams.has('log')) {
	openLog = true;
	Logger.init(1 | 2 | 4 | 8, isVConsole);
} else {
	Logger.init(1 | 2 | 4 | 8, isVConsole);
}
