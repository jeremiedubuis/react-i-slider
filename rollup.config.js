import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const plugins = [
    typescript({
        tsconfigOverride: {
            compilerOptions: { declaration: true }
        }
    }),
    terser()
];

const globals = {
    react: 'React',
    'react-dom': 'ReactDOM'
};

export default {
    input: './src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            globals: globals
        },
        {
            file: pkg.module,
            format: 'esm',
            globals: globals
        }
    ],
    plugins
};
