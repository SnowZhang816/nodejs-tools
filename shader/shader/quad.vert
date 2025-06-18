attribute vec2 v_position;
attribute vec2 v_texCoords;
attribute vec4 v_color;

varying vec2 texCoords;
varying vec4 color;
// 变换矩阵，从外部传入
uniform mat4 modelViewMatrix;
uniform mat4 screenMatrix;
uniform mat4 modelMatrix;

void main(){
	texCoords = v_texCoords;
	color = v_color;

	vec2 pos = (screenMatrix * modelMatrix * vec4(v_position, 0.0, 1.0)).xy;
	// vec2 pos = v_position;

	gl_Position = vec4(pos, 0.0, 1.0);
}