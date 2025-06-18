export class Texture {
	textureID = 0;
	width = 0;
	height = 0;
	constructor(gl, image) {
		if (gl && image) {
			this.width = image.width;
			this.height = image.height;

			this.image = image;
			this.textureID = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, this.textureID);

			// 翻转图片的Y轴，保证纹理与 WebGL 坐标系一致
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

			// 上传纹理数据
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}

	setTexture(textureID) {
		this.textureID = textureID;
	}

	setTextureData(gl, data, width, height) {
		this.width = width;
		this.height = height;

		let texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		// 翻转图片的Y轴，保证纹理与 WebGL 坐标系一致
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);

		// 添加两行代码，设置 NPOT 纹理的包裹模式为 CLAMP_TO_EDGE
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.bindTexture(gl.TEXTURE_2D, null);

		this.textureID = texture;
	}

	getWidth() {
		return this.width;
	}

	getHeight() {
		return this.height;
	}

	getTextureID() {
		return this.textureID;
	}
}