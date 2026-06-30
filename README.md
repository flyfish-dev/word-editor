# word-editor 公测 WASM Demo

`word-editor` 是面向浏览器应用的 DOCX 编辑器。这个公开仓库直接放置展开后的免费公测 WASM Demo，用于体验产品，并通过 GitHub Issues 收集真实样例、兼容性问题、产品建议和购买意向。

> 本仓库不是完整源码仓库。仓库中的 HTML/JS 只是本地服务和加载逻辑；核心编辑器运行时代码封装在 `wasm/word-editor-local-core.wasm` 中。

## 快速体验

```bash
git clone https://github.com/flyfish-dev/word-editor.git
cd word-editor
node serve-localhost.mjs
```

打开：

```text
http://127.0.0.1:8789/
```

当前展开版：

```text
buildId: local-wasm-20260630075500
payloadSha256: 7e8b99e560c523c9a66797156bd55615383021191ad7bb638f6bbfb01332121b
有效期: 2026-07-30T07:55:06.000Z
允许访问: http://127.0.0.1:* / http://localhost:*
```

## 官方入口

- 官网：[https://docx-editor.pages.dev/](https://docx-editor.pages.dev/)
- 在线 Demo：[https://docx-editor.pages.dev/examples/demo/](https://docx-editor.pages.dev/examples/demo/)
- 文档：[https://docx-editor.pages.dev/docs/](https://docx-editor.pages.dev/docs/)
- 公测仓库：[https://github.com/flyfish-dev/word-editor](https://github.com/flyfish-dev/word-editor)

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

## 公测约束

- 仅用于免费本地体验和问题反馈。
- 只允许 `localhost` / `127.0.0.1` 访问。
- 不要部署到公网服务器。
- 不包含完整源码，也不授予反编译、破解授权门禁或绕过访问限制的许可。

## 仓库内容

```text
index.html
local-wasm-loader.mjs
serve-localhost.mjs
office-preview-license.json
word-editor-local-wasm-release.json
auth/word-editor-license-runtime.mjs
wasm/office-parser-core.wasm
wasm/word-editor-local-core.wasm
test-fixtures/docx/simple.docx
.github/ISSUE_TEMPLATE/
```

## 状态

当前为公开公测阶段。我们会根据 Issues 中的真实文档样例和问题报告持续更新 WASM 展开版、在线 Demo 和正式产品。
