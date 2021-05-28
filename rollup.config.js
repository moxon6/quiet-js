import json from '@rollup/plugin-json';

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'module',
    },
    plugins: [json()],
  }, {
    input: 'src/quiet.worklet.js',
    output: {
      file: 'dist/quiet.worklet.js',
      format: 'module',
    },
  },
];
