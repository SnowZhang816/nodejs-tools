import { TinyPng } from './src/tinypng.js';

// let url = new URL('image');

let path = "F:\\learn\\tools\\image"
let i = process.argv.findIndex((i) => i === "-input")
if (i !== -1) path = process.argv[i + 1]

let ins = new TinyPng();
ins.run(path);
