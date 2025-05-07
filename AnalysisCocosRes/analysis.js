let fs = require('fs');
let { Bundle } = require('./bundle/bundle.js');

class Analysis {
	bundleOfName = {};
	bundles = [];

	analysis(dir) {
		let files = fs.readdirSync(dir);
		for (let file of files) {
			let bundlePath = dir + '/' + file;
			if (fs.statSync(bundlePath).isDirectory()) {
				let bundle = file.split('.')[0];
				this.analysisBundle(bundle, bundlePath);
			}
		}
	}

	analysisBundle(bundleName, bundlePath) {
		let files = fs.readdirSync(bundlePath);
		for (let file of files) {
			let filePath = bundlePath + '/' + file;
			if (file.endsWith('.json')) {
				let data = fs.readFileSync(filePath);
				let json = JSON.parse(data);
				let bundle = new Bundle(bundleName, bundlePath, json);
				this.bundleOfName[bundleName] = bundle;
				this.bundles.push(bundle);
				break;
			}
		}

		// console.log(this.bundles);
	}

	exportsAssets(destDir) {
		for (let bundle of this.bundles) {
			bundle.exportAssets(destDir);
		}
	}
}

let analysis = new Analysis();

module.exports = { analysis };