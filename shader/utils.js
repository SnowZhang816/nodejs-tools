export class Utils {

	/**
	 * 1D squared distance transform
	 * 计算一维距离变换，核心思想是利用动态规划和抛物线交点性质，
	 * 为每个位置计算最小的 (q - i)² + f[i]，其中 f[i] 为输入代价值。
	 *
	 * @param {number[]} f 输入数组，长度为 n，每个元素表示某处的代价值（通常为 0 或 INF）
	 * @param {number[]} d 输出数组，长度为 n，用来保存计算后的最小平方距离值
	 * @param {number[]} v 中间数组，长度为 n，用于存储分割位置的下标
	 * @param {number[]} z 中间数组，长度为 n+1，用于存储分割区域的边界（交点位置）
	 * @param {number} n 数组的长度
	 */
	static EDT1D(f, d, v, z, n) {
		let k = 0;
		// 初始化 v 数组，v[0] 保存第一个位置索引
		v[0] = 0;
		// 初始化交点边界，第一个区间左边界为 -Infinity，第二个边界为 +Infinity
		z[0] = -Infinity;
		z[1] = Infinity;
		// 第一阶段：计算所有抛物线交点，确定各个区域
		for (let q = 1; q < n; q++) {
			// 计算位置 q 对应的抛物线与保存在 v[k] 处抛物线的交点 s
			let s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
			// 若 s 小于当前交点 z[k]，说明抛物线 q 在前一区间无贡献
			while (s <= z[k]) {
				k--;
				s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
			}
			k++;
			// 把当前索引 q 存入 v 数组中
			v[k] = q;
			// 更新交点边界 z[k]
			z[k] = s;
			// 对于下一个区域的右边界初始为 +Infinity
			z[k + 1] = Infinity;
		}
		// 第二阶段：遍历每个位置，根据交点结果计算最终距离变换结果
		k = 0;
		for (let q = 0; q < n; q++) {
			// 找到 q 属于哪个区域（即满足 z[k+1] >= q）
			while (z[k + 1] < q) {
				k++;
			}
			// 计算当前位置 q 对应的平方距离值
			d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
		}
	}



	/**
	 * 2D Euclidean Distance Transform by Felzenszwalb & Huttenlocher
	 * 利用一维距离变换分别对列和行进行两次计算，得到二维欧几里得距离变换结果。
	 *
	 * 算法流程：
	 * 1. 对每一列调用一维距离变换（EDT1D），先计算出每个点在纵向上的
	 *    最小平方距离，结果保存在 data 里。
	 * 2. 对每一行再次调用一维距离变换，计算横向上的最小平方距离，
	 *    同时取平方根得到最终欧几里得距离。
	 *
	 * @param {number[]} data 输入数组，长度为 width * height，存储图像代价值
	 * @param {number} width 图像宽度
	 * @param {number} height 图像高度
	 * @param {Array} f 临时数组，用于存放一维数据（调用 EDT1D 时传入的 f 数组）
	 * @param {Array} d 临时数组，用于存放一维结果（调用 EDT1D 时传入的 d 数组）
	 * @param {Array} v 临时数组，用于存放下标（调用 EDT1D 时传入的 v 数组）
	 * @param {Array} z 临时数组，用于存放边界（调用 EDT1D 时传入的 z 数组）
	 */
	static EDT(data, width, height, f, d, v, z) {
		// 第一遍：对每一列进行一维距离变换
		for (var x = 0; x < width; x++) {
			// 对当前列，将每个像素的值拷贝到数组 f 中
			for (var y = 0; y < height; y++) {
				f[y] = data[y * width + x];
			}
			// 使用 EDT1D 计算该列中每个位置的最小平方距离并存放在 d 数组中
			this.EDT1D(f, d, v, z, height);
			// 将计算的结果写回原始数据 data 中（以便下一步处理）
			for (y = 0; y < height; y++) {
				data[y * width + x] = d[y];
			}
		}
		// 第二遍：对每一行进行一维距离变换
		for (y = 0; y < height; y++) {
			// 将当前行数据赋值给 f 数组
			for (x = 0; x < width; x++) {
				f[x] = data[y * width + x];
			}
			// 调用 EDT1D 计算该行的最小平方距离
			this.EDT1D(f, d, v, z, width);
			// 将计算结果取平方根后写回 data 数组，此时 data 存储的即为最终欧几里得距离
			for (x = 0; x < width; x++) {
				data[y * width + x] = Math.sqrt(d[x]);
			}
		}
	}
}