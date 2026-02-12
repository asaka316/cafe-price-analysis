import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('ドトール 一覧URL取得→JSON保存', async ({ page }) => {
  await page.goto('https://www.doutor.co.jp/dcs/menu/', {
    waitUntil: 'networkidle',
  });

  await page.waitForSelector('.mod-head-dcs01.mod-head-dcs01_vertical');

  const category_names = await page
  .locator('.mod-head-dcs01.mod-head-dcs01_vertical')
  .allTextContents();

  const results_category = await page.locator('ul.dcs-menu-idx-ul li.dcs-menu-idx-li a').evaluateAll(links =>
    links.map(a => ({
      category: a.textContent?.trim() || '',
      url_category: a.href,
    })).filter(item => item.url_category?.includes('/menu/list/')
  ));

  const dataDir = path.join(__dirname, '../data');
  fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(
    path.join(dataDir, 'doutor_category_list.json'),
    JSON.stringify(results_category, null, 2),
    'utf-8'
  );

  console.log('保存件数:', results_category.length);
});
