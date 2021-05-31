import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
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
