import sharp from "sharp";
import { readdirSync, statSync, renameSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = "public/images";
const MAX_WIDTH = 2000;

function walk(dir) {
    return readdirSync(dir).flatMap((name) => {
        const p = join(dir, name);
        return statSync(p).isDirectory() ? walk(p) : [p];
    });
}

for (const file of walk(ROOT)) {
    const ext = extname(file).toLowerCase();
    if (ext !== ".jpg" && ext !== ".png") continue;

    const base = file.slice(0, -ext.length);
    const img = sharp(file)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true });

    if (ext === ".jpg") {
        await img.jpeg({ quality: 80, mozjpeg: true }).toFile(base + ".tmp");
        renameSync(base + ".tmp", file);
    } else {
        await img.webp({ quality: 85 }).toFile(base + ".webp");
        unlinkSync(file);
    }
    console.log("ok", file);
}