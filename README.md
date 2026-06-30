# word-editor 公测 WASM Demo

`word-editor` 是面向浏览器应用的 DOCX 编辑器。这个仓库用于发布免费公测 WASM 成品，并通过 GitHub Issues 收集真实样例、兼容性问题、产品建议和购买意向。

> 本仓库不是完整源码仓库。公测包用于本地体验，核心运行时代码封装在 WASM 中。

## 快速体验

下载最新版公测包：

- GitHub 仓库内成品：[public-beta/word-editor-local-wasm-verify.zip](./public-beta/word-editor-local-wasm-verify.zip)
- 官网下载地址：[https://docx-editor.pages.dev/downloads/word-editor-local-wasm-verify.zip](https://docx-editor.pages.dev/downloads/word-editor-local-wasm-verify.zip)
- 校验信息：[public-beta/word-editor-local-wasm-verify.json](./public-beta/word-editor-local-wasm-verify.json)

本地启动：

```bash
unzip word-editor-local-wasm-verify.zip
cd local-wasm-verify-dist
node serve-localhost.mjs
```

打开：

```text
http://127.0.0.1:8789/
```

当前公测包：

```text
buildId: local-wasm-20260630072907
sha256: c1e4aab112de2cb7cc456dc6dacc2f45ee017edaa2341197bb54ee1797a0a63a
有效期: 2026-07-30T07:29:11.000Z
允许访问: http://127.0.0.1:* / http://localhost:*
```

## 官方入口

- 官网：[https://docx-editor.pages.dev/](https://docx-editor.pages.dev/)
- 在线 Demo：[https://docx-editor.pages.dev/examples/demo/](https://docx-editor.pages.dev/examples/demo/)
- 文档：[https://docx-editor.pages.dev/docs/](https://docx-editor.pages.dev/docs/)
- 发布元数据：[https://docx-editor.pages.dev/word-editor-release.json](https://docx-editor.pages.dev/word-editor-release.json)

## 购买与合作

- 购买意向联系：[提交购买咨询 Issue](https://github.com/flyfish-dev/word-editor/issues/new?template=purchase-intent.yml)
- 购买链接：[开启购买/商用授权预登记](https://github.com/flyfish-dev/word-editor/issues/new?template=purchase-intent.yml)
- 产品问题和样例反馈：[提交问题或样例](https://github.com/flyfish-dev/word-editor/issues/new/choose)

购买咨询请尽量说明使用场景、部署方式、预计用户规模、是否需要私有化/离线授权、是否需要定制功能或技术支持。

## 反馈样例与问题

欢迎通过 Issues 帮助我们完善产品：

- 上传无法正确打开、渲染或保存的 DOCX 样例。
- 描述 Word、WPS、OnlyOffice 或 Word Online 中的正确效果。
- 提供截图、录屏、浏览器版本、系统版本和复现步骤。
- 标注是否包含隐私、合同、客户数据或受版权保护内容。

请勿上传未脱敏的敏感文件。若样例无法公开，请先创建 Issue 描述问题，我们会沟通安全提交方式。

## 公测包约束

- 仅用于免费本地体验和问题反馈。
- 只允许 `localhost` / `127.0.0.1` 访问。
- 不要部署到公网服务器。
- 不包含完整源码，也不授予反编译、破解授权门禁或绕过访问限制的许可。

## 仓库内容

```text
public-beta/
  word-editor-local-wasm-verify.zip
  word-editor-local-wasm-verify.json
.github/ISSUE_TEMPLATE/
  bug-report.yml
  sample-document.yml
  purchase-intent.yml
```

## 状态

当前为公开公测阶段。我们会根据 Issues 中的真实文档样例和问题报告持续更新 WASM 成品包、在线 Demo 和正式产品。
