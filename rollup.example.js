import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';

const plugins = [
    typescript(),
    replace({
        'process.env.NODE_ENV': JSON.stringify('production')
    }),
    resolve(),
    commonjs()
];

export default {
    input: './src/examples.tsx',
    output: [
        {
            file: './public/examples.js',
            format: 'esm'
        }
    ],
    plugins
};
