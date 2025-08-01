import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import externals from 'rollup-plugin-node-externals';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';

export default defineConfig([
	{
		input: 'src/main.ts',
		output: [
			{
				file: 'D:/up/NewProject/tools/build/zip.js',
				format: 'umd',
				name: 'ZipUtil', // 全局变量名
			},
		],
		plugins: [
			nodeResolve({
				extensions: ['.ts']
			}),
			externals({
				devDeps: false,
			}),
			typescript(),
			commonjs(),
			json(),
			// babel({
			// 	extensions: [".ts"],
			// 	babelHelpers: "bundled",
			// 	presets: [
			// 		[
			// 			"@babel/env",
			// 			{
			// 				targets: {
			// 					browsers: ["> 50.0%", "last 2 versions", "not ie <= 8"],
			// 				},
			// 			},
			// 		],
			// 	],
			// }),
			terser(),
		],
	},
]);
