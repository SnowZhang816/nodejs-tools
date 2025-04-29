const big = require('./big.js');

class MathUtils {
	static add(a, b) {
		return big(a).plus(b).toString();
	}

	static div(a, b) {
		return big(a).div(b).toString();
	}


	static random(min, max, isInt = false) {
		let diff = max - min;
		if (isInt) {
			return min + Math.floor(Math.random() * (diff + 1));
		} else {
			return min + Math.random() * diff;
		}
	}
}

module.exports = MathUtils;