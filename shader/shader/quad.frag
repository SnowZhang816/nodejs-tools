#extension GL_OES_standard_derivatives : enable
precision mediump float;

uniform float u_time;

varying vec2 texCoords;
varying vec4 color;

float sdCircle(vec2 uv, float radius)
{
	return length(uv) - radius;
}

// 计算正方形SDF函数
float sdCube(vec2 uv, float r){
	vec2 d = abs(uv) - r;
	return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float unionSdf(vec2 a){
	float s = sdCircle(a + vec2(0.5,0.0), 0.2);
	float c = sdCube(a - vec2(0.5,0.0) * sin(u_time), 0.2);
	return max(c, -s);

	// float s = sdCircle(a + vec2(0.5,0.0), 0.2);
	// float c = sdCube(a - vec2(0.5,0.0), 0.2);
	// // return min(s,c);
	// return mix(s, c, sin(u_time)*0.5 + 0.5);
}

void main(){
	// vec2 uv = texCoords * 2.0;
	// float width = 30.0;
	// float sdf = unionSdf(uv - 1.0) * width;
	// vec4 _CenterColor = vec4(0.7,0.5,0.3,1.0);
    // vec4 _EdgeColor = vec4(0.3,0.4,0.4, 1.0);
	// float seg = floor(sdf);
    // vec4 color1 = mix(_CenterColor, _EdgeColor, seg / 5.0);
	// gl_FragColor = color1;

	// float cseg = sdf - seg; // 0, 1
	// cseg = cseg - 0.5; // -0.5, 0, 0.5
	// cseg = abs(cseg); // 0.5, 0, 0.5
	// cseg = 0.5 - cseg; // 0, 0.5, 0 
	// // cseg = step(0.1, cseg);
	// cseg = smoothstep(0.0, 0.1, cseg); // 1, 0
	// color1 = mix(vec4(0.0,0.0,0.0,1.0), color1, cseg);
	// gl_FragColor = mix(vec4(1.0,0.0,0.0,1.0), color1, smoothstep(0.0,0.1, abs(sdf)));

	// SDF union
	// vec2 uv = texCoords * 2.0;
	// float sdf = unionSdf(uv - 1.0);
	// // sdf = step(0.5, abs(sdf));
	// // sdf = smoothstep(0.5 - 0.01, 0.5 + 0.01, abs(sdf));
	// vec4 color1 = vec4(sdf,sdf,sdf,1.0);
	// gl_FragColor = color1;


	// 等高线 cube
	// vec2 uv = texCoords * 2.0;
	// float width = 30.0;
	// float sdf = sdCube(uv - 1.0, 0.25) * width;
	// vec4 _CenterColor = vec4(0.7,0.5,0.3,1.0);
    // vec4 _EdgeColor = vec4(0.3,0.4,0.4, 1.0);
	// float seg = floor(sdf);
    // vec4 color1 = mix(_CenterColor, _EdgeColor, seg / 5.0);
	// gl_FragColor = color1;

	// // 等高线描边 cube
	// float cseg = sdf - seg; // 0, 1
	// cseg = cseg - 0.5; // -0.5, 0, 0.5
	// cseg = abs(cseg); // 0.5, 0, 0.5
	// cseg = 0.5 - cseg; // 0, 0.5, 0 
	// // cseg = step(0.1, cseg);
	// cseg = smoothstep(0.0, 0.1, cseg); // 1, 0
	// color1 = mix(vec4(0.0,0.0,0.0,1.0), color1, cseg);
	// gl_FragColor = mix(vec4(1.0,0.0,0.0,1.0), color1, step(0.1, abs(sdf)));

	// 绘制cube 边缘 消除锯齿
	// float sdf = sdCube(texCoords - 0.5, 0.25);
	// sdf = smoothstep(0.0, 0.003, abs(sdf));
	// gl_FragColor = vec4(sdf,sdf,sdf,1.0);

	// 绘制cube 边缘
	// float sdf = sdCube(texCoords - 0.5, 0.25);
	// sdf = step(0.003, abs(sdf));
	// gl_FragColor = vec4(sdf,sdf,sdf,1.0);

	// 绘制cube 消除二值化锯齿
	// float sdf = sdCube(texCoords - 0.5, 0.25);
	// sdf = smoothstep(0.0, 0.005, sdf);
	// gl_FragColor = vec4(sdf,sdf,sdf,1.0);

	// 绘制cube二值化
	// float sdf = sdCube(texCoords - 0.5, 0.25);
	// sdf = step(0.0, sdf);
	// gl_FragColor = vec4(sdf,sdf,sdf,1.0);

	// 绘制cube
	// float sdf = sdCube(texCoords - 0.5, 0.25);
	// gl_FragColor = vec4(sdf,sdf,sdf,1.0);

	// 等高线
	// float width = 30.0;
	// float sdf = sdCircle(texCoords - 0.5, 0.25) * width;
	// vec4 _CenterColor = vec4(0.7,0.5,0.3,1.0);
    // vec4 _EdgeColor = vec4(0.3,0.4,0.4, 1.0);
	// float seg = floor(sdf);
    // vec4 color1 = mix(_CenterColor, _EdgeColor, seg / 5.0);
	// gl_FragColor = color1;

	// 等高线描边 
	// float cseg = sdf - seg; // 0, 1
	// cseg = cseg - 0.5; // -0.5, 0, 0.5
	// cseg = abs(cseg); // 0.5, 0, 0.5
	// cseg = 0.5 - cseg; // 0, 0.5, 0 
	// // cseg = step(0.1, cseg);
	// cseg = smoothstep(0.0, 0.1, cseg); // 1, 0
	// color1 = mix(vec4(0.0,0.0,0.0,1.0), color1, cseg);
	// gl_FragColor = mix(vec4(1.0,0.0,0.0,1.0), color1, step(.1,abs(sdf)));

	// 消除边缘锯齿
	// abs返回的值大于0
	// 边缘附近的SDF绝对值是接近0的。
	// 边缘宽度 = with * 2
	// 也就是在-0.003和0.003之间的值作为边界
	// smoothstep函数使得-0.003和0.003之间的值在0到1之间过渡平滑，而不是二值化。
	// float sdf = sdCircle(texCoords - 0.5, 0.25);
	// float width = 0.003;
	// float edge = smoothstep(0.0, width, abs(sdf)); // 消除锯齿边缘效果，平滑过渡效果。
	// gl_FragColor = vec4(edge,edge,edge,1.0);

	// 边缘
	// float sdf = sdCircle(texCoords - 0.5, 0.25);
	// float edge = step(0.001, abs(sdf));//边缘附近的SDF绝对值是接近0的。
	// gl_FragColor = vec4(edge,edge,edge,1.0);

	// 消除二值化锯齿
	// float sdf = sdCircle(texCoords - 0.5, 0.25);
	// float width = fwidth(sdf); // 计算局部变化率，用于抗锯齿
	// float width2 = 0.002;
	// float edge = smoothstep(-width2, width2, sdf); // 消除锯齿边缘效果，平滑过渡效果。
	// gl_FragColor = vec4(edge,edge,edge,1.0);

	// 二值化
	// float sdf = sdCircle(texCoords - 0.5, 0.25);
	// float edge = step(0.0, sdf);
	// gl_FragColor = vec4(edge,edge,edge,1.0);

	// SDF
	// float sdf = sdCircle(texCoords - 0.5, 0.25);
	// gl_FragColor = vec4(sdf,sdf,sdf,1.0);

	gl_FragColor = vec4(color.xyz,color.w);
}