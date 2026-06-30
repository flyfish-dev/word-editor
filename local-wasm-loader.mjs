const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const editor = document.querySelector("#editor");
const toast = document.querySelector("#toast");
const messages = {
  en: {
    documentTitle: "Flyfish Word Editor local WASM preview",
    titlebar: "Flyfish Word Editor local WASM preview",
    tabHome: "Home",
    tabInsert: "Insert",
    tabLayout: "Layout",
    tabReview: "Review",
    tabView: "View",
    bootTitle: "Preparing Flyfish Word Editor",
    bootSubtitle: "The editor core is loaded from the sealed local WASM public beta.",
    languageSwitchLabel: "Language switch",
    languageChanged: "Language switched to English.",
    ready: "Flyfish Word Editor local WASM runtime is ready.",
    failed: "Flyfish Word Editor local WASM failed: {message}",
    localOnly: "Local WASM preview only runs on http://localhost or http://127.0.0.1.",
    missingExports: "Local WASM core is missing required exports.",
    denied: "Local WASM core denied this runtime: {result}",
    invalidPayload: "Local WASM core returned an invalid payload.",
    fetchUnavailable: "{url} unavailable: {status} {statusText}",
    sameOriginDocx: "Only same-origin DOCX files are allowed.",
    sampleUnavailable: "Sample DOCX unavailable: HTTP {status}",
  },
  "zh-CN": {
    documentTitle: "Flyfish Word Editor 本地 WASM 预览",
    titlebar: "Flyfish Word Editor 本地 WASM 预览",
    tabHome: "开始",
    tabInsert: "插入",
    tabLayout: "布局",
    tabReview: "审阅",
    tabView: "视图",
    bootTitle: "正在准备 Flyfish Word Editor",
    bootSubtitle: "编辑器核心正从本地 sealed WASM 公测版加载。",
    languageSwitchLabel: "语言切换",
    languageChanged: "已切换为中文。",
    ready: "Flyfish Word Editor 本地 WASM runtime 已就绪。",
    failed: "Flyfish Word Editor 本地 WASM 加载失败：{message}",
    localOnly: "本地 WASM 预览只允许在 http://localhost 或 http://127.0.0.1 运行。",
    missingExports: "本地 WASM core 缺少必要导出。",
    denied: "本地 WASM core 拒绝当前运行环境：{result}",
    invalidPayload: "本地 WASM core 返回了无效 payload。",
    fetchUnavailable: "{url} 不可用：{status} {statusText}",
    sameOriginDocx: "只允许加载同源 DOCX 文件。",
    sampleUnavailable: "样例 DOCX 不可用：HTTP {status}",
  },
};
let currentLang = resolveInitialLanguage();
let toastTimer;

function normalizeLanguage(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized.startsWith("zh")) return "zh-CN";
  if (normalized.startsWith("en")) return "en";
  return "";
}

function resolveInitialLanguage() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = normalizeLanguage(params.get("lang"));
  if (fromUrl) return fromUrl;
  let stored = "";
  try {
    stored = normalizeLanguage(localStorage.getItem("flyfish-word-editor-language"));
  } catch {}
  return stored || normalizeLanguage(navigator.language) || "en";
}

function t(key, values = {}) {
  const template = messages[currentLang]?.[key] || messages.en[key] || key;
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name) => String(values[name] ?? ""));
}

function applyLanguage({ persist = false, syncUrl = false } = {}) {
  document.documentElement.lang = currentLang;
  document.title = t("documentTitle");
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelector("[data-language-switch]")?.setAttribute("aria-label", t("languageSwitchLabel"));
  document.querySelectorAll("[data-lang-option]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.langOption === currentLang));
  });
  if (persist) {
    try {
      localStorage.setItem("flyfish-word-editor-language", currentLang);
    } catch {}
  }
  if (syncUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", currentLang);
    window.history.replaceState(null, "", url);
  }
}

document.querySelectorAll("[data-lang-option]").forEach((button) => {
  button.addEventListener("click", () => {
    const nextLang = normalizeLanguage(button.dataset.langOption);
    if (!nextLang || nextLang === currentLang) return;
    currentLang = nextLang;
    applyLanguage({ persist: true, syncUrl: true });
    show(t("languageChanged"));
  });
});

function show(message, options = {}) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  if (!options.sticky) toastTimer = setTimeout(() => { toast.hidden = true; }, 3600);
}

function localOrigin() {
  const { protocol, hostname } = window.location;
  return protocol === "http:" && (hostname === "localhost" || hostname === "127.0.0.1");
}

function failClosed(message) {
  show(message, { sticky: true });
  if (editor) editor.setAttribute("data-license-error", "local-wasm-verify-denied");
  throw new Error(message);
}

async function loadSealedCore() {
  if (!localOrigin()) failClosed(t("localOnly"));

  await import("/auth/word-editor-license-runtime.mjs");
  await window.__WORD_EDITOR_LICENSE_READY__;

  const bytes = await fetchBytes("/wasm/word-editor-local-core.wasm");
  const instantiated = await WebAssembly.instantiate(bytes, {});
  const instance = instantiated instanceof WebAssembly.Instance ? instantiated : instantiated.instance;
  const api = instance.exports;
  if (typeof api.alloc !== "function" || typeof api.unseal !== "function" || typeof api.result_ptr !== "function" || typeof api.result_len !== "function" || !api.memory) {
    failClosed(t("missingExports"));
  }

  const originBytes = textEncoder.encode(window.location.origin);
  const ptr = Number(api.alloc(originBytes.byteLength));
  new Uint8Array(api.memory.buffer, ptr, originBytes.byteLength).set(originBytes);
  const ok = Number(api.unseal(originBytes.byteLength));
  const resultPtr = Number(api.result_ptr());
  const resultLen = Number(api.result_len());
  const result = textDecoder.decode(new Uint8Array(api.memory.buffer, resultPtr, resultLen).slice());
  if (!ok) failClosed(t("denied", { result }));

  const payload = JSON.parse(result);
  if (payload?.format !== "word-editor-local-wasm-payload-v1" || !payload.assets?.main || !payload.assets?.worker) {
    failClosed(t("invalidPayload"));
  }
  return payload.assets;
}

async function fetchBytes(url) {
  const response = await fetch(url, { cache: "no-store", credentials: "same-origin" });
  if (!response.ok) throw new Error(t("fetchUnavailable", { url, status: response.status, statusText: response.statusText }));
  return response.arrayBuffer();
}

function moduleBlobUrl(source, label) {
  return URL.createObjectURL(new Blob([source], { type: "text/javascript", endings: "transparent" }));
}

function resolveDocxSource() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("docx") || "/test-fixtures/docx/simple.docx";
  const url = new URL(requested, window.location.href);
  if (url.origin !== window.location.origin) throw new Error(t("sameOriginDocx"));
  const fallbackName = url.pathname.split("/").filter(Boolean).at(-1) || "document.docx";
  return { url: url.href, name: params.get("name") || fallbackName };
}

async function loadSampleDocument() {
  const { url, name } = resolveDocxSource();
  const response = await fetch(url, { cache: "no-store", credentials: "same-origin" });
  if (!response.ok) throw new Error(t("sampleUnavailable", { status: response.status }));
  await editor.load(await response.blob(), name);
}

applyLanguage();

try {
  const assets = await loadSealedCore();
  const workerUrl = moduleBlobUrl(assets.worker, "word-editor-docx-worker");
  Object.defineProperty(globalThis, "__WORD_EDITOR_DOCX_WORKER_URL__", {
    value: workerUrl,
    configurable: false,
    enumerable: false,
    writable: false,
  });
  const mainUrl = moduleBlobUrl(assets.main, "word-editor-main");
  await import(mainUrl);
  await customElements.whenDefined("word-editor");
  await loadSampleDocument();
  show(t("ready"));
} catch (error) {
  show(t("failed", { message: error?.message || error }), { sticky: true });
  throw error;
}
