import { readFile } from "node:fs/promises";
import sharp from "sharp";

for (const file of [
  "public/android-chrome-192x192.png",
  "public/android-chrome-512x512.png",
  "public/apple-touch-icon.png",
]) {
  await sharp(await readFile(file))
    .flatten({ background: "#ffffff" })
    .png()
    .toFile(file);
}

const artwork = await sharp(await readFile("public/logo.png"))
  .resize(286, 286, { fit: "contain", background: "#ffffff" })
  .png()
  .toBuffer();
await sharp({
  create: { width: 512, height: 512, channels: 3, background: "#ffffff" },
})
  .composite([{ input: artwork, gravity: "center" }])
  .png()
  .toFile("public/maskable-512x512.png");
