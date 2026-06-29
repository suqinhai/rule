#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const defaultTargets = ['src/App.vue'];
const rawArgs = process.argv.slice(2);
const options = {
  dryRun: false,
  printDiff: true,
  stripVariantNumber: true,
  collision: 'suffix',
};
const targets = [];

for (const arg of rawArgs) {
  if (arg === '--dry' || arg === '--dry-run') {
    options.dryRun = true;
  } else if (arg === '--no-diff') {
    options.printDiff = false;
  } else if (arg === '--keep-variant-number') {
    options.stripVariantNumber = false;
  } else if (arg === '--strip-variant-number') {
    options.stripVariantNumber = true;
  } else if (arg.startsWith('--collision=')) {
    options.collision = arg.slice('--collision='.length);
  } else if (arg.startsWith('--')) {
    console.error(`Unknown option: ${arg}`);
    process.exit(1);
  } else {
    targets.push(arg);
  }
}

const allowedCollisionModes = new Set(['suffix', 'keep', 'merge']);
if (!allowedCollisionModes.has(options.collision)) {
  console.error(`Invalid --collision mode: ${options.collision}`);
  console.error('Expected one of: suffix, keep, merge');
  process.exit(1);
}

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

const repoRoot = findRepoRoot(process.cwd()) || process.cwd();
const targetArgs = targets.length ? targets : defaultTargets;
const targetPaths = targetArgs.map((target) => path.resolve(repoRoot, target));

for (const targetPath of targetPaths) {
  if (!fs.existsSync(targetPath)) {
    console.error(`File not found: ${targetPath}`);
    process.exit(1);
  }
}

const generatedClassPattern = /^_([A-Za-z][A-Za-z0-9-]*?)_([A-Za-z0-9]+)_([0-9]+)$/;
const generatedClassSelectorPattern =
  /\._([A-Za-z][A-Za-z0-9-]*?)_([A-Za-z0-9]+)_([0-9]+)(?![A-Za-z0-9_-])/g;
const classAttrPattern = /(\bclass\s*=\s*)(["'])([^"']*)\2/g;

function parseGeneratedClass(className) {
  const match = generatedClassPattern.exec(className);
  if (!match) return null;
  const rawLocal = match[1];
  return {
    fullName: className,
    rawLocal,
    local: options.stripVariantNumber ? rawLocal.replace(/-\d+$/, '') : rawLocal,
    hash: match[2],
    line: match[3],
  };
}

function collectClasses(content, generatedClasses, plainClasses) {
  content.replace(classAttrPattern, (_match, _prefix, _quote, value) => {
    for (const token of value.split(/\s+/).filter(Boolean)) {
      const parsed = parseGeneratedClass(token);
      if (parsed) {
        generatedClasses.set(parsed.fullName, parsed);
      } else {
        plainClasses.add(token);
      }
    }
    return _match;
  });

  content.replace(generatedClassSelectorPattern, (_match, local, hash, line) => {
    const fullName = `_${local}_${hash}_${line}`;
    generatedClasses.set(fullName, {
      fullName,
      rawLocal: local,
      local: options.stripVariantNumber ? local.replace(/-\d+$/, '') : local,
      hash,
      line,
    });
    return _match;
  });
}

function makeUniqueName(preferred, usedNames) {
  if (!usedNames.has(preferred)) {
    usedNames.add(preferred);
    return preferred;
  }

  let index = 2;
  while (usedNames.has(`${preferred}-${index}`)) {
    index += 1;
  }
  const unique = `${preferred}-${index}`;
  usedNames.add(unique);
  return unique;
}

function buildClassMap(generatedClasses, plainClasses) {
  const byLocal = new Map();
  for (const parsed of generatedClasses.values()) {
    if (!byLocal.has(parsed.local)) byLocal.set(parsed.local, []);
    byLocal.get(parsed.local).push(parsed);
  }

  const usedNames = new Set(plainClasses);
  const replacements = new Map();
  const collisions = [];

  for (const [local, entries] of byLocal.entries()) {
    const uniqueEntries = Array.from(
      new Map(entries.map((entry) => [entry.fullName, entry])).values()
    ).sort((a, b) => a.fullName.localeCompare(b.fullName));

    const collidesWithPlainClass = plainClasses.has(local);
    const hasGeneratedCollision = uniqueEntries.length > 1;
    const hasCollision = collidesWithPlainClass || hasGeneratedCollision;

    if (hasCollision) {
      collisions.push({
        local,
        plain: collidesWithPlainClass,
        generated: uniqueEntries.map((entry) => entry.fullName),
      });
    }

    for (const entry of uniqueEntries) {
      let replacement;
      if (!hasCollision) {
        replacement = makeUniqueName(local, usedNames);
      } else if (options.collision === 'keep') {
        replacement = entry.fullName;
        usedNames.add(replacement);
      } else if (options.collision === 'merge') {
        replacement = local;
        usedNames.add(replacement);
      } else {
        const withHash = `${local}-${entry.hash}`;
        const preferred = usedNames.has(withHash) ? `${withHash}-${entry.line}` : withHash;
        replacement = makeUniqueName(preferred, usedNames);
      }
      replacements.set(entry.fullName, replacement);
    }
  }

  return { replacements, collisions };
}

function replaceClassAttributes(content, replacements) {
  return content.replace(classAttrPattern, (match, prefix, quote, value) => {
    const tokens = value.split(/\s+/).filter(Boolean);
    if (!tokens.length) return match;

    let changed = false;
    const nextTokens = [];
    const seen = new Set();

    for (const token of tokens) {
      const replacement = replacements.get(token) || token;
      changed = changed || replacement !== token;
      if (seen.has(replacement)) {
        changed = true;
        continue;
      }
      seen.add(replacement);
      nextTokens.push(replacement);
    }

    if (!changed) return match;
    return `${prefix}${quote}${nextTokens.join(' ')}${quote}`;
  });
}

function replaceCssClassSelectors(content, replacements) {
  return content.replace(
    generatedClassSelectorPattern,
    (match, local, hash, line) => {
      const fullName = `_${local}_${hash}_${line}`;
      return `.${replacements.get(fullName) || fullName}`;
    }
  );
}

function printFileDiff(originalPath, updatedContent) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'clean-css-module-classnames-'));
  const tmpPath = path.join(tmpDir, path.basename(originalPath));
  fs.writeFileSync(tmpPath, updatedContent, 'utf8');
  const diff = spawnSync('git', ['diff', '--no-index', '--', originalPath, tmpPath], {
    encoding: 'utf8',
  });

  if (diff.stdout && diff.stdout.trim()) {
    console.log(diff.stdout.trimEnd());
  } else if (diff.stderr && diff.stderr.trim() && diff.status !== 1) {
    console.log(`Diff error: ${diff.stderr.trim()}`);
  }

  fs.rmSync(tmpDir, { recursive: true, force: true });
}

const files = targetPaths.map((targetPath) => ({
  path: targetPath,
  content: fs.readFileSync(targetPath, 'utf8'),
}));

const generatedClasses = new Map();
const plainClasses = new Set();

for (const file of files) {
  collectClasses(file.content, generatedClasses, plainClasses);
}

if (generatedClasses.size === 0) {
  console.log('No generated CSS module class names found.');
  process.exit(0);
}

const { replacements, collisions } = buildClassMap(generatedClasses, plainClasses);
const changedEntries = Array.from(replacements.entries()).filter(([from, to]) => from !== to);

if (changedEntries.length === 0) {
  console.log('No class names need to be changed with the current options.');
  process.exit(0);
}

let changedFiles = 0;

for (const file of files) {
  const nextContent = replaceCssClassSelectors(
    replaceClassAttributes(file.content, replacements),
    replacements
  );

  if (nextContent === file.content) continue;
  changedFiles += 1;

  if (options.printDiff) {
    printFileDiff(file.path, nextContent);
  }

  if (!options.dryRun) {
    fs.writeFileSync(file.path, nextContent, 'utf8');
  }
}

console.log(`${options.dryRun ? 'Dry run: would update' : 'Updated'} ${changedFiles} file(s).`);
console.log(`Renamed ${changedEntries.length} generated class name(s).`);

if (collisions.length) {
  console.log(
    `Resolved ${collisions.length} base-name collision(s) with --collision=${options.collision}.`
  );
}

console.log('Sample mappings:');
for (const [from, to] of changedEntries.slice(0, 20)) {
  console.log(`- ${from} -> ${to}`);
}
if (changedEntries.length > 20) {
  console.log(`... ${changedEntries.length - 20} more`);
}
