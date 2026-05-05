import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      name: 'MultibyteStream',
      file: 'dist/multibyte-stream.umd.js',
      format: 'umd',
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      exclude: ['**/__tests__/**', '**/*.spec.ts'],
    }),
    copy({
      targets: [
        { src: 'LICENSE', dest: 'dist' },
        { src: 'README.md', dest: 'dist' },
        { src: 'SKILL.md', dest: 'dist' },
        { src: 'package.json', dest: 'dist' },
      ],
    }),
  ],
};
