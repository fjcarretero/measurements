import html from '@web/rollup-plugin-html';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import propertiesReader from 'properties-reader';
import {existsSync} from 'fs';

const envFile = existsSync('.env') ? '.env' : '../.env';
const FRONT_CONNECTION_TYPE = propertiesReader(envFile).get('FRONT_CONNECTION_TYPE');
console.log('FRONT_CONNECTION_TYPE', FRONT_CONNECTION_TYPE)
export default {
  plugins: [
    html({
      input: 'index.html',
      transformHtml: [html => html.replace('%%FRONT_CONNECTION_TYPE%%', FRONT_CONNECTION_TYPE)],
    }),
    resolve(),
    minifyHTML(),
    terser({
      ecma: 2021,
      module: true,
      warnings: true,
    }),
    copy({
      targets: [
        { src: 'src/assets/**/*', dest: '../public/assets' },
        { src: 'src/assets/wait.html', dest: '../public' },
        { src: 'node_modules/**/fonts/*', dest: '../public/assets/fonts' },
      ],
    }),
  ],
  output: {
    dir: '../public',
  },
  preserveEntrySignatures: 'strict',
};