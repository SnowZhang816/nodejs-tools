const sharp = require('sharp');
const utils = require('./utils.js');

class Image {
	// 原始数据
	data = null;
	// 宽度
	width = 0;
	// 高度
	height = 0;
	// 纹理数据
	textureData = null;
	/**
	 * 初始化图片数据
	 * @param {Buffer} data 
	 */
	initWithData(data, cb) {
		this.data = data;

		// 根据文件类型初始化
		// 读取文件魔数
		let magic = new Uint8Array(data, 0, 4);
		if (magic[0] === 0x89 && magic[1] === 0x50 && magic[2] === 0x4E && magic[3] === 0x47) {
			this.initWithPng(data, cb);
		} else if (magic[0] === 0x52 && magic[1] === 0x49 && magic[2] === 0x46 && magic[3] === 0x46) {
			this.initWithWebp(data, cb);
		} else if (magic[0] === 0x5D && magic[1] === 0xB8 && magic[2] === 0x60 && magic[3] === 0xA1) {
			this.initWithAstc(data, cb);
		} else if (magic[0] === 0x45 && magic[1] === 0x54 && magic[2] === 0x43) {
			this.initWithEtc(data, cb);
		} else if (magic[0] === 0xFF && magic[1] === 0xD8) {
			this.initWithJpg(data, cb);
		} else if (magic[0] === 0x50 && magic[1] === 0x56 && magic[2] === 0x52) {
			this.initWithPvr(data, cb);
		}
	}

	/**
	 * 解析WebP格式的图片数据
	 * @param {Buffer} data - 包含WebP图片数据的Buffer对象
	 */
	initWithWebp(data, cb) {
		this.sharpDecode(data, cb)
	}

	initWithPng(data, cb) {
		this.sharpDecode(data, cb)
	}

	initWithAstc(data, cb) {
	}

	initWithEtc(data, cb) {
	}

	initWithJpg(data, cb) {
		this.sharpDecode(data, cb)
	}

	initWithPvr(data, cb) {
	}

	sharpDecode(data, cb) {
		sharp(data)
			.raw()
			.toBuffer((err, buffer, info) => {
				if (err) {
					console.error('Error processing image:', err);
					cb?.(false);
					return;
				}

				// 提取 RGBA 数据
				const rgbaData = buffer;
				const width = info.width;
				const height = info.height;
				const channels = 4; // RGBA 有 4 个通道

				this.width = width;
				this.height = height;
				this.textureData = buffer;

				cb?.(true);
			});
	}

	/**
	 * 导出指定范围的图片数据到文件
	 * @param {{}} info 
	 * @param {string} filedir 
	 */

	sharpToFile(info, filedir, cb) {
		let start = {
			x: info.rect[0],
			y: info.rect[1]
		};
		let size = {
			width: info.rect[2],
			height: info.rect[3]
		}
		let originalSize = {
			width: info.originalSize[0],
			height: info.originalSize[1]
		}
		let rotated = info.rotated;

		// 分配一个缓冲区用于存储图像数据
		let data = Buffer.alloc(size.width * size.height * 4);
		let width = size.width;
		let height = size.height;
		// 计算源图像和目标图像的步长
		let srcStride = this.width * 4;
		let dstStride = width * 4;
		let desHeight = height
		if (rotated) {
			dstStride = height * 4;
			desHeight = width;
		}

		// 遍历目标图像的高度
		for (let y = 0; y < desHeight; y++) {
			// 计算源图像偏移量
			const srcOffset = ((start.y + y) * srcStride) + (start.x * 4);
			// 计算目标图像偏移量
			const dstOffset = y * dstStride;
			// 从源图像缓冲区复制数据到目标缓冲区
			this.textureData.copy(data, dstOffset, srcOffset, srcOffset + dstStride);
		}


		if (rotated) {
			data = this.rotateImage90CounterClockwise(data, height, width);
		}

		if (originalSize.width !== width || originalSize.height !== height) {
			// 
			let trimX = originalSize.width - size.width;
			let halfTrimX = trimX / 2;
			let offsetX = info.offset[0];
			// 宽度右边裁剪长度
			let trimXRight = halfTrimX - offsetX;
			// 宽度左边裁剪长度
			let trimXLeft = halfTrimX + offsetX;

			let trimY = originalSize.height - size.height;
			let halfTrimY = trimY / 2;
			let offsetY = info.offset[1];
			// 高度底部裁剪长度
			let trimYBottom = halfTrimY + offsetY;
			// 高度顶部裁剪长度
			let trimYTop = halfTrimY - offsetY;

			data = this.fillTransparentArea(data, width, height, trimXLeft, trimYTop, trimXRight, trimYBottom);
			width = originalSize.width;
			height = originalSize.height;
		}

		utils.ensureDirExist(filedir);

		// 使用sharp库处理图像数据并保存到文件
		sharp(data, { raw: { width: width, height: height, channels: 4 } }).toFile(filedir, (err, info) => {
			// 如果处理图像时出现错误
			if (err) {
				console.error('处理图像时出错:', err);
				cb?.(false);
				return;
			}

			// 调用回调函数并传入true
			cb?.(true);
		});
	}

	/**
	 * 逆时针旋转图片数据 90 度
	 * @param {Buffer} rgbaBuffer - 原始的 RGBA 数据 (Buffer 类型)
	 * @param {number} width - 图片的宽度
	 * @param {number} height - 图片的高度
	 * @returns {Buffer} - 旋转后的 RGBA 数据 (Buffer 类型)
	 */
	rotateImage90CounterClockwise(rgbaBuffer, width, height) {
		// 每个像素由 4 个字节 (RGBA) 组成
		const bytesPerPixel = 4;
		const rotatedBuffer = Buffer.alloc(rgbaBuffer.length);

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				// 原始数据的索引
				const srcIndex = (y * width + x) * bytesPerPixel;

				// 逆时针旋转后数据的索引
				const rotatedX = y; // 新的 X 坐标
				const rotatedY = width - 1 - x; // 新的 Y 坐标
				const destIndex = (rotatedY * height + rotatedX) * bytesPerPixel;

				// 复制 RGBA 数据
				rotatedBuffer[destIndex] = rgbaBuffer[srcIndex];       // R
				rotatedBuffer[destIndex + 1] = rgbaBuffer[srcIndex + 1]; // G
				rotatedBuffer[destIndex + 2] = rgbaBuffer[srcIndex + 2]; // B
				rotatedBuffer[destIndex + 3] = rgbaBuffer[srcIndex + 3]; // A
			}
		}

		return rotatedBuffer;
	}

	/**
	 * 根据left、top、right、bottom填充透明区域
	 * @param {Buffer} data 原始的 RGBA 数据 (Buffer 类型)
	 * @param {Number} width 原始图像的宽度
	 * @param {Number} height 原始图像的高度
	 * @param {Number} left 左边需要补充的长度 
	 * @param {Number} top 上面需要补充的长度 
	 * @param {Number} right 右边需要补充的长度 
	 * @param {Number} bottom 下面需要补充的长度 
	 */
	fillTransparentArea(data, width, height, left, top, right, bottom) {
		// 计算新图像的宽度和高度
		const newWidth = width + left + right;
		const newHeight = height + top + bottom;

		// 创建一个新的 Buffer，用于存储填充后的图像数据
		const newData = Buffer.alloc(newWidth * newHeight * 4);

		// 将原始图像数据复制到新 Buffer 的中心位置
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const srcIndex = (y * width + x) * 4;
				const destIndex = ((y + top) * newWidth + (x + left)) * 4;

				// 复制 RGBA 数据
				newData[destIndex] = data[srcIndex];       // R
				newData[destIndex + 1] = data[srcIndex + 1]; // G
				newData[destIndex + 2] = data[srcIndex + 2]; // B
				newData[destIndex + 3] = data[srcIndex + 3]; // A
			}
		}

		// 将新 Buffer 的周围区域填充为透明
		for (let y = 0; y < newHeight; y++) {
			for (let x = 0; x < newWidth; x++) {
				const index = y * newWidth + x;

				// 检查是否位于原始图像区域外
				if (x < left || x >= newWidth - right || y < top || y >= newHeight - bottom) {
					// 填充透明（RGBA 中的 Alpha 通道值为 0）
					newData[index * 4 + 3] = 0;
				}
			}
		}

		return newData;
	}
}


module.exports = Image;