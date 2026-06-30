const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const editor = document.querySelector("#editor");
const toast = document.querySelector("#toast");
let toastTimer;

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
  if (!localOrigin()) failClosed("Local WASM verification only runs on http://localhost or http://127.0.0.1.");

  await import("/auth/word-editor-license-runtime.mjs");
  await window.__WORD_EDITOR_LICENSE_READY__;

  const bytes = await fetchBytes("/wasm/word-editor-local-core.wasm");
  const instantiated = await WebAssembly.instantiate(bytes, {});
  const instance = instantiated instanceof WebAssembly.Instance ? instantiated : instantiated.instance;
  const api = instance.exports;
  if (typeof api.alloc !== "function" || typeof api.unseal !== "function" || typeof api.result_ptr !== "function" || typeof api.result_len !== "function" || !api.memory) {
    failClosed("Local WASM core is missing required exports.");
  }

  const originBytes = textEncoder.encode(window.location.origin);
  const ptr = Number(api.alloc(originBytes.byteLength));
  new Uint8Array(api.memory.buffer, ptr, originBytes.byteLength).set(originBytes);
  const ok = Number(api.unseal(originBytes.byteLength));
  const resultPtr = Number(api.result_ptr());
  const resultLen = Number(api.result_len());
  const result = textDecoder.decode(new Uint8Array(api.memory.buffer, resultPtr, resultLen).slice());
  if (!ok) failClosed(`Local WASM core denied this runtime: ${result}`);

  const payload = JSON.parse(result);
  if (payload?.format !== "word-editor-local-wasm-payload-v1" || !payload.assets?.main || !payload.assets?.worker) {
    failClosed("Local WASM core returned an invalid payload.");
  }
  return payload.assets;
}

async function fetchBytes(url) {
  const response = await fetch(url, { cache: "no-store", credentials: "same-origin" });
  if (!response.ok) throw new Error(`${url} unavailable: ${response.status} ${response.statusText}`);
  return response.arrayBuffer();
}

function moduleBlobUrl(source, label) {
  return URL.createObjectURL(new Blob([source], { type: "text/javascript", endings: "transparent" }));
}

function resolveDocxSource() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("docx") || "/test-fixtures/docx/simple.docx";
  const url = new URL(requested, window.location.href);
  if (url.origin !== window.location.origin) throw new Error("Only same-origin DOCX files are allowed.");
  const fallbackName = url.pathname.split("/").filter(Boolean).at(-1) || "document.docx";
  return { url: url.href, name: params.get("name") || fallbackName };
}

async function loadSampleDocument() {
  const { url, name } = resolveDocxSource();
  const response = await fetch(url, { cache: "no-store", credentials: "same-origin" });
  if (!response.ok) throw new Error(`Sample DOCX unavailable: HTTP ${response.status}`);
  await editor.load(await response.blob(), name);
}

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
  show("Local WASM verification runtime is ready.");
} catch (error) {
  show(`Local WASM verification failed: ${error?.message || error}`, { sticky: true });
  throw error;
}
