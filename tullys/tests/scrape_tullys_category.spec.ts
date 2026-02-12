import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('タリーズ 一覧URL取得→JSON保存', async ({ page }) => {
  await page.goto('https://www.tullys.co.jp/menu/', {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForSelector('.cm-FooterNavChildItem',
    { state: 'attached' }
  );

  const category_names = await page
  .locator('li.cm-FooterNavChildItem > a.cm-FooterNavChildLink')
  .allTextContents();

  const results_category = await page.locator('li.cm-FooterNavChildItem > a.cm-FooterNavChildLink').evaluateAll(links =>
    links.map(a => ({
      category: a.textContent?.trim() || '',
      url_category: a.href,
    })).filter(item => item.url_category?.includes('/menu/')
  ));

  const cleaned = results_category.filter(item =>
    item.category !== '季節の新商品' &&
    item.category !== '食物アレルギー・栄養成分情報' &&
    item.category !== 'コーヒー⾖' &&
    item.category !== 'グッズ' &&
    item.category !== '商品情報トップ'
  );

  const dataDir = path.join(__dirname, '../data');
  fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(
    path.join(dataDir, 'tullys_category_list.json'),
    JSON.stringify(cleaned, null, 2),
    'utf-8'
  );

  console.log('保存件数:', cleaned.length);
});
