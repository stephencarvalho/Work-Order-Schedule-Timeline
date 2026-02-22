import { readdir, readFile, mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';

import istanbulLibCoverage from 'istanbul-lib-coverage';
import istanbulLibReport from 'istanbul-lib-report';
import istanbulReports from 'istanbul-reports';
import v8ToIstanbulPkg from 'v8-to-istanbul';

const { createCoverageMap } = istanbulLibCoverage;
const { createContext } = istanbulLibReport;
const reports = istanbulReports;
const v8ToIstanbul = v8ToIstanbulPkg.default ?? v8ToIstanbulPkg;

const RAW_DIR = path.resolve('.playwright-coverage', 'raw');
const OUTPUT_DIR = path.resolve('coverage', 'e2e');
const APP_ORIGIN = process.env['PLAYWRIGHT_BASE_URL'] ?? 'http://127.0.0.1:4200';

function isAppSourceUrl(url) {
  if (!url.startsWith(APP_ORIGIN)) {
    return false;
  }

  return !url.includes('/node_modules/');
}

async function pathExists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readCoverageEntries() {
  if (!(await pathExists(RAW_DIR))) {
    return [];
  }

  const files = (await readdir(RAW_DIR)).filter((name) => name.endsWith('.json'));
  const entries = [];

  for (const file of files) {
    const filePath = path.join(RAW_DIR, file);
    const raw = await readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      entries.push(...parsed);
    }
  }

  return entries;
}

async function toIstanbulMap(v8Entries) {
  const map = createCoverageMap({});
  const sourceCache = new Map();

  for (const entry of v8Entries) {
    const url = entry?.url;
    if (!url || !isAppSourceUrl(url)) {
      continue;
    }

    try {
      let source = sourceCache.get(url);
      if (!source) {
        const response = await fetch(url);
        if (!response.ok) {
          continue;
        }
        source = await response.text();
        sourceCache.set(url, source);
      }

      const converter = v8ToIstanbul(url, 0, { source });
      await converter.load();
      converter.applyCoverage(entry.functions ?? []);
      map.merge(converter.toIstanbul());
    } catch {
      // Ignore unsupported scripts and continue with usable coverage entries.
    }
  }

  return map;
}

async function writeReports(map) {
  const filteredMap = createCoverageMap({});
  for (const filePath of map.files()) {
    const isTypeScriptSource = filePath.endsWith('.ts');
    const isAppFile =
      isTypeScriptSource &&
      (filePath.includes('/src/app/') || filePath.endsWith('/src/main.ts')) &&
      !filePath.endsWith('/src/app/app.component.ts') &&
      !filePath.endsWith('/src/app/layout/layout.component.ts');
    if (isAppFile) {
      filteredMap.addFileCoverage(map.fileCoverageFor(filePath));
    }
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  const context = createContext({
    dir: OUTPUT_DIR,
    coverageMap: filteredMap,
    defaultSummarizer: 'nested'
  });

  reports.create('text-summary').execute(context);
  reports.create('html').execute(context);
  reports.create('lcovonly', { file: 'lcov.info' }).execute(context);
  reports.create('json-summary', { file: 'coverage-summary.json' }).execute(context);
}

async function main() {
  const entries = await readCoverageEntries();
  if (entries.length === 0) {
    throw new Error('No E2E coverage entries found. Run with PLAYWRIGHT_COVERAGE=1 playwright test first.');
  }

  const map = await toIstanbulMap(entries);
  await writeReports(map);

  await rm(path.resolve('.playwright-coverage'), { recursive: true, force: true });
}

await main();
