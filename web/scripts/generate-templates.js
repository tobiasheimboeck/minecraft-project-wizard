/**
 * Generates templates from the template folder.
 * Run with: node scripts/generate-templates.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateDir = path.join(__dirname, '../../template');
const outputPath = path.join(__dirname, '../src/lib/templates.ts');

const pathMappings = {
  single: { 'api-module': null, 'plugin-module': null },
  multi: { 'api-module': '{{API_MODULE}}', 'plugin-module': '{{PLUGIN_MODULE}}' },
};

const EXCLUDE_DIRS = ['.gradle', 'build', 'node_modules'];

function walkDir(dir, basePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const result = {};
  for (const entry of entries) {
    if (entry.isDirectory() && EXCLUDE_DIRS.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    const relPath = basePath ? `${basePath}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      Object.assign(result, walkDir(fullPath, relPath));
    } else {
      const normalizedPath = relPath.replace(/\\/g, '/');
      if (entry.name.endsWith('.jar')) {
        const buffer = fs.readFileSync(fullPath);
        result[normalizedPath] = '__BINARY_BASE64__' + buffer.toString('base64');
      } else {
        let content = fs.readFileSync(fullPath, 'utf-8');
        content = content.replace(/\r\n/g, '\n');
        result[normalizedPath] = content;
      }
    }
  }
  return result;
}

function collectTemplates(type) {
  const dir = path.join(templateDir, type);
  const raw = walkDir(dir);
  const result = {};
  for (const [filePath, content] of Object.entries(raw)) {
    let outputPath = filePath.replace(/\\/g, '/');
    const mapping = pathMappings[type];
    if (mapping) {
      for (const [from, to] of Object.entries(mapping)) {
        if (to && outputPath.startsWith(from + '/')) {
          outputPath = to + outputPath.slice(from.length);
          break;
        }
      }
    }
    result[outputPath] = content;
  }
  return result;
}

const singleTemplates = collectTemplates('single');
const multiTemplates = collectTemplates('multi');

const output = `/**
 * Auto-generated template files. Run: npm run generate-templates
 */
export const singleTemplates: Record<string, string> = ${JSON.stringify(singleTemplates, null, 2)};

export const multiTemplates: Record<string, string> = ${JSON.stringify(multiTemplates, null, 2)};
`;

fs.writeFileSync(outputPath, output, 'utf-8');
console.log('Generated templates.ts');
