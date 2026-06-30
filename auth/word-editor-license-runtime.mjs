const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();
const WORD_EDITOR_GATE_KEY = Symbol.for('flyfish.wordEditor.licenseGate.v1');
const WORD_EDITOR_TOKEN_KEY = Symbol.for('flyfish.wordEditor.licenseToken.v1');
const WORD_EDITOR_GATE_NAME = '__WORD_EDITOR_LICENSE_GATE__';
const WORD_EDITOR_TOKEN_NAME = '__WORD_EDITOR_LICENSE_TOKEN__';
const WORD_EDITOR_REQUIRE_NAME = '__WORD_EDITOR_LICENSE_REQUIRED__';
const DEFAULT_LICENSE_URL = '/office-preview-license.json';
const DEFAULT_WASM_URL = '/wasm/office-parser-core.wasm';
const DEFAULT_FEATURE = 'docx';

globalThis[WORD_EDITOR_REQUIRE_NAME] = true;
globalThis.__WORD_EDITOR_LICENSE_READY__ = installWordEditorLicenseGate();

export async function installWordEditorLicenseGate(options = {}) {
  const license = await loadLicenseDocument(options.licenseUrl || DEFAULT_LICENSE_URL);
  const authorization = await authorizeWithWasm({
    wasmUrl: options.wasmUrl || DEFAULT_WASM_URL,
    license,
    origin: normalizeOrigin(options.origin || resolveCurrentOrigin()),
  });
  const token = Object.freeze({
    [WORD_EDITOR_TOKEN_KEY]: true,
    issuedAt: Date.now(),
    licenseId: String(authorization.access?.license?.id || ''),
  });
  const gate = Object.freeze({
    version: 'sealed-license-v2-wasm-gate',
    access: authorization.access,
    assert(feature, providedToken) {
      const normalized = normalizeFeature(feature);
      if (providedToken !== token || !normalized) {
        throw licenseError('word-editor-license-required', 'word-editor license token is required.');
      }
      const result = authorization.assertFeature(normalized);
      if (!result?.ok) {
        throw licenseError(result?.error?.code || 'word-editor-license-required', result?.error?.message || 'word-editor license gate rejected this feature.');
      }
      return true;
    },
  });
  defineStableGate(WORD_EDITOR_GATE_KEY, gate);
  defineStableGate(WORD_EDITOR_GATE_NAME, gate);
  defineStableGate(WORD_EDITOR_TOKEN_KEY, token);
  defineStableGate(WORD_EDITOR_TOKEN_NAME, token);
  return { ok: true, origin: authorization.origin, access: authorization.access };
}

async function authorizeWithWasm({ wasmUrl, license, origin }) {
  const bytes = await loadBytes(wasmUrl);
  const instantiated = await WebAssembly.instantiate(bytes, {
    env: {
      abort(_message, _file, line, column) {
        throw new Error(`AssemblyScript abort at ${line}:${column}`);
      },
    },
  });
  const instance = instantiated instanceof WebAssembly.Instance ? instantiated : instantiated.instance;
  const api = instance.exports;
  if (typeof api.authorizeLicense !== 'function' || typeof api.assertFeature !== 'function') {
    throw licenseError('wasm-license-gate-missing', 'WASM core missing sealed license gate exports.');
  }

  function callWithBytes(fnName, bytes) {
    const ptr = Number(api.alloc(bytes.byteLength));
    new Uint8Array(api.memory.buffer, ptr, bytes.byteLength).set(bytes);
    api[fnName](bytes.byteLength);
    return readResult();
  }
  function callWithText(fnName, text) {
    return callWithBytes(fnName, textEncoder.encode(text));
  }
  function readResult() {
    const resultPtr = Number(api.resultPtr());
    const resultLen = Number(api.resultLen());
    const result = new Uint8Array(api.memory.buffer, resultPtr, resultLen);
    return JSON.parse(textDecoder.decode(result.slice()));
  }

  const authorization = callWithText('authorizeLicense', JSON.stringify({
    origin,
    now: new Date().toISOString(),
    licenseBlob: String(license?.license || ''),
    licenseSeal: String(license?.seal?.value || ''),
    licenseAlg: String(license?.seal?.alg || ''),
    licenseKid: String(license?.seal?.kid || ''),
  }));
  if (!authorization?.ok) {
    throw licenseError(authorization?.error?.code || 'word-editor-license-denied', authorization?.error?.message || 'word-editor license denied.');
  }
  const firstFeatureCheck = callWithText('assertFeature', DEFAULT_FEATURE);
  if (!firstFeatureCheck?.ok) {
    throw licenseError(firstFeatureCheck?.error?.code || 'word-editor-feature-denied', firstFeatureCheck?.error?.message || 'word-editor DOCX feature is not licensed.');
  }
  return {
    ...authorization,
    origin,
    assertFeature(feature) {
      return callWithText('assertFeature', feature);
    },
  };
}

async function loadLicenseDocument(url) {
  const response = await fetch(url, { cache: 'no-store', credentials: 'same-origin' });
  if (!response.ok) throw licenseError('license-file-unavailable', `License file unavailable: ${response.status} ${response.statusText}`);
  return response.json();
}

async function loadBytes(source) {
  const response = await fetch(source, { cache: 'no-store', credentials: 'same-origin' });
  if (!response.ok) throw licenseError('wasm-file-unavailable', `WASM gate unavailable: ${response.status} ${response.statusText}`);
  return response.arrayBuffer();
}

function defineStableGate(key, value) {
  const current = globalThis[key];
  if (current && current !== value) throw licenseError('word-editor-license-conflict', 'word-editor license gate was already installed.');
  Object.defineProperty(globalThis, key, {
    value,
    configurable: false,
    enumerable: false,
    writable: false,
  });
}

function normalizeFeature(feature) {
  return String(feature || '').trim().toLowerCase();
}

function normalizeOrigin(value) {
  return String(value || '').trim().toLowerCase().replace(/\/+$/, '');
}

function resolveCurrentOrigin() {
  const location = globalThis.location;
  if (!location?.protocol || !location?.host) return '';
  return `${location.protocol}//${location.host}`;
}

function licenseError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}
