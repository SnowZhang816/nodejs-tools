#extension GL_OES_standard_derivatives : enable
precision mediump float;

uniform float u_time;

varying vec2 texCoords;
varying vec4 u_color;

uniform sampler2D u_texture0;

void main(){
	vec2 uv = texCoords;

 	// 从右往左：将 u_time 作为偏移，并使用 fract() 保证循环效果
    // uv.x = fract(uv.x - (u_time / 5.0));

	vec4 color = texture2D(u_texture0, uv);
	gl_FragColor = color * u_color;
}