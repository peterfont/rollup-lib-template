import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
  {
    input: 'src/main.js',
    output: {
      file: pkg.main,
      format: 'cjs'
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: [
          [
            '@babel/env',
            {
              modules: false,
              useBuiltIns: "usage",
              targets: 'maintained node versions'
            }
          ]
        ]
      })
    ],
    external: [
      'lodash/random'
    ]
  },
  {
    input: 'src/main.js',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'eatFruit',
      globals: {
        'lodash/random': '_.random'
      }
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      }),
    ],
    external: [
      'lodash/random'
    ]
  },
  {
    input: 'src/main.js',
    output: {
      file: pkg.browser.replace(/\.js$/, '.min.js'),
      format: 'umd',
      name: 'eatFruit',
      globals: {
        'lodash/random': '_.random'
      }
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      }),
      terser() // minifiy
    ],
    external: [
      'lodash/random'
    ]
  },
  {
    input: 'src/main.js',
    output: {
      file: pkg.module,
      format: 'es'
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      })
    ],
    external: [
      'lodash/random'
    ]
  }
];