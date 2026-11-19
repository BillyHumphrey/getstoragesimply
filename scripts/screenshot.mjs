import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const siteDir = path.join(root, "_site");
const outDir = path.join(root, "screenshots");
const port = 4173;
const chrome =
  process.env.CHROME_PATH ||
  "/usr/bin/google-chrome-stable";

function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  return (
    {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".xml": "application/xml; charset=utf-8",
      ".txt": "text/plain; charset=utf-8",
      ".svg": "image/svg+xml",
      ".json": "application/json",
    }[ext] || "application/octet-stream"
  );
}

function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const safe = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const raw = path.join(siteDir, safe);
  if (fs.existsSync(raw) && fs.statSync(raw).isFile()) return raw;
  const index = path.join(raw, "index.html");
  if (fs.existsSync(index)) return index;
  return null;
}

const server = http.createServer((req, res) => {
  const file = resolveFile(req.url === "/" ? "/index.html" : req.url);
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
    return;
  }
  res.writeHead(200, { "Content-Type": contentType(file) });
  fs.createReadStream(file).pipe(res);
});

await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));

fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"],
});

const shots = [
  { path: "/", file: "homepage.png" },
  {
    path: "/guides/climate-controlled-storage-lawrenceville-ga/",
    file: "lawrenceville-climate-controlled.png",
  },
];

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  for (const shot of shots) {
    const url = `http://127.0.0.1:${port}${shot.path}`;
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    const dest = path.join(outDir, shot.file);
    await page.screenshot({ path: dest, fullPage: true, type: "png" });
    const stat = fs.statSync(dest);
    console.log(`Wrote ${dest} (${stat.size} bytes)`);
  }
} finally {
  await browser.close();
  server.close();
}
