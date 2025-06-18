import { BaseRender } from "./BaseRender.js";

export class Quad extends BaseRender {
	width = 0;
	height = 0;
	vertices = [];
	indices = [];
	/**
	 * 
	 * @param {*} width 
	 * @param {*} height 
	 */
	constructor(width, height) {
		super();
		this.width = width;
		this.height = height;
		this.updateVertices();
	}

	updateVertices() {
		let width = this.width;
		let halfWidth = width / 2;
		let height = this.height;
		let halfHeight = height / 2;
		let color = this.color;
		const vertices = [
			//
			-halfWidth, halfHeight, 0.0, 1.0, color.x, color.y, color.z, color.w,
			//
			halfWidth, halfHeight, 1.0, 1.0, color.x, color.y, color.z, color.w,
			//
			halfWidth, -halfHeight, 1.0, 0.0, color.x, color.y, color.z, color.w,
			//
			-halfWidth, -halfHeight, 0.0, 0.0, color.x, color.y, color.z, color.w
		];

		this.vertices = vertices;

		const indices = [
			0, 1, 2, 0, 2, 3
		]
		this.indices = indices;
	}

	bindVertexBuffer(gl, shaderProgram) {
		// 创建顶点缓冲区对象
		const vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		// 上传顶点数据到缓冲区
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

		// 每个顶点包含8个浮点数（2位置 + 2纹理坐标 + 4颜色）
		const stride = 8 * Float32Array.BYTES_PER_ELEMENT;

		// 获取并设置位置属性（v_position，vec2），位置在前两个浮点数，偏移量 0
		const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'v_position');
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(
			positionAttributeLocation,   // attribute location
			2,                           // 每个顶点2个分量
			gl.FLOAT,                    // 数据类型
			false,                       // 不归一化
			stride,                      // 每个顶点字节数
			0                            // 偏移量（从0开始）
		);

		// 获取并设置纹理坐标属性（v_texCoords，vec2），位于第三、第四个浮点数
		const texCoordAttributeLocation = gl.getAttribLocation(shaderProgram, 'v_texCoords');
		gl.enableVertexAttribArray(texCoordAttributeLocation);
		gl.vertexAttribPointer(
			texCoordAttributeLocation,
			2,
			gl.FLOAT,
			false,
			stride,
			2 * Float32Array.BYTES_PER_ELEMENT  // 偏移2个浮点数
		);

		// 获取并设置颜色属性（v_color，vec4），位于后四个浮点数
		const colorAttributeLocation = gl.getAttribLocation(shaderProgram, 'v_color');
		gl.enableVertexAttribArray(colorAttributeLocation);
		gl.vertexAttribPointer(
			colorAttributeLocation,
			4,  // 使用4个分量：r, g, b, a
			gl.FLOAT,
			false,
			stride,
			4 * Float32Array.BYTES_PER_ELEMENT  // 偏移4个浮点数
		);
	}

	bindIndexBuffer(gl) {
		const indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
	}

	render(render, gl, screenMatrix) {
		super.render(render, gl, screenMatrix);
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
	}
}