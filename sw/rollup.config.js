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
		input: 'src/sw.ts',
		output: [
			{
				file: 'D:/work/casualslots/build-templates/web-mobile/sw.js',
				format: 'umd',
				name: 'MyLibrary', // 全局变量名
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
			babel({
				extensions: [".ts"],
				babelHelpers: "bundled",
				presets: [
					[
						"@babel/env",
						{
							targets: {
								browsers: ["> 0.1%", "last 2 versions", "not ie <= 8"],
							},
						},
					],
				],
			}),
			terser(),
		],
	},
]);
