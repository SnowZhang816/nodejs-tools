const Image = require('../utils/image.js');
const fs = require('fs');

class ImageMgr {
	imageOfPath = {}

	processing = {}

	constructor() {
	}

	addImage(path, cb) {
		if (this.imageOfPath[path]) {
			return this.imageOfPath[path];
		}

		if (this.processing[path]) {
			this.processing[path].push(cb);
			return;
		}

		this.processing[path] = [cb];

		let data = fs.readFileSync(path);
		let image = new Image();
		image.initWithData(data, (success) => {
			if (success) {
				this.imageOfPath[path] = image;
			}
			let cbs = this.processing[path];
			if (cbs) {
				delete this.processing[path];
				for (let i = 0; i < cbs.length; ++i) {
					let cb = cbs[i];
					cb(success, success ? image : null);
				}
			}
		});
	}
}

let imageMgr = new ImageMgr();
module.exports = imageMgr;