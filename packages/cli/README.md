
# 测试用例

## 使用前提
- pnpm link --global
- 在cli目录下执行 trainxm 命令

## 从 URL 生成类型
trainxm generate --source https://api.example.com/users --output ./src/types --name UserTypes

## 从本地文件生成类型
trainxm generate --source ./tests/config.json --output ./src/types --name LocalTypes

## 批量处理多个源
trainxm batch --config ./tests/config.json --output ./src/types

