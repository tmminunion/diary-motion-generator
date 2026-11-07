#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { selectComposition, renderMedia } from "@remotion/renderer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const args = process.argv.slice(2);
  let inputJsonPath = null;
  let outputPath = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" && args[i + 1]) {
      inputJsonPath = args[i + 1];
      i++;
    } else if (args[i] === "--output" && args[i + 1]) {
      outputPath = args[i + 1];
      i++;
    }
  }

  if (!inputJsonPath || !outputPath) {
    console.error("Usage: node render_remotion.mjs --input <project.json> --output <out.mp4>");
    process.exit(1);
  }

  const raw = fs.readFileSync(inputJsonPath, "utf-8");
  const project = JSON.parse(raw);

  let bundleDir = path.resolve(__dirname, "build");
  if (!fs.existsSync(bundleDir)) {
    bundleDir = path.resolve(__dirname, "remotion-bundle");
  }
  if (!fs.existsSync(bundleDir)) {
    console.error(`[Remotion Render ERROR] Bundle directory not found at ${bundleDir} or build/`);
    process.exit(1);
  }

  console.log(`[Remotion Render] Loading bundle from ${bundleDir}...`);
  const composition = await selectComposition({
    serveUrl: bundleDir,
    id: "OlipStudio",
    inputProps: project,
  });

  const durationSec = (composition.durationInFrames / composition.fps).toFixed(1);
  console.log(`[Remotion Render] Composition 'OlipStudio' loaded successfully:`);
  console.log(`  - Dimensions: ${composition.width}x${composition.height}`);
  console.log(`  - FPS: ${composition.fps}`);
  console.log(`  - Total Frames: ${composition.durationInFrames} (~${durationSec}s)`);

  const chromiumArgs = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
  ];

  const browserExecutable =
    process.env.BROWSER_EXECUTABLE ||
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (fs.existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);

  let lastPct = -1;
  const renderOptions = {
    composition,
    serveUrl: bundleDir,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: project,
    imageFormat: "jpeg",
    chromiumOptions: {
      args: chromiumArgs,
      ...(browserExecutable ? { browserExecutable } : {}),
    },
    onProgress: ({ progress }) => {
      const pct = Math.min(100, Math.floor((progress * 100) / 5) * 5);
      if (pct !== lastPct) {
        lastPct = pct;
        console.log(`[Remotion Render] Progress: ${pct}%`);
      }
    },
  };

  const startMs = Date.now();
  console.log(`[Remotion Render] Rendering frames to ${outputPath}...`);
  await renderMedia(renderOptions);

  const elapsed = ((Date.now() - startMs) / 1000).toFixed(1);
  console.log(`[Remotion Render] SUCCESS! Finished in ${elapsed}s: ${outputPath}`);
}

main().catch((err) => {
  console.error("[Remotion Render FATAL]", err);
  process.exit(1);
});
