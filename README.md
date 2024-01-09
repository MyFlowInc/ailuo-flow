
## deploy
- https://w0be5cxszhi.feishu.cn/docx/MqFUdsxGLoJzqrxjykQcDxLfn6f?from=from_copylink
## how to run   开发指引
```
nrm use yarn
// then
yarn
// or
pnpm install
// then
ionic serve

```

## build app

```
ionic build

ionic cap add ios
ionic cap add android

ionic cap copy

ionic cap sync

```

## run on ios or android
```

ionic cap open ios

ionic cap open android

```

## 本地测试
    ionic build
    yarn global add serve
    serve -s build

## 分支命名
    - feature-xxx
        新增需求
    - fix-xxx
        修改bug
## 提交规范


- feat: xxx
    新增需求
- doc:  xxx
    补充文档
- fix:  xxx
    修复bug
- refactor:  xxx
    重构代码
- release:  1.x.x
    发布版本

## 参考
    - [] ionic router  ionic page
        - https://stackblitz.com/edit/ionic-react-routing?file=src%2Findex.tsx,src%2FApp.tsx,src%2Fpages%2FDashboardPage.tsx,src%2Fpages%2FUsersListPage.tsx

## node
- node >= 16.x

## stack
- ionic 处理 安卓 ios 套壳
- react
- react-router
- redux
- 组件库 antd
