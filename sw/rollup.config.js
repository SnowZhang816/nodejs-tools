import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import externals from 'rollup-plugin-node-externals';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default defineConfig([
	{
		input: 'src/sw.ts',
		output: [
			{
				file: 'D:/work/casualslots/build-templates/web-mobile/sw.js',
				format: 'umd',
				name: 'MyLibrary', // 全局变量名
			},
		],
		plugins: [
			nodeResolve(),
			externals({
				devDeps: false,
			}),
			typescript(),
			commonjs(),
			json(),
			terser(),
		],
	},
]);
