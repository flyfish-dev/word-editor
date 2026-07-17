#!/usr/bin/env node
import { createServer } from "node:http";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const port = toPort(process.env.PORT || readFlag("--port", "-p"), 8789);
const host = readFlag("--host", "-h") || process.env.HOST || "127.0.0.1";
const allowedHosts = resolveAllowedHosts();

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  [".svg", "image/svg+xml"],
  [".wasm", "application/wasm"],
]);

const securityHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' blob: 'wasm-unsafe-eval'",
    "worker-src 'self' blob:",
    "connect-src 'self'",
    "img-src 'self' data: blob:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data: blob:",
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
  ].join("; "),
};

const server = createServer((req, res) => {
  if (!req.url) return send(res, 400, "Bad Request");
  if (!requestHostAllowed(req)) return send(res, 403, "Forbidden");
  const filePath = resolveRequestPath(req.url);
  if (!filePath) return send(res, 403, "Forbidden");
  if (!existsSync(filePath) || !statSync(filePath).isFile()) return send(res, 404, `Not Found: ${req.url}`);
  const type = mimeTypes.get(extname(filePath).toLowerCase()) || "application/octet-stream";
  res.writeHead(200, { ...securityHeaders, "Content-Type": type });
  createReadStream(filePath).pipe(res);
});

server.listen(port, host, () => {
  console.log(`word-editor sealed WASM package: http://${host}:${port}/`);
  console.log(`Allowed Host headers: ${[...allowedHosts].join(", ")}`);
  console.log("Press Ctrl+C to stop.");
});

function readFlag(name, shortName) {
  const read = (flag) => {
    const equalsIndex = process.argv.findIndex((arg) => arg.startsWith(`${flag}=`));
    if (equalsIndex >= 0) return process.argv[equalsIndex].split("=").slice(1).join("=");
    const index = process.argv.findIndex((arg) => arg === flag);
    if (index >= 0) return process.argv[index + 1];
    return undefined;
  };
  return read(name) ?? (shortName ? read(shortName) : undefined);
}

function toPort(value, fallback) {
  const parsed = Number(value);
  if (Number.isInteger(parsed) && parsed >= 0 && parsed <= 65535) return parsed;
  return fallback;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { ...securityHeaders, ...headers });
  res.end(body);
}

function requestHostAllowed(req) {
  const header = String(req.headers.host || "").trim().toLowerCase();
  const hostName = header.startsWith("[") ? header.slice(1, header.indexOf("]")) : header.split(":")[0];
  return allowedHosts.has(hostName);
}

function resolveAllowedHosts() {
  const hosts = new Set(["localhost", "127.0.0.1"]);
  const envHosts = String(process.env.WORD_EDITOR_PACKAGE_ALLOWED_HOSTS || "")
    .split(/[\n,]+/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  for (const value of envHosts) hosts.add(value);
  const metadataPath = join(root, "word-editor-local-wasm-release.json");
  if (existsSync(metadataPath)) {
    try {
      const metadata = JSON.parse(readFileSync(metadataPath, "utf8"));
      for (const origin of metadata.allowedOrigins || []) {
        const host = originHost(origin);
        if (host) hosts.add(host);
      }
    } catch {}
  }
  return hosts;
}

function originHost(origin) {
  try {
    const normalized = String(origin || "").replace(/:\*$/, "");
    return new URL(normalized).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function resolveRequestPath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0] || "/");
  if (cleanPath === "/") return join(root, "index.html");
  if (cleanPath === "/assets/word-editor-boot-v1.css") {
    const packagedAsset = join(root, "assets/word-editor-boot-v1.css");
    if (existsSync(packagedAsset)) return packagedAsset;
    const workspaceAsset = resolve(root, "../assets/word-editor-boot-v1.css");
    if (existsSync(workspaceAsset)) return workspaceAsset;
  }
  const normalized = normalize(cleanPath).replace(/^([/\\])+/, "");
  const segments = normalized.split(/[\\/]+/).filter(Boolean);
  const lower = normalized.toLowerCase();
  if (lower.endsWith(".ts") || lower.endsWith(".map") || lower.endsWith(".d.ts")) return undefined;
  if (segments[0] === "packages" || segments[0] === "src" || segments[0] === "docs") return undefined;
  const fullPath = resolve(root, normalized);
  if (!fullPath.startsWith(root)) return undefined;
  if (existsSync(fullPath) && statSync(fullPath).isDirectory()) return join(fullPath, "index.html");
  return fullPath;
}
