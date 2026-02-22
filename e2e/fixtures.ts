import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { expect, test as base } from '@playwright/test';

const COVERAGE_DIR = path.resolve('.playwright-coverage', 'raw');

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const coverageEnabled = process.env['PLAYWRIGHT_COVERAGE'] === '1' && testInfo.project.name === 'chromium';

    if (coverageEnabled) {
      await page.coverage.startJSCoverage({ resetOnNavigation: false });
    }

    await use(page);

    if (coverageEnabled) {
      const coverage = await page.coverage.stopJSCoverage();
      await mkdir(COVERAGE_DIR, { recursive: true });

      const fileName = `${Date.now()}-${randomUUID()}.json`;
      const outputPath = path.join(COVERAGE_DIR, fileName);
      await writeFile(outputPath, JSON.stringify(coverage), 'utf8');
    }
  }
});

export { expect };
