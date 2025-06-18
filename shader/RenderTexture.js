import { BaseRender } from "./BaseRender.js";
import { Texture } from "./texture.js";
import { Utils } from "./utils.js";
import { Sprite } from "./sprite.js";
import { Program } from "./Program.js";

let INF = 1e10;

export class RenderTexture extends BaseRender {
	texture = null;

	frameBuffer = null;

	renderTexture = null;

	imageSave = false;

	sdfTexture = null;

	constructor(texture) {
		super();

		this.texture = texture;

		this.updateVertices();
	}

	updateVertices(width, height) {
		width = width ? width : this.texture.getWidth();
		let halfWidth = width / 2;
		height = height ? height : this.texture.getHeight();
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


	/**
	 * 生成带有SDF（有符号距离场）的图像数据。
	 *
	 * @param imageData 包含RGBA数据的Uint8ClampedArray，每个像素4个元素。
	 * @param width 图像宽度。
	 * @param height 图像高度。
	 * @param radius 用于计算SDF的半径，默认为18。
	 * @param cutoff SDF值的最小偏移量，默认为0。
	 * @returns 生成的SDF数据，类型为Uint8ClampedArray。
	 */
	generateSDF(imageData, width, height, radius, cutoff) {
		radius = radius || 18;
		cutoff = cutoff || 0;

		// 构造内部和外部区域的代价值数组（长度为 width*height）
		const inside = new Array(width * height);
		const outside = new Array(width * height);
		// imageData.data 为包含 RGBA 的 Uint8ClampedArray，每个像素 4 个元素
		const data = imageData;
		for (let i = 0; i < width * height; i++) {
			let a = data[i * 4 + 3] / 255; // 归一化 alpha 值
			// 根据 alpha 值计算代价值，并非单纯二值化
			if (a === 1) {
				// 内部：图形区域，离边缘越远代价值越低
				inside[i] = INF;
				outside[i] = 0;
			} else if (a === 0) {
				// 外部：背景区域，离边缘越远代价值越低
				inside[i] = 0;
				outside[i] = INF;
			} else {
				inside[i] = Math.pow(Math.max(0, a - 0.5), 2);
				outside[i] = Math.pow(Math.max(0, 0.5 - a), 2);
			}
		}

		// 为 EDT 算法准备暂存数组，长度为当前处理方向的最大尺寸
		let maxDim = Math.max(width, height);
		let fArr = new Array(maxDim);
		let dArr = new Array(maxDim);
		let vArr = new Array(maxDim);
		let zArr = new Array(maxDim + 1);

		// 对内部区域执行 EDT，计算每个像素到边界的欧几里得距离
		Utils.EDT(inside, width, height, fArr, dArr, vArr, zArr);
		// 对外部区域执行 EDT
		Utils.EDT(outside, width, height, fArr, dArr, vArr, zArr);

		// 构造 SDF 数组：每个像素 SDF = distance_inside - distance_outside
		const sdf = new Uint8ClampedArray(width * height);
		for (let i = 0; i < width * height; i++) {
			let d = outside[i] - inside[i];
			let a = Math.max(0, Math.min(255, Math.round(255 - 255 * (d / radius + cutoff))));
			sdf[i] = a;
		}

		// 返回生成的 SDF 数据
		return sdf;
	}

	addSaveBtn(pixels, width, height) {
		// ---------------------
		// 保存帧缓冲内容为 PNG（仅保存一次）
		if (!this.imageSaved) {
			// 读取帧缓冲的数据
			// 创建一个临时 canvas，用于将像素数据转为图片
			let tempCanvas = document.createElement("canvas");
			tempCanvas.width = width;
			tempCanvas.height = height;
			let ctx = tempCanvas.getContext("2d");
			let imageData = ctx.createImageData(width, height);

			// 因为读取的数据是从右下角开始的，需要垂直翻转
			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					let srcIndex = ((height - y - 1) * width + x) * 4;
					let destIndex = (y * width + x) * 4;
					imageData.data[destIndex] = pixels[srcIndex];
					imageData.data[destIndex + 1] = pixels[srcIndex + 1];
					imageData.data[destIndex + 2] = pixels[srcIndex + 2];
					imageData.data[destIndex + 3] = pixels[srcIndex + 3];
				}
			}
			ctx.putImageData(imageData, 0, 0);
			let dataURL = tempCanvas.toDataURL("image/png");

			// 创建一个按钮用于手动点击下载
			let downloadButton = document.createElement("button");
			downloadButton.textContent = "下载帧缓冲图像";
			downloadButton.style.position = "absolute";
			downloadButton.style.top = "10px";
			downloadButton.style.left = "10px";
			downloadButton.onclick = function () {
				let link = document.createElement("a");
				link.href = dataURL;
				link.download = "framebuffer.png";
				link.click();
			};
			document.body.appendChild(downloadButton);

			this.imageSaved = true;
		}
		// ---------------------
	}

	render(render, gl, screenMatrix) {
		let shaderProgram = this.getProgramID();

		let broadWidth = 30;
		let width = this.texture.getWidth() + broadWidth;
		let height = this.texture.getHeight() + broadWidth;

		if (!this.frameBuffer) {
			this.frameBuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

			this.renderTexture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, this.renderTexture);
			// 分配一个与原纹理尺寸一致的空纹理存储空间
			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				gl.RGBA,
				width,
				height,
				0,
				gl.RGBA,
				gl.UNSIGNED_BYTE,
				null
			);

			// 设置缩放和包裹参数
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

			// 将该纹理附加到帧缓冲的颜色附件上
			gl.framebufferTexture2D(
				gl.FRAMEBUFFER,
				gl.COLOR_ATTACHMENT0,
				gl.TEXTURE_2D,
				this.renderTexture,
				0
			);

			// 检查帧缓冲完整性
			if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
				console.error('Framebuffer is not complete!');
			}

			// 解除绑定
			gl.bindTexture(gl.TEXTURE_2D, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			this.setPosition(width / 2, height / 2, 0);
			gl.useProgram(shaderProgram);

			gl.uniform1i(gl.getUniformLocation(shaderProgram, 'after_effect'), 0);
			gl.uniform1f(gl.getUniformLocation(shaderProgram, 'u_time'), render.getTotalTime());
			gl.uniformMatrix4fv(
				gl.getUniformLocation(shaderProgram, 'modelMatrix'),
				false,
				this.getModelMatrix()
			);
			// this.updateVertices();
			this.bindVertexBuffer(gl, shaderProgram);
			this.bindIndexBuffer(gl);

			let textureScreenMatrix = [
				2 / width, 0, 0, 0,
				0, 2 / height, 0, 0,
				0, 0, 1, 0,
				-1, -1, 0, 1,
			];

			gl.uniformMatrix4fv(
				gl.getUniformLocation(shaderProgram, 'screenMatrix'),
				false,
				textureScreenMatrix
			);
			// 将渲染目标设置为帧缓冲区
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
			// 设置视口为目标纹理尺寸
			gl.viewport(0, 0, width, height);

			// 清空帧缓冲数据
			gl.clearColor(0, 0, 0, 0.0);
			gl.clear(gl.COLOR_BUFFER_BIT);

			// 绑定纹理
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.texture.getTextureID());
			let textureUniformLocation1 = gl.getUniformLocation(shaderProgram, 'u_texture0');
			gl.uniform1i(textureUniformLocation1, 0);

			gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
			let pixels = new Uint8Array(width * height * 4);
			gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

			// 渲染完成后解除帧缓冲，恢复到默认帧缓冲（即屏幕）
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			// 恢复视口
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

			// --- 利用 SDF 数据生成新的 SDF 贴图 ---
			// 调用 generateSDF，注意此处传入的 pixels 是离屏渲染读取的数据
			let sdfRadius = broadWidth; //Math.max(60, height / 3);
			let cutoff = 0.5;
			let sdf = this.generateSDF(pixels, width, height, sdfRadius, cutoff);
			// 归一化 SDF 值到 [0, 255]
			let minVal = Infinity, maxVal = -Infinity;
			for (let i = 0; i < sdf.length; i++) {
				if (sdf[i] < minVal) minVal = sdf[i];
				if (sdf[i] > maxVal) maxVal = sdf[i];
			}
			let threshold = 128;  // 根据实际情况调整
			let sdfData = new Uint8Array(width * height * 4);
			for (let i = 0; i < sdf.length; i++) {
				// 线性
				let alpha = sdf[i];
				// let norm = (sdf[i] - minVal) / (maxVal - minVal);
				// let gray = Math.floor(norm * 255);
				let gray = sdf[i];
				// 二值化
				// let gray = sdf[i] < 0 ? 255 : 0;

				// 边界
				// let gray;
				// if (Math.abs(sdf[i]) < threshold) {
				// 	gray = 0;
				// } else {
				// 	gray = 255;
				// }

				// let a;
				// if (Math.abs(sdf[i]) < threshold) {
				// 	a = 0;
				// } else {
				// 	a = 255;
				// }

				sdfData[i * 4] = gray;// pixels[i * 4];
				sdfData[i * 4 + 1] = gray;// pixels[i * 4 + 1];
				sdfData[i * 4 + 2] = gray;// pixels[i * 4 + 2];
				sdfData[i * 4 + 3] = gray;// gray;
				pixels[i * 4 + 3] = alpha;
			}

			this.addSaveBtn(sdfData, width, height);

			this.sdfTexture = new Texture()
			this.sdfTexture.setTextureData(gl, pixels, width, height)

			if (!this.add) {
				// 第一次:添加生成的 SDF 纹理到渲染器中
				Promise.all([fetch('shader/sprite.vert').then((res) => res.text()), fetch('shader/sprite.frag').then((res) => res.text())]).then(([vs, fs]) => {
					let program = new Program(gl, vs, fs);
					let tx = new Texture()
					tx.setTextureData(gl, sdfData, width, height)
					let sprite = new Sprite(tx);
					sprite.setProgram(program);
					sprite.setPosition(200, 200);
					render.addModel(sprite);

				});
				this.add = true;
				// let tx = new Texture()
				// tx.setTextureData(gl, sdfData, width, height)
				// let sprite = new Sprite(tx);
				// sprite.setProgram(this.program);
				// sprite.setPosition(200, 200);
				// render.addModel(sprite);
			}
		}


		// 第二次:绘制 SDF 纹理到屏幕上
		this.setPosition(gl.canvas.width / 2, gl.canvas.height / 2, 0);
		// this.setPosition(200, 200);
		this.updateVertices(width, height);
		super.render(render, gl, screenMatrix);
		gl.uniform1i(gl.getUniformLocation(shaderProgram, 'after_effect'), 1);
		gl.uniform1f(gl.getUniformLocation(shaderProgram, 'outlineHalfWidth'), 2);
		// gl.clearColor(1.0, 1.0, 1.0, 1.0);
		// gl.clear(gl.COLOR_BUFFER_BIT);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.sdfTexture.getTextureID());
		let textureUniformLocation2 = gl.getUniformLocation(shaderProgram, 'u_texture0');
		gl.uniform1i(textureUniformLocation2, 0);

		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

	}
}