import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import { readFile } from 'fs/promises';

// 动态导入 package.json
const packageJson = JSON.parse(
  await readFile(new URL('./package.json', import.meta.url), 'utf8')
);

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        compilerOptions: {
          // 覆盖 tsconfig.json 中的选项
          declarationDir: './dist/types'
        }
      }),
      terser(),
    ],
    // 确保外部依赖正确配置
    external: ['react', 'react-dom', '@radix-ui/themes', 'class-variance-authority', 'clsx', 'tslib'],
  },
  {
    input: 'dist/types/index.d.ts',  // 修改为正确的类型定义输入路径
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()]
  }
];