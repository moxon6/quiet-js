import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(dirname, 'dist'),
    filename: 'index.js',
  },
};
