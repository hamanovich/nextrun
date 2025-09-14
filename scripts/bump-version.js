#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");

// Get the version type from command line argument
let versionType = process.argv[2];

// Remove -- prefix if present
if (versionType && versionType.startsWith("--")) {
  versionType = versionType.substring(2);
}

if (!versionType || !["patch", "minor", "major"].includes(versionType)) {
  console.error("Usage: bun run version <patch|minor|major>");
  console.error("Examples:");
  console.error("  bun run version --patch");
  console.error("  bun run version --minor");
  console.error("  bun run version --major");
  process.exit(1);
}

// Read package.json
const packagePath = path.join(__dirname, "..", "package.json");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

// Parse current version
const currentVersion = packageJson.version;
const [majorStr, minorStr, patchStr] = currentVersion.split(".");
const major = parseInt(majorStr, 10);
const minor = parseInt(minorStr, 10);
const patch = parseInt((patchStr ?? "").split("-")[0], 10);
if ([major, minor, patch].some(Number.isNaN)) {
  console.error(
    `Invalid semver in package.json: "${currentVersion}". Expected x.y.z (optionally with pre-release).`,
  );
  process.exit(1);
}

let newVersion;
switch (versionType) {
  case "major":
    newVersion = `${major + 1}.0.0`;
    break;
  case "minor":
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case "patch":
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

// Update package.json
packageJson.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + "\n");

console.log(`✅ Version bumped from ${currentVersion} to ${newVersion}`);
console.log(`📦 Updated package.json`);
