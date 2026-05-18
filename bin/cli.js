#!/usr/bin/env node

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import * as p from "@clack/prompts";
import { color } from "console-log-colors";

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(dm)} ${sizes[i]}`;
}

async function start() {
  console.clear();
  p.intro(`${color.bgCyan(color.black(" SajjadLabs WebP Optimizer 🚀 "))}`);

  let targetPath = process.argv[2];

  if (!targetPath) {
    const currentItems = fs.readdirSync(".").filter((item) => {
      try {
        return fs.lstatSync(item).isDirectory() && !item.startsWith(".");
      } catch (e) {
        return false;
      }
    });

    targetPath = await p.select({
      message: "Which folder should I scan?",
      options: [
        { value: ".", label: "📍 Current Directory (.)" },
        ...currentItems.map((dir) => ({ value: dir, label: `📂 ${dir}` })),
        { value: "manual", label: "⌨️  Enter path manually" },
      ],
    });

    if (p.isCancel(targetPath)) {
      p.cancel("Operation cancelled. See you later!");
      process.exit(0);
    }

    if (targetPath === "manual") {
      targetPath = await p.text({
        message: "Please enter the exact path:",
        placeholder: "./assets/images",
        validate: (value) => {
          if (value.trim().length === 0) return "Path is required!";
        },
      });

      if (p.isCancel(targetPath)) {
        p.cancel("Operation cancelled. See you later!");
        process.exit(0);
      }
    }
  }

  const mode = await p.select({
    message: "Select your optimization strategy:",
    options: [
      { value: "auto", label: "🏎️  Turbo Mode", hint: "Automatic - Lossless" },
      {
        name: "manual",
        value: "manual",
        label: "🔧 Custom Mode",
        hint: "Manual Settings",
      },
    ],
  });

  if (p.isCancel(mode)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  let options = { quality: 100, lossless: true };

  if (mode === "manual") {
    const qualityChoice = await p.select({
      message: "Select output quality:",
      options: [
        { value: 90, label: "💎 Ultra", hint: "90" },
        { value: 75, label: "⚖️  Balanced", hint: "75" },
        { value: 50, label: "📉 Economic", hint: "50" },
        {
          value: "custom",
          label: "⌨️  Custom Number",
          hint: "Enter a specific value",
        },
      ],
    });

    if (p.isCancel(qualityChoice)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }

    if (qualityChoice === "custom") {
      const customQuality = await p.text({
        message: "Enter exact quality number (1-100):",
        placeholder: "85",
        validate: (value) => {
          const num = Number(value);
          if (isNaN(num)) return "Please enter a valid number! (e.g. 85)";
          if (num < 1 || num > 100) return "Number must be between 1 and 100!";
        },
      });

      if (p.isCancel(customQuality)) {
        p.cancel("Operation cancelled.");
        process.exit(0);
      }
      options.quality = Number(customQuality);
    } else {
      options.quality = qualityChoice;
    }

    options.lossless = await p.confirm({
      message: "Enable Lossless compression?",
      initialValue: true,
    });

    if (p.isCancel(options.lossless)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }
  }

  const s = p.spinner();
  s.start("🔮 SajjadLabs is working its magic...");

  await optimizeImages(targetPath, options, s);
}

async function optimizeImages(inputPath, options, spinner) {
  if (!fs.existsSync(inputPath)) {
    spinner.stop("❌ Path not found.");
    return;
  }

  const absolutePath = path.resolve(inputPath);
  const outputDir = path.join(
    path.dirname(absolutePath),
    path.basename(absolutePath) + "_optimized",
  );

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = await fs.readdirSync(inputPath);
  const imageFiles = files.filter((file) =>
    [".jpg", ".jpeg", ".png", ".tiff", ".tif", ".webp"].includes(
      path.extname(file).toLowerCase(),
    ),
  );

  if (imageFiles.length === 0) {
    spinner.stop("📂 No images found.");
    return;
  }

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let successCount = 0;

  const CONCURRENCY_LIMIT = Math.max(2, os.cpus().length || 4);
  let currentFileIndex = 0;

  async function worker() {
    while (currentFileIndex < imageFiles.length) {
      const index = currentFileIndex++;
      const file = imageFiles[index];
      if (!file) break;

      const inputFilePath = path.join(inputPath, file);
      const outputFilePath = path.join(
        outputDir,
        path.parse(file).name + ".webp",
      );

      try {
        const originalStat = await fs.statSync(inputFilePath);
        const ext = path.extname(file).toLowerCase();

        const transformer = sharp(inputFilePath);

        if ([".png", ".tiff", ".tif", ".webp"].includes(ext)) {
          transformer.ensureAlpha();
        }

        await transformer
          .webp({
            quality: options.quality,
            lossless: options.lossless,
            alphaQuality: 100,
          })
          .toFile(outputFilePath);

        const optimizedStat = fs.statSync(outputFilePath);

        totalOriginalSize += originalStat.size;
        totalOptimizedSize += optimizedStat.size;
        successCount++;
      } catch (err) {
        p.log.error(`Error with ${file}: ${err.message}`);
      }
    }
  }

  const workersCount = Math.min(CONCURRENCY_LIMIT, imageFiles.length);
  const workerPromises = Array.from({ length: workersCount }, worker);

  await Promise.all(workerPromises);

  const savedSpace = totalOriginalSize - totalOptimizedSize;
  const savedPercentage =
    totalOriginalSize > 0
      ? ((savedSpace / totalOriginalSize) * 100).toFixed(1)
      : 0;

  spinner.stop(
    `✨ Successfully processed ${successCount} out of ${imageFiles.length} images!`,
  );

  p.note(
    `📁 Output Folder: ${outputDir}\n` +
      `📉 Size Reduced By: ${savedPercentage}%\n` +
      `💾 Space Saved: ${formatBytes(savedSpace)} (from ${formatBytes(totalOriginalSize)} to ${formatBytes(totalOptimizedSize)})`,
  );

  p.outro(`Mission Accomplished 🎯 Thanks from ${color.cyan("SajjadLabs")}!`);
}

start();
