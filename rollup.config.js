import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from  'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser';
import autoExternal from 'rollup-plugin-auto-external';

const production = process.env.NODE_ENV === 'production';

module.exports = {
    input: 'src/index.ts',
    output: {
      file: 'dist/soundtouch.js',
      format: 'iife',
      name: 'soundtouch'
    },
    plugins: [
        autoExternal(),
        resolve(),
        commonjs(),
        typescript(),
        production && terser()
    ]
  };