export class Render {
	/** 
	 * @type {BaseRender};
	 */
	models = [];

	deltaTime = 0;
	totalTime = 0;

	setDeltaTime(delta) {
		this.deltaTime = delta;
	}

	getDeltaTime() {
		return this.deltaTime;
	}

	setTotalTime(totalTime) {
		this.totalTime = totalTime;
	}

	getTotalTime() {
		return this.totalTime;
	}

	addModel(model) {
		this.models.push(model);
	}

	render(gl) {
		let screenWidth = gl.canvas.width;
		let screenHeight = gl.canvas.height;
		let screenMatrix = [
			2 / screenWidth, 0, 0, 0,
			0, 2 / screenHeight, 0, 0,
			0, 0, 1, 0,
			-1, -1, 0, 1,
		];

		// 清空画布
		gl.clearColor(0.0, 0.0, 0.0, 1.0); // 黑色背景
		gl.clear(gl.COLOR_BUFFER_BIT);

		// 启用混合模式
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		for (let i = 0; i < this.models.length; i++) {
			this.models[i].render(this, gl, screenMatrix);
		}

	}
}