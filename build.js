import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');
const assetsSrcDir = path.join(rootDir, 'assets');
const assetsDistDir = path.join(distDir, 'assets');

// Helper to ensure directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Simple CSS minifier
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ')             // Collapse whitespace
    .replace(/\s*([{}|:;,])\s*/g, '$1') // Remove spaces around delimiters
    .trim();
}

// Simple JS minifier (safe for basic script structures)
function minifyJS(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*/g, '')           // Remove inline comments safely
    .replace(/\s+/g, ' ')             // Collapse whitespace
    .trim();
}

// Deep copy folder
function copyFolderSync(from, to) {
  ensureDir(to);
  const items = fs.readdirSync(from);
  for (const item of items) {
    const fromPath = path.join(from, item);
    const toPath = path.join(to, item);
    
    // Skip backup_original
    if (item === 'backup_original') continue;
    
    const stat = fs.statSync(fromPath);
    if (stat.isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      // Exclude heavy unoptimized PNG source assets to keep the production build fast and light
      if (item.endsWith('.png') && stat.size > 100 * 1024 && !item.startsWith('patient_')) {
        continue;
      }
      fs.copyFileSync(fromPath, toPath);
    }
  }
}

function build() {
  console.log("Starting build process (ES Modules)...");
  
  // 1. Ensure dist and dist/assets directories exist
  ensureDir(distDir);
  ensureDir(assetsDistDir);
  
  // 2. Copy assets
  console.log("Copying assets...");
  copyFolderSync(assetsSrcDir, assetsDistDir);
  
  // 3. Process index.html & static files (robots.txt, sitemap.xml)
  console.log("Processing index.html...");
  let html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf8');

  console.log("Copying robots.txt and sitemap.xml to dist/...");
  const robotsSrc = path.join(rootDir, 'robots.txt');
  const sitemapSrc = path.join(rootDir, 'sitemap.xml');
  if (fs.existsSync(robotsSrc)) {
    fs.copyFileSync(robotsSrc, path.join(distDir, 'robots.txt'));
  }
  if (fs.existsSync(sitemapSrc)) {
    fs.copyFileSync(sitemapSrc, path.join(distDir, 'sitemap.xml'));
  }
  
  // 4. Minify CSS
  console.log("Minifying styles.css...");
  const css = fs.readFileSync(path.join(rootDir, 'styles.css'), 'utf8');
  const minifiedCSS = minifyCSS(css);
  fs.writeFileSync(path.join(distDir, 'styles.css'), minifiedCSS, 'utf8');
  
  // 5. Minify JS
  console.log("Minifying script.js...");
  const js = fs.readFileSync(path.join(rootDir, 'script.js'), 'utf8');
  const minifiedJS = minifyJS(js);
  fs.writeFileSync(path.join(distDir, 'script.js'), minifiedJS, 'utf8');
  
  console.log("Build completed successfully!");
}

build();
