# 测试用例

## 1

- 当前工作路径
- 没有输入主题
- 没有预设
- 没有 "上次预设"

```shell
fgi
```

期望：

- 未读取到主题预设
- 不生成 .gitignore

## 2

- 当前工作路径
- 输入主题 Node Windows
- 没有预设
- 没有 "上次预设"

```shell
fgi Node Windows
```

期望：

- 读取到主题 Node Windows
- 创建预设
- 更新 "上次预设"
- 生成 .gitignore

## 3

- 当前工作路径
- 没有输入主题
- 使用预设 `{ "topics": [ "Node", "Windows" ]}`
- 没有 "上次预设"

```shell
fgi
```

期望：

- 读取到主题 Node Windows
- 不会创建预设
- 更新 "上次预设"
- 生成 .gitignore

## 4

- 当前工作路径没预设
- 有 "上次预设" `{ "topics": [ "Node", "Windows" ]}`
- `/Users/iyowei/Development/iyowei/create-esm` 没有预设
- 为项目 `/Users/iyowei/Development/iyowei/create-esm` 生成 .gitignore 文件
- 没有输入主题

```shell
fgi -o /Users/iyowei/Development/iyowei/create-esm
```

期望：

- 使用 "上次预设" 中的主题 Node Windows
- 当前工作路径不生成预设文件
- 创建 `/Users/iyowei/Development/iyowei/create-esm/.gitignorerc.json`
- 生成 `/Users/iyowei/Development/iyowei/create-esm/.gitignore`
- 更新 "上次预设" <!-- 目前，即使前后内容一致依然会覆写 -->

## 5

- 当前工作路径没预设
- 有 "上次预设" `{ "topics": [ "Node", "Windows" ]}`
- `/Users/iyowei/Development/iyowei/create-esm` 有预设文件
- 为项目 `/Users/iyowei/Development/iyowei/create-esm` 更新 .gitignore 文件
- 没有输入主题

```shell
fgi -o /Users/iyowei/Development/iyowei/create-esm
```

期望：

- 使用 `/Users/iyowei/Development/iyowei/create-esm/.gitignorerc.json` 预设文件中的主题 Node Windows
- 不重复创建 `/Users/iyowei/Development/iyowei/create-esm/.gitignorerc.json`
- 更新 `/Users/iyowei/Development/iyowei/create-esm/.gitignore`
- 更新 "上次预设" <!-- 目前，即使前后内容一致依然会覆写 -->

## 5

- 当前工作路径有预设 `{ "topics": [ "Node", "Windows", "Linux" ]}`
- 有 "上次预设" `{ "topics": [ "Node", "Windows" ]}`
- `/Users/iyowei/Development/iyowei/create-esm` 有预设文件 `{ "topics": [ "Node", "Windows" ]}`
- 为项目 `/Users/iyowei/Development/iyowei/create-esm` 更新 .gitignore 文件
- 没有输入主题

```shell
fgi -o /Users/iyowei/Development/iyowei/create-esm
```

期望：

- 使用 `/Users/iyowei/Development/iyowei/create-esm/.gitignorerc.json` 预设中的主题 Node Windows
- 更新 `/Users/iyowei/Development/iyowei/create-esm/.gitignore`
- 更新 "上次预设" <!-- 目前，即使前后内容一致依然会覆写 -->

## 6

- 当前工作路径有预设 `{ "topics": [ "Node", "Windows", "Linux" ]}`
- 有 "上次预设" `{ "topics": [ "Node", "Windows" ]}`
- `/Users/iyowei/Development/iyowei/create-esm` 有预设文件 `{ "topics": [ "Node", "Windows" ]}`
- 为项目 `/Users/iyowei/Development/iyowei/create-esm` 更新 .gitignore 文件
- 没有输入主题
- 指定使用当前工作路径的预设规则

```shell
fgi -o /Users/iyowei/Development/iyowei/create-esm --config-from-cwd
```

期望：

- 使用 **当前工作路径预设文件** 中的主题 Node Windows Linux
- 用 **当前工作路径预设文件** 中的预设规则覆盖 `/Users/iyowei/Development/iyowei/create-esm/.gitignorerc.json`
- 更新 `/Users/iyowei/Development/iyowei/create-esm/.gitignore`
- 更新 "上次预设"

## 6

- 当前工作路径有预设 `{ "topics": [ "Node", "Windows", "Linux" ]}`
- 没有有 "上次预设"
- `/Users/iyowei/Development/iyowei/create-esm` 有预设文件 `{ "topics": [ "Node", "Windows" ]}`
- 为项目 `/Users/iyowei/Development/iyowei/create-esm` 更新 .gitignore 文件
- 没有输入主题
- 指定使用当前工作路径的预设规则

```shell
fgi -o /Users/iyowei/Development/iyowei/create-esm --config-from-cwd
```

期望：

- 使用 **当前工作路径预设文件** 中的主题 Node Windows Linux
- 用 **当前工作路径预设文件** 中的预设规则覆盖 `/Users/iyowei/Development/iyowei/create-esm/.gitignorerc.json`
- 更新 `/Users/iyowei/Development/iyowei/create-esm/.gitignore`
- 更新 "上次预设"
