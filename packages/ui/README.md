
## 打包目录结构

- rollup打包
    - "build": "rollup -c"

```bash
# 构建你的组件库
npm run build

# 登录到 npm
npm login

# 发布到 npm
npm publish
```

your-component-library/
├── .storybook/          # Storybook配置
├── src/
│   ├── components/      # 组件目录
│   │   ├── Button.tsx   # 按钮组件
│   │   └── Button.stories.tsx
│   └── index.ts         # 导出所有组件
├── package.json
├── rollup.config.js
└── tsconfig.json

