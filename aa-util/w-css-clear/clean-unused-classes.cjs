#!/usr/bin/env node
/* eslint-disable no-console */

// 1.清理组件class类在页面没有对应的style样式
// 2.清理同一个class类有相同的名字的类，保留一个

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry');
const printDiff = !args.includes('--no-diff');
const targetArg = args.find((arg) => !arg.startsWith('--'));
const defaultTarget = 'src/App.vue';

function findRepoRoot(startDir) {
  let current = startDir;
  while (current && current !== path.parse(current).root) {
    if (fs.existsSync(path.join(current, 'package.json')) || fs.existsSync(path.join(current, '.git'))) {
      return current;
    }
    current = path.dirname(current);
  }
  return null;
}

function resolveTargetPath() {
  if (targetArg) {
    return path.resolve(process.cwd(), targetArg);
  }
  const cwdRoot = findRepoRoot(process.cwd());
  if (cwdRoot) {
    const candidate = path.resolve(cwdRoot, defaultTarget);
    if (fs.existsSync(candidate)) return candidate;
  }
  const scriptRoot = findRepoRoot(__dirname);
  if (scriptRoot) {
    const candidate = path.resolve(scriptRoot, defaultTarget);
    if (fs.existsSync(candidate)) return candidate;
  }
  return path.resolve(process.cwd(), defaultTarget);
}

const targetPath = resolveTargetPath();

if (!fs.existsSync(targetPath)) {
  console.error(`File not found: ${targetPath}`);
  process.exit(1);
}

const source = fs.readFileSync(targetPath, 'utf8');

function findTemplateBlock(content) {
  let inComment = false;
  let depth = 0;
  let innerStart = -1;

  for (let i = 0; i < content.length; i += 1) {
    if (!inComment && content.startsWith('<!--', i)) {
      inComment = true;
      i += 3;
      continue;
    }
    if (inComment && content.startsWith('-->', i)) {
      inComment = false;
      i += 2;
      continue;
    }
    if (inComment) continue;

    if (content.startsWith('<template', i)) {
      const startTagEnd = content.indexOf('>', i);
      if (startTagEnd === -1) return null;
      if (depth === 0) {
        innerStart = startTagEnd + 1;
      }
      depth += 1;
      i = startTagEnd;
      continue;
    }

    if (content.startsWith('</template>', i)) {
      depth -= 1;
      if (depth === 0 && innerStart !== -1) {
        return { start: innerStart, end: i };
      }
      i += '</template>'.length - 1;
    }
  }

  return null;
}

function extractBlocks(content, tagName) {
  const blocks = [];
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

const templateLoc = findTemplateBlock(source);
if (!templateLoc) {
  console.error('Template block not found.');
  process.exit(1);
}

const template = source.slice(templateLoc.start, templateLoc.end);
const scriptText = extractBlocks(source, 'script').join('\n');
const styleText = extractBlocks(source, 'style').join('\n');

const usedClasses = new Set();
const usedIds = new Set();

for (const match of styleText.matchAll(/\.([A-Za-z0-9_-]+)/g)) {
  usedClasses.add(match[1]);
}
for (const match of styleText.matchAll(/#([A-Za-z0-9_-]+)/g)) {
  usedIds.add(match[1]);
}

const isUsedClass = (name) =>
  usedClasses.has(name) || styleText.includes(`.${name}`) || scriptText.includes(name);
const isUsedId = (name) =>
  usedIds.has(name) || styleText.includes(`#${name}`) || scriptText.includes(name);

const removedClassCounts = new Map();
const removedIds = new Set();
const removedAttrCounts = new Map();

function recordRemovedClass(className) {
  removedClassCounts.set(className, (removedClassCounts.get(className) || 0) + 1);
}

function recordRemovedAttr(attrName) {
  removedAttrCounts.set(attrName, (removedAttrCounts.get(attrName) || 0) + 1);
}

function shouldKeepAttr(name) {
  if (!name) return false;
  const lower = name.toLowerCase();
  if (lower.startsWith('v-') || name.startsWith(':') || lower.startsWith('@') || lower.startsWith('#')) {
    return true;
  }
  const htmlAttrs = ['class', 'id', 'style', 'src', 'iconclass', 'type', 'href', 'placeholder', 'width', 'height'];
  const svgAttrs = ['fill', 'opacity', 'viewbox', 'd', 'transform', 'xlink:href'];
  return htmlAttrs.includes(lower) || svgAttrs.includes(lower);
}

function findTagEnd(content, startIdx) {
  let i = startIdx;
  let quote = null;
  while (i < content.length) {
    const ch = content[i];
    if (quote) {
      if (ch === quote) {
        quote = null;
      }
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      i += 1;
      continue;
    }
    if (ch === '>') {
      return i;
    }
    i += 1;
  }
  return -1;
}

function filterTagAttributes(tagStr) {
  if (!tagStr || tagStr.length < 2) return tagStr;
  const content = tagStr.slice(1, -1);
  const len = content.length;
  let i = 0;
  while (i < len && !/\s|\/|>/.test(content[i])) {
    i += 1;
  }
  const tagNameEnd = i;
  if (tagNameEnd === len) {
    return tagStr;
  }

  const attrs = [];
  let removed = false;
  let keptCount = 0;

  while (i < len) {
    let wsStart = i;
    while (i < len && /\s/.test(content[i])) {
      i += 1;
    }
    if (i >= len) {
      break;
    }
    if (content[i] === '/') {
      break;
    }

    const nameStart = i;
    while (i < len && !/\s|=|\/|>/.test(content[i])) {
      i += 1;
    }
    const nameEnd = i;
    const name = content.slice(nameStart, nameEnd);
    if (!name) {
      i += 1;
      continue;
    }

    while (i < len && /\s/.test(content[i])) {
      i += 1;
    }
    if (content[i] === '=') {
      i += 1;
      while (i < len && /\s/.test(content[i])) {
        i += 1;
      }
      if (content[i] === '"' || content[i] === "'") {
        const quote = content[i];
        i += 1;
        while (i < len) {
          if (content[i] === quote) {
            i += 1;
            break;
          }
          i += 1;
        }
      } else {
        while (i < len && !/\s|\/|>/.test(content[i])) {
          i += 1;
        }
      }
    }

    const attrEnd = i;
    const keep = shouldKeepAttr(name);
    if (!keep) {
      removed = true;
      recordRemovedAttr(name);
    } else {
      keptCount += 1;
    }
    attrs.push({ start: wsStart, end: attrEnd, keep });
  }

  if (!removed) {
    return tagStr;
  }

  let rebuilt = `<${content.slice(0, tagNameEnd)}`;
  for (const attr of attrs) {
    if (attr.keep) {
      rebuilt += content.slice(attr.start, attr.end);
    }
  }
  let trailing = content.slice(i);
  if (keptCount === 0 && !trailing.includes('/') && /^\s*$/.test(trailing)) {
    trailing = '';
  }
  rebuilt += `${trailing}>`;
  return rebuilt;
}

function stripDisallowedAttributes(content) {
  let result = '';
  let i = 0;
  while (i < content.length) {
    const lt = content.indexOf('<', i);
    if (lt === -1) {
      result += content.slice(i);
      break;
    }
    result += content.slice(i, lt);

    if (content.startsWith('<!--', lt)) {
      const end = content.indexOf('-->', lt + 4);
      if (end === -1) {
        result += content.slice(lt);
        break;
      }
      result += content.slice(lt, end + 3);
      i = end + 3;
      continue;
    }

    if (content.startsWith('</', lt) || content[lt + 1] === '!' || content[lt + 1] === '?') {
      const end = findTagEnd(content, lt + 2);
      if (end === -1) {
        result += content.slice(lt);
        break;
      }
      result += content.slice(lt, end + 1);
      i = end + 1;
      continue;
    }

    const end = findTagEnd(content, lt + 1);
    if (end === -1) {
      result += content.slice(lt);
      break;
    }
    const tagStr = content.slice(lt, end + 1);
    result += filterTagAttributes(tagStr);
    i = end + 1;
  }
  return result;
}

function cleanClassValue(value) {
  if (/[{}]/.test(value)) {
    return { value, removed: [], changed: false, skipped: true };
  }
  const tokens = value.split(/\s+/).filter(Boolean);
  const kept = [];
  const removed = [];
  const seen = new Set();
  for (const token of tokens) {
    if (seen.has(token)) {
      removed.push(token);
      continue;
    }
    seen.add(token);
    if (isUsedClass(token)) {
      kept.push(token);
    } else {
      removed.push(token);
    }
  }
  return { value: kept.join(' '), removed, changed: removed.length > 0, skipped: false };
}

const classAttrRegex = /(\s|^)class\s*=\s*(["'])([^"']*)\2/g;
const idAttrRegex = /(\s|^)id\s*=\s*(["'])([^"']*)\2/g;

let updatedTemplate = template.replace(classAttrRegex, (match, prefix, quote, value) => {
  const result = cleanClassValue(value);
  if (result.skipped || !result.changed) {
    return match;
  }
  result.removed.forEach(recordRemovedClass);
  if (!result.value) {
    return '';
  }
  return `${prefix}class=${quote}${result.value}${quote}`;
});

updatedTemplate = updatedTemplate.replace(idAttrRegex, (match, prefix, quote, value) => {
  if (/[{}]/.test(value)) {
    return match;
  }
  if (isUsedId(value)) {
    return match;
  }
  removedIds.add(value);
  return '';
});

updatedTemplate = stripDisallowedAttributes(updatedTemplate);

const removedClasses = Array.from(removedClassCounts.entries()).sort((a, b) => b[1] - a[1]);
const removedIdsList = Array.from(removedIds.values());
const removedAttrsList = Array.from(removedAttrCounts.entries()).sort((a, b) => b[1] - a[1]);

if (removedClasses.length === 0 && removedIdsList.length === 0 && removedAttrsList.length === 0) {
  console.log('No unused classes, ids, or attributes found.');
  process.exit(0);
}

const updatedSource =
  source.slice(0, templateLoc.start) + updatedTemplate + source.slice(templateLoc.end);

if (printDiff) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'clean-unused-classes-'));
  const tmpPath = path.join(tmpDir, path.basename(targetPath));
  fs.writeFileSync(tmpPath, updatedSource, 'utf8');
  const diff = spawnSync(
    'git',
    ['diff', '--no-index', '--', targetPath, tmpPath],
    { encoding: 'utf8' }
  );
  if (diff.stdout && diff.stdout.trim()) {
    console.log(diff.stdout.trimEnd());
  } else if (diff.stderr && diff.stderr.trim()) {
    console.log(`Diff error: ${diff.stderr.trim()}`);
  } else {
    console.log('Diff unavailable.');
  }
}

if (isDryRun) {
  console.log('Dry run: no files were modified.');
} else {
  fs.writeFileSync(targetPath, updatedSource, 'utf8');
  console.log(`Updated: ${targetPath}`);
}

if (removedClasses.length) {
  console.log('Removed classes:');
  for (const [name, count] of removedClasses) {
    console.log(`- ${name} (x${count})`);
  }
}

if (removedIdsList.length) {
  console.log('Removed ids:');
  for (const name of removedIdsList) {
    console.log(`- ${name}`);
  }
}

if (removedAttrsList.length) {
  console.log('Removed attributes:');
  for (const [name, count] of removedAttrsList) {
    console.log(`- ${name} (x${count})`);
  }
}
