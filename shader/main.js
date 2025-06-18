import { Render } from "./render.js";
import { Quad } from "./Quad.js";
import { Program } from "./Program.js";
import { Sprite } from "./sprite.js";
import { Texture } from "./texture.js";
import { RenderTexture } from "./RenderTexture.js";


let gl = document.getElementById("canvas").getContext("webgl");
if (gl) {
	let render = new Render();
	window.render = Render;

	let screenWidth = gl.canvas.width;
	let screenHeight = gl.canvas.height;

	let quad = new Quad(100, 100);
	Promise.all([fetch('shader/quad.vert').then((res) => res.text()), fetch('shader/quad.frag').then((res) => res.text())]).then(([vs, fs]) => {
		let program = new Program(gl, vs, fs);
		quad.setProgram(program);
		// render.addModel(quad);
	});

	let image = new Image();
	image.src = "imgs/Cocos.png";
	image.onload = () => {
		Promise.all([fetch('shader/sprite.vert').then((res) => res.text()), fetch('shader/sprite.frag').then((res) => res.text())]).then(([vs, fs]) => {
			let program = new Program(gl, vs, fs);
			let texture = new Texture(gl, image);
			let sprite = new Sprite(texture);
			sprite.setProgram(program);
			render.addModel(sprite);
			sprite.setPosition(screenWidth / 2 + 200, screenHeight / 2 + 200);
		});
	};

	let image1 = new Image();
	image1.src = "imgs/Cocos.png";
	image1.onload = () => {
		Promise.all([fetch('shader/post.vert').then((res) => res.text()), fetch('shader/post.frag').then((res) => res.text())]).then(([vs, fs]) => {
			let program = new Program(gl, vs, fs);
			let texture = new Texture(gl, image1);
			let renderTexture = new RenderTexture(texture);
			renderTexture.setProgram(program);
			render.addModel(renderTexture);
			renderTexture.setPosition(screenWidth / 2, screenHeight / 2);
		});
	};


	let now = performance.now();
	let delta = 0.0;
	let totalTimes = 0
	function renderScene() {
		let cur = performance.now();
		delta = cur - now;
		totalTimes += delta;
		now = cur;

		quad.setPosition(100, 100);
		quad.setScale(0.5);
		quad.setAngle(20);
		quad.setOpacity(0.5);

		render.setDeltaTime(delta);
		render.setTotalTime(totalTimes / 1000.0);
		render.render(gl);

		requestAnimationFrame(renderScene);
	}

	requestAnimationFrame(renderScene);
	console.log("Hello, world!");
}

