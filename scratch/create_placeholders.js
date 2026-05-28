import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1x1 transparent PNG base64
const transparentPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const buffer = Buffer.from(transparentPngBase64, 'base64');

const publicDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const filenames = ['mascot_page1.png', 'mascot_page2.png', 'mascot_page3.png'];

filenames.forEach(filename => {
  const filePath = path.join(publicDir, filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`Successfully created placeholder: ${filePath}`);
});

console.log('All placeholder PNGs created successfully!');
