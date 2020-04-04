import typescript from '@rollup/plugin-typescript';

export default {
  input: 'source/index.ts',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [typescript()]
};
