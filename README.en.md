<p align="center">
  <a href="https://docx-editor.pages.dev/">
    <img src="assets/brand/flyfish-word-editor-logo.svg" width="520" alt="Flyfish Word Editor logo" />
  </a>
</p>

<h1 align="center">Flyfish Word Editor</h1>

<p align="center">
  <strong>A professional browser-based DOCX editor with a localhost-only WASM public beta in this repository.</strong>
</p>

<p align="center">
  <a href="https://docx-editor.pages.dev/">Official Site</a> ·
  <a href="https://docx-editor.pages.dev/examples/demo/">Online Demo</a> ·
  <a href="https://docx-editor.pages.dev/examples/integration/">Integration Demo</a> ·
  <a href="https://docx-editor.pages.dev/docs/">Docs</a> ·
  <a href="https://docx-editor.pages.dev/downloads/word-editor-public-beta.zip">Download Beta</a> ·
  <a href="https://github.com/flyfish-dev/word-editor/issues/new/choose">Feedback & Samples</a> ·
  <a href="https://dev.flyfish.group/shop">Flyfish Shop</a>
</p>

<p align="center">
  <a href="README.md">简体中文</a> · <a href="README.en.md">English</a>
</p>

<p align="center">
  <a href="https://github.com/flyfish-dev/word-editor"><img alt="Public beta" src="https://img.shields.io/badge/public%20beta-expanded%20repo-185abd" /></a>
  <img alt="Runtime" src="https://img.shields.io/badge/runtime-sealed%20WASM-0f766e" />
  <img alt="Access" src="https://img.shields.io/badge/access-localhost%20only-7c3aed" />
  <img alt="Source maps" src="https://img.shields.io/badge/source%20maps-not%20published-b91c1c" />
  <img alt="Core payload" src="https://img.shields.io/badge/core%20payload-sealed-111827" />
  <a href="https://docx-editor.pages.dev/"><img alt="Official site" src="https://img.shields.io/badge/site-docx--editor.pages.dev-1d6fd6" /></a>
  <a href="https://dev.flyfish.group/shop"><img alt="Flyfish shop" src="https://img.shields.io/badge/support-Flyfish%20Shop-f59e0b" /></a>
</p>

---

## Positioning

Flyfish Word Editor is a browser-side DOCX editor built by Flyfish Open Source Workshop for business systems, OA workflows, contracts, knowledge bases, approval systems, and private deployments.

This public repository directly contains the expanded free public beta WASM demo. It is intended for product evaluation and for collecting real document samples, compatibility issues, product suggestions, and purchase inquiries through GitHub Issues.

> This is not the full source repository. The HTML/JS files in this repository are only the local server and loading layer. The core editor runtime is sealed in `wasm/word-editor-local-core.wasm`.

## Quick Start

```bash
git clone https://github.com/flyfish-dev/word-editor.git
cd word-editor
node serve-localhost.mjs
```

Open:

```text
http://127.0.0.1:8789/
```

Current expanded build:

```text
brand: Flyfish Word Editor
buildId: local-wasm-20260717005416
payloadSha256: 41baba0ab494340210da1bba7c2d9f5b83528125a421335caebb0011ece32679
expiresAt: 2026-07-31T00:54:23.000Z
allowedOrigins: http://127.0.0.1:* / http://localhost:*
```

## Official Links

| Entry | URL |
| --- | --- |
| Official Site | [docx-editor.pages.dev](https://docx-editor.pages.dev/) |
| Online Demo | [docx-editor.pages.dev/examples/demo](https://docx-editor.pages.dev/examples/demo/) |
| Integration Demo | [docx-editor.pages.dev/examples/integration](https://docx-editor.pages.dev/examples/integration/) |
| Docs | [docx-editor.pages.dev/docs](https://docx-editor.pages.dev/docs/) |
| Public Beta Repository | [github.com/flyfish-dev/word-editor](https://github.com/flyfish-dev/word-editor) |
| Public Beta Download | [docx-editor.pages.dev/downloads/word-editor-public-beta.zip](https://docx-editor.pages.dev/downloads/word-editor-public-beta.zip) |
| Flyfish Shop | [dev.flyfish.group/shop](https://dev.flyfish.group/shop) |

## Purchase & Partnership

- Purchase inquiry: [open a purchase inquiry issue](https://github.com/flyfish-dev/word-editor/issues/new?template=purchase-intent.yml)
- Purchase link: [Flyfish Shop](https://dev.flyfish.group/shop)
- Product issues and sample feedback: [open an issue](https://github.com/flyfish-dev/word-editor/issues/new/choose)

For purchase inquiries, please include your use case, deployment model, expected user scale, whether you need private/offline licensing, and whether customization or technical support is required.

## Contact & Support

| Support WeChat | Official Account | User Group | WeChat Sponsor | Alipay Support |
| --- | --- | --- | --- | --- |
| <img src="assets/support/contact.jpg" width="150" alt="Flyfish Word Editor support WeChat QR code" /> | <img src="assets/support/wechat-mp.png" width="150" alt="Flyfish Open Source Workshop official account QR code" /> | <img src="assets/support/invite.webp" width="150" alt="Flyfish Word Editor user group QR code" /> | <img src="assets/support/wechat-reward.jpg" width="150" alt="WeChat sponsor QR code" /> | <img src="assets/support/alipay.jpg" width="150" alt="Alipay support QR code" /> |

Recommended support paths:

- Public bugs, compatibility samples, and product suggestions: use [GitHub Issues](https://github.com/flyfish-dev/word-editor/issues/new/choose).
- Commercial licensing, private deployment, OEM, and customization: open a [purchase inquiry](https://github.com/flyfish-dev/word-editor/issues/new?template=purchase-intent.yml) or contact us on WeChat.
- To support ongoing development: use [Flyfish Shop](https://dev.flyfish.group/shop) or the sponsor QR codes above.

## Brand & Badges

Official brand name:

```text
Flyfish Word Editor
Chinese name: 飞鱼 Word Editor
Repository: flyfish-dev/word-editor
```

Brand assets:

| Type | File |
| --- | --- |
| Horizontal Logo | `assets/brand/flyfish-word-editor-logo.svg` |
| Square Mark | `assets/brand/flyfish-word-editor-mark.svg` |
| Public Beta Badge | `assets/brand/flyfish-word-editor-public-beta-badge.svg` |
| Social Preview | `.github/social-preview.svg` |

README badge language:

- `public beta`: expanded public beta repository.
- `runtime`: the core is loaded as a sealed WASM runtime.
- `access`: only `localhost` / `127.0.0.1` is allowed.
- `source maps`: sourcemaps are not published.
- `core payload`: the core payload is sealed.

## Feedback Samples & Issues

We welcome GitHub Issues that help improve the editor:

- Upload DOCX samples that cannot be opened, rendered, or saved correctly.
- Describe the expected result in Microsoft Word, WPS, OnlyOffice, or Word Online.
- Include screenshots, recordings, browser version, operating system, and reproduction steps.
- Mark whether the sample contains private, contractual, customer, or copyrighted content.

Do not upload sensitive files before redaction. If a sample cannot be shared publicly, open an issue first and we will coordinate a safer submission path.

## Public Beta Constraints

- For free local evaluation and feedback only.
- Only `localhost` / `127.0.0.1` access is allowed.
- Do not deploy this public beta to a public server.
- This repository does not include the full source code and does not grant permission to decompile, crack the authorization gate, or bypass access restrictions.

## Repository Contents

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
assets/brand/
assets/support/
.github/ISSUE_TEMPLATE/
```

## Status

This project is currently in public beta. We will keep updating the expanded WASM demo, online demo, and commercial product based on real document samples and issue reports.
