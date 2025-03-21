# 测试用例

## 使用前提
- pnpm link --global
- 在cli目录下执行 trainxm 命令

## 简介

`trainxm` 是一个便捷的命令行工具，用于从 JSON 数据源（API URL 或本地文件）生成各种编程语言的类型定义。它支持交互式和命令行两种使用方式，可以快速帮助开发者生成高质量的类型定义文件。

## 功能特点

- 从 API URL 或本地 JSON 文件生成类型定义
- 支持多种编程语言（TypeScript, JavaScript, Java 等）
- 交互式操作界面，简单易用
- 批量处理多个 JSON 数据源
- 自动格式化和优化生成的类型
- 集成 VSCode，可以一键打开生成的文件

## 使用方法

### 基本使用

直接运行 `trainxm` 命令将启动交互式界面：

```bash
trainxm
```

系统会引导您完成以下步骤：
1. 输入 API URL 地址
2. 指定生成的类型名称
3. 选择保存位置（桌面、当前目录或自定义路径）

### 命令行参数

您也可以通过命令行参数直接运行：

```bash
trainxm -u https://jsonplaceholder.typicode.com/users/1 -n UserTypes -p ./types
```

参数说明：
- `-u, --url <url>`: API URL 地址
- `-n, --name <name>`: 生成的类型名称
- `-p, --path <path>`: 保存路径

### 高级功能 (trainxm 完整版)

完整版的 trainxm 命令行工具提供了更多高级功能：

#### 交互式模式

```bash
trainxm i
# 或
trainxm interactive
```

#### 直接生成模式

```bash
trainxm g -s https://api.example.com/data -o ./types -n UserTypes -l typescript
# 或
trainxm generate -s path/to/data.json -o ./types -n UserTypes -l java
```

参数说明：
- `-s, --source <source>`: JSON 数据源（URL 或本地文件路径）
- `-o, --output <directory>`: 输出目录，默认为 `./types`
- `-n, --name <name>`: 类型名称，默认为 `ApiTypes`
- `-l, --lang <language>`: 目标语言，默认为 `typescript`
- `-h, --headers <headers>`: HTTP 请求头（JSON 格式，仅对 URL 源有效）

#### 批量处理模式

```bash
trainxm b -c config.json -o ./generated-types
# 或
trainxm batch -c config.json -o ./generated-types
```

参数说明：
- `-c, --config <file>`: 配置文件路径（JSON 格式）
- `-o, --output <directory>`: 基础输出目录，默认为 `./types`

配置文件示例 (config.json)：

```json
{
  "sources": [
    {
      "name": "UserTypes",
      "source": "https://api.example.com/users",
      "lang": "typescript",
      "headers": {
        "Authorization": "Bearer token123"
      },
      "outputDir": "user"
    },
    {
      "name": "ProductTypes",
      "source": "./data/products.json",
      "lang": "java",
      "outputDir": "product"
    }
  ]
}
```

## 支持的语言

trainxm 支持生成以下编程语言的类型定义：

- TypeScript (默认)
- JavaScript
- Java
- C#
- Python
- Swift
- Kotlin
- Go
- Rust
- Ruby
- Dart
- Flow

## 常见问题

### 如何处理嵌套的复杂 JSON？

trainxm 会自动处理嵌套的 JSON 结构，生成相应的嵌套类型定义。

### 如何处理大型 JSON 文件？

对于较大的 JSON 文件，建议使用本地文件路径而非 URL，以提高处理效率。

### 生成的类型不符合预期怎么办？

尝试提供更完整的样本数据，确保 JSON 包含所有可能的字段及其数据类型。

## 提示与技巧

1. 对于数组类型的 API 响应，工具会使用数组中的第一个元素作为样本来生成类型。
2. 使用 VSCode 集成功能可以快速预览和编辑生成的类型定义。
3. 批量模式非常适合处理多个相关 API 端点。

## 示例

### 从 RESTful API 生成 TypeScript 类型

```bash
trainxm -u https://jsonplaceholder.typicode.com/users -n User -p ./src/types
```

### 从本地 JSON 文件生成 Java 类

```bash
trainxm g -s ./data/products.json -o ./src/main/java/models -n Product -l java
```

## 帮助与支持

查看命令帮助：

```bash
trainxm --help
trainxm generate --help
trainxm batch --help
```