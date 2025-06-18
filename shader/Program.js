function loadShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error('着色器编译失败: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

export class Program {
	shaderProgramId = 0;

	constructor(gl, vsSource, fsSource) {
		let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
		let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			console.error('着色器程序链接失败: ' + gl.getProgramInfoLog(shaderProgram));
			return;
		}

		this.shaderProgramId = shaderProgram;
	}

	getProgramID() {
		return this.shaderProgramId;
	}
}