export class BaseRender {
	position = { x: 0, y: 0, z: 0 };
	scale = { x: 1, y: 1, z: 1 };
	rotation = { x: 0, y: 0, z: 0 };
	color = { x: 1, y: 1, z: 1, w: 1 };
	opacity = 1;
	/**
	 * @type {Program}
	 */
	program = null;

	setProgram(program) {
		this.program = program;
	}

	getProgramID() {
		return this.program.getProgramID();
	}

	setPosition(x, y, z) {
		this.position = { x, y, z };
	}

	setScale(x, y, z) {
		if (y === undefined) y = x;
		if (z === undefined) z = x;
		this.scale = { x, y, z };
	}

	setColor(x, y, z, w) {
		if (w === undefined) w = 1;
		this.color = { x, y, z, w };
		this.opacity = w;

		this.updateVertices();
	}

	setOpacity(opacity) {
		this.opacity = opacity;
		this.color.w = opacity;

		this.updateVertices();
	}

	setRotation(x, y, z) {
		this.rotation = { x, y, z };
	}

	setAngle(angle) {
		this.rotation = { x: 0, y: 0, z: angle };
	}

	updateVertices() {

	}

	getModelMatrix() {
		// 允许 position 和 scale 没有定义 z 分量时提供默认值
		const { x: posX, y: posY, z: posZ = 0 } = this.position;
		const { x: scaleX, y: scaleY, z: scaleZ = 1 } = this.scale;
		// 使用 rotation.z 作为二维旋转角度（单位：弧度）
		const angle = this.rotation.z;
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);

		// 计算组合后的（缩放 * 旋转）矩阵，注意这里按照列主序存储
		// 矩阵排列：
		// [ scaleX*cos,    scaleX*sin,    0,   0,
		//  -scaleY*sin,    scaleY*cos,    0,   0,
		//       0,             0,      scaleZ,  0,
		//     posX,          posY,        posZ,   1 ]
		const modelMatrix = [
			scaleX * cos, scaleX * sin, 0, 0,
			-scaleY * sin, scaleY * cos, 0, 0,
			0, 0, scaleZ, 0,
			posX, posY, posZ, 1,
		];

		return new Float32Array(modelMatrix);
	}

	bindVertexBuffer(gl, shaderProgram) { }
	bindIndexBuffer(gl) { }

	render(render, gl, screenMatrix) {
		let shaderProgram = this.getProgramID();
		gl.useProgram(shaderProgram);

		gl.uniform1f(gl.getUniformLocation(shaderProgram, 'u_time'), render.getTotalTime());

		gl.uniformMatrix4fv(
			gl.getUniformLocation(shaderProgram, 'screenMatrix'),
			false,
			screenMatrix
		);

		gl.uniformMatrix4fv(
			gl.getUniformLocation(shaderProgram, 'modelMatrix'),
			false,
			this.getModelMatrix()
		);

		this.bindVertexBuffer(gl, shaderProgram);
		this.bindIndexBuffer(gl);
	}
}