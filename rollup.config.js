import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from  'rollup-plugin-typescript2'
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

const production = process.env.NODE_ENV === 'production';

module.exports = {
    input: 'src/index.ts',
    output: {
      file: 'dist/lib.js',
      format: 'esm'
    },
    plugins: [
        builtins(),
        globals(),
        resolve(),
        commonjs(),
        json(),
        typescript(),
        production && terser()
    ]
  };