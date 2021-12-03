# Baiyu CLI

自用手脚架，是从[vue-cli](https://github.com/vuejs/vue-cli)那里拿过来改造了一下。

## 使用

安装

```shell
npm i -g @baiyusoup/cli
```

创建项目

```shell
baiyu create new-project
```

## 使用说明

基本和 vue-cli 一样

- Check then features needed for your project
  - use template 新项目使用的模板，内置的模板有 react、vue、node 以及它们的 ts 版本，详细信息可以去`templates`包下看。
  - use style files 新项目是否使用样式文件，如果没有涉及样式的话，可以去掉。
  - use linter and formatter 主要是 eslint、prettier 等规范化相关的。
