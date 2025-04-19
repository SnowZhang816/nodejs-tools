const big = require('./big.js');

class MathUtils {
	static add(a, b) {
		return big(a).plus(b).toString();
	}
}

module.exports = MathUtils;