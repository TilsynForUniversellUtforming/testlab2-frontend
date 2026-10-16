import http from 'node:http';
import { existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const isProduction = process.env.NODE_ENV === 'production';
const rootDir = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.join(rootDir, 'dist', 'client');
const serverDist = path.join(rootDir, 'dist', 'server');
const apiBaseUrl = process.env.TESTLAB2_API_BASE ?? 'http://localhost:8080';

globalThis.__TESTLAB2_API_BASE__ = apiBaseUrl;

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

function getContentType(filePath) {
  return mimeTypes.get(path.extname(filePath).toLowerCase()) ?? 'application/octet-stream';
}

function isHtmlRequest(request) {
  const accept = request.headers.accept ?? '';
  return request.method === 'GET' && accept.includes('text/html');
}

function getRequestUrl(request) {
  const host = request.headers.host ?? 'localhost:5173';
  const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
  return new URL(request.url ?? '/', `${protocol}://${host}`);
}

function toHeaders(rawHeaders) {
  const headers = new Headers();

  for (const [key, value] of Object.entries(rawHeaders ?? {})) {
    if (typeof value === 'string') {
      headers.set(key, value);
    } else if (Array.isArray(value)) {
      headers.set(key, value.join(', '));
    }
  }

  return headers;
}

async function loadRenderFunction() {
  if (isProduction) {
    const serverEntry = pathToFileURL(path.join(serverDist, 'entry.server.js')).href;
    return import(serverEntry);
  }

  const { createServer } = await import('vite');
  const vite = await createServer({
    root: rootDir,
    appType: 'custom',
    server: {
      middlewareMode: true,
    },
  });

  return { vite };
}

async function renderHtml(request, renderFn, template) {
  const url = getRequestUrl(request);
  const renderResult = await renderFn(
    new Request(url, { method: 'GET', headers: toHeaders(request.headers) })
  );

  if (renderResult instanceof Response) {
    return renderResult;
  }

  const html = template.replace('<div id="root"></div>', `<div id="root">${renderResult.html}</div>`);
  return new Response(html, {
    status: renderResult.status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}

if (isProduction) {
  const template = await readFile(path.join(clientDist, 'index.html'), 'utf-8');
  const { render } = await loadRenderFunction();

  http
    .createServer(async (req, res) => {
      try {
        const url = getRequestUrl(req);
        const assetPath = path.join(clientDist, decodeURIComponent(url.pathname));

        if (existsSync(assetPath) && statSync(assetPath).isFile()) {
          const asset = await readFile(assetPath);
          res.statusCode = 200;
          res.setHeader('Content-Type', getContentType(assetPath));
          res.end(asset);
          return;
        }

        if (!isHtmlRequest(req)) {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }

        const response = await renderHtml(req, render, template);
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(Buffer.from(await response.arrayBuffer()));
      } catch (error) {
        console.error(error);
        res.statusCode = 500;
        res.end('Internal server error');
      }
    })
    .listen(3000, () => {
      console.log('SSR server listening on http://localhost:3000');
    });
} else {
  const { vite } = await loadRenderFunction();
  const template = await readFile(path.join(rootDir, 'index.html'), 'utf-8');

  http
    .createServer((req, res) => {
      vite.middlewares(req, res, async () => {
        try {
          if (!isHtmlRequest(req)) {
            res.statusCode = 404;
            res.end('Not found');
            return;
          }

          const url = getRequestUrl(req);
          const transformedTemplate = await vite.transformIndexHtml(url.pathname, template);
          const { render } = await vite.ssrLoadModule('/src/entry.server.tsx');
          const response = await renderHtml(req, render, transformedTemplate);

          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          vite.ssrFixStacktrace(error);
          console.error(error);
          res.statusCode = 500;
          res.end('Internal server error');
        }
      });
    })
    .listen(3000, () => {
      console.log('SSR dev server listening on http://localhost:3000');
    });
}


