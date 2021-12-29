# $ fast-gitignore | fgi [主题] [选项]

命令行工具，用来生成、更新 .gitignore 文件。 ’github/gitignore‘ 模板库已内嵌。

- [x] **简单**，非跨项目情况，一般而言，只需要运行 `fast-gitignore` / `fgi` 指令即可；
- [x] **可离线** 操作，所有模板在安装 [@iyowei/cli-fast-gitignore][@iyowei/cli-fast-gitignore] 时就已经下载到本地，生成 `.gitignore` 文件非常快;
- [x] 更新当前/指定项目的 .gitignore 文件；
- [x] 支持 **跨项目** 创建 .gitignore 文件，并使用当前工作目录的预设；
- [x] 无预设、无指定的情况下，可从 **上次使用的预设** 创建；
- [x] 多入口读取预设，用户输入、用户预设、上次预设；

## 使用

> 在命令行里从上百个主题中选择，这并非高效的做法，所以 [@iyowei/cli-fast-gitignore][@iyowei/cli-fast-gitignore] 并不提供交互式列表以供选择，推荐翻看 [github/gitignore][github/gitignore]。

```
$ 使用方式
  $ fast-gitignore | fgi [主题] [选项]

  选项
    --out, -o,                                 '.gitignore' 文件存储位置，默认：'process.cwd()'
    --config-from-cwd                          使用从当前工作路径处读取到的配置，跨项目操作时如有需要可使用

    --version, -V,                             查看版本号
    --help, -h                                 查看帮助

  示例
    $ fgi macOS Windows Linux                  在当前工作路径读取配置并生成（更新） .gitignore 文件
```

### 为当前项目生成

```shell
# 第一次生成
fgi macOS Windows Linux

# 更新
fgi
```

### 给非工作目录生成

即：在指定路径里生成生成/更新 .gitignore 文件。前提是指定路径里存在必须配置。如果指定路径没有预设，会读取上次预设，如果上次预设也没有，系统退出。

```shell
fgi -o /Users/iyowei/Development/iyowei/wext

# 当前工作路径 /Users/iyowei/Development/iyowei/cli-fast-gitignore
# 为 /Users/iyowei/Development/iyowei/wext 项目生成 .gitignore
```

### 使用当前项目的预设跨项目生成

```shell
fgi -o /Users/iyowei/Development/iyowei/wext --config-from-cwd

# 当前工作路径 /Users/iyowei/Development/iyowei/cli-fast-gitignore
# 为 /Users/iyowei/Development/iyowei/wext 项目生成 .gitignore
```

**如果同时在配置文件、命令行中都指定了模板，[@iyowei/cli-fast-gitignore][@iyowei/cli-fast-gitignore] 会选择在命令行中的声明。** 💥

## 安装

[![Node Version Badge][node version badge]][download node.js] ![esm][esm]

在全局系统环境下使用的话，需要先全局安装 [@iyowei/cli-fast-gitignore][@iyowei/cli-fast-gitignore]，

**NPM**

```shel
npm i -g @iyowei/cli-fast-gitignore
```

**PNPM**

```shel
pnpm add @iyowei/cli-fast-gitignore --global
```

**Yarn**

```shel
yarn global add @iyowei/cli-fast-gitignore
```

## 预设

默认情况下，[@iyowei/cli-fast-gitignore][@iyowei/cli-fast-gitignore] 会搜索以下文件中的 `gitignore` 属性：

- `package.json` 属性；
- `JSON` 或者 `YAML` 等无后缀的 `rc` 文件；
- 有后缀的 `rc` 文件，诸如：`.json`, `.yaml`, `.yml`, 或者 `.js`；
- `.config.js` **CommonJS** 模块；

例如：

- `package.json` 文件中的 `gitignore` 属性
- `JSON` 或者 `YAML` 格式的 `.gitignorerc` 文件
- `.gitignorerc.json` 文件
- `.gitignorerc.yaml`, `.gitignorerc.yml`, 或者 `.gitignorerc.js` 文件
- 导出一个 JS 对象的 `gitignore.config.js` 文件

[@iyowei/cli-fast-gitignore][@iyowei/cli-fast-gitignore] 从工作目录开始搜索配置，如果在根目录没有找到，会继续搜索子目录，直到找到有效的配置。

预设示例：

```json
{
  "gitignore": {
    "topics": [
      "macOS",
      "Windows",
      "Linux",
      "Node",
      "VisualStudioCode",
      "SublimeText",
      "CVS",
      "Diff",
      "Vim",
      "TortoiseGit"
    ],
    "custom": []
  }
}
```

## 相关

- [@iyowei/fast-gitignore][@iyowei/fast-gitignore]，API，收集模板但不会生成 .gitignore 文件；
- [@iyowei/latest-gitignore][@iyowei/latest-gitignore]，API，从远程 [github/gitignore][github/gitignore] 收集模板，不会生成 .gitignore 文件；
- [@iyowei/cli-latest-gitignore][@iyowei/cli-latest-gitignore]，命令行应用，生成 .gitignore 文件。

## 参与贡献

![PRs Welcome][prs welcome badge]

[github/gitignore]: https://github.com/github/gitignore
[@iyowei/cli-fast-gitignore]: https://github.com/iyowei/cli-fast-gitignore
[@iyowei/latest-gitignore]: https://github.com/iyowei/latest-gitignore
[@iyowei/cli-latest-gitignore]: #
[@iyowei/fast-gitignore]: https://github.com/iyowei/fast-gitignore
[node version badge]: https://img.shields.io/badge/node.js-%3E%3D12.20.0-brightgreen?style=flat&logo=Node.js
[download node.js]: https://nodejs.org/en/download/
[prs welcome badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat
[esm]: https://img.shields.io/badge/ESM-brightgreen?style=flat
