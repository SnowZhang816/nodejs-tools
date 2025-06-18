#extension GL_OES_standard_derivatives : enable
precision mediump float;

uniform float u_time;
uniform int after_effect;
uniform float outlineHalfWidth;

varying vec2 texCoords;
varying vec4 u_color;

uniform sampler2D u_texture0;

#define PI 3.141592653589793

// 将值t从范围[a, b]映射到[0, 1]。
float Remap01(float a, float b, float t) {
	return (t-a) / (b-a);
}

// 将值t从范围[a, b]映射到[c, d]。
float Remap(float a, float b, float c, float d, float t) {
	return Remap01(a, b, t) * (d-c) + c;
}

// 脉冲函数
// X,Y区间都是[0,1]，X=0.5位置Y=1
// https://www.iquilezles.org/www/articles/functions/functions.htm
float Pulse(float x) {
	return pow(4.0 * x * (1.0 - x), 16.0);
}

void main(){
	vec2 uv = texCoords;

	if(after_effect == 1){

		vec4 col = texture2D(u_texture0, uv);
    	float alpha = col.a;

		float offset = Remap(-1., 1., 0., 0.2, uv.y);
    	float outlineWidth = 0.5;//  + offset * (uv.y);
// 3,153,106
// 56,166,92
		// 选择一个alpha值做为轮廓的中线
		float centerAlpha = 0.5;

    	float alphaDist = abs(alpha - centerAlpha);
    	// float mask = smoothstep(outlineWidth, 0., alphaDist);
		float mask = smoothstep(0.0, outlineWidth, alphaDist);
		mask = 1.0 - mask;
		// mask = Remap(0.0, 1.0, 0.0, 1.0, mask);
		// mask = smoothstep(0.0,2.0, mask);
		// mask = Pulse(mask + 1.0);
		// mask = Pulse((alphaDist + 0.5));
		mask = pow(mask, 1.5);
	    // 外发光颜色
    	vec4 outlineColor = vec4(255.0/255.0, 0.0/255.0, 255.0/255.0, mask);

		// 底色基础上叠加一个亮度，叠加后中心位置变白
		float brightness = 0.3;
		outlineColor.rgb += Pulse((alphaDist + 0.5)) * brightness;
		// outlineColor.rgb += brightness;

		// 原图的轮廓alpha平滑处理
		col.a = smoothstep(0.48, 0.49, alpha);
		col.rgb *= col.a;

    	// 外发光和原图混合
    	col = mix(outlineColor, col, smoothstep(0.5,0.55, alpha));

		// 混合
		// col.xyz = outlineColor.xyz * mask + col.xyz * (1.0 - mask);
		// col.w = 1.0;
    	gl_FragColor = col;

	} else{
		vec4 color = texture2D(u_texture0, uv);
		gl_FragColor = color * u_color;
	}
}