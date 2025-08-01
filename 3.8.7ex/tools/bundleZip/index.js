const minimist = require('minimist');
const path = require('path');
const { bundleToZip, installServiceWorker, changeCocosJsDir } = require('./bundle.js');

const argv = minimist(process.argv.slice(2), {
	alias: {
		i: 'in'
	}
});

console.log('argv', argv);

let buildPath = argv.in;
if (!buildPath) {
	buildPath = path.join(__dirname, '../../build');
}

async function main() {
	// changeCocosJsDir(path.join(buildPath, 'web-mobile'));
	await bundleToZip(path.join(buildPath, 'web-mobile/assets'));
	// installServiceWorker(path.join(buildPath, 'web-mobile'));
}

main();
