import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';

export default [
  {
    input: 'src/quiet-web.js',
    output: {
      file: 'dist/web.js',
      format: 'module',
    },
  },
  {
    input: 'src/quiet-node.js',
    output: {
      file: 'dist/node.js',
      format: 'module',
    },
  },
  {
    input: 'quiet-profiles.json',
    output: {
      file: 'dist/profiles.js',
      format: 'module',
    },
    plugins: [
      json(),
      copy({
        targets: [
          { src: 'package*.json', dest: 'dist' },
        ],
      }),
    ],
  }, {
    input: 'src/quiet.worklet.js',
    output: {
      file: 'dist/quiet.worklet.js',
      format: 'module',
    },
  },
];
