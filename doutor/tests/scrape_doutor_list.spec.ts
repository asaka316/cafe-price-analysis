import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.setTimeout(120_000);

test('ドトール カテゴリページ → 商品名取得', async ({ page }) => {
  const dataDir = path.join(__dirname, '../data');
  const listPath = path.join(dataDir, 'doutor_category_list.json');

  const items: { category: string; url_category: string }[] =
    JSON.parse(fs.readFileSync(listPath, 'utf-8'));

  const results: {
    category: string;
    item: string;
    url_item: string;
  }[] = [];

  for (const cat of items) {
    if (!cat.url_category.includes('/menu/list/')) continue;
    
    try {
      await page.goto(cat.url_category, { waitUntil: 'domcontentloaded' });
    } catch {
      console.log('ページ遷移失敗: ', cat.url_category);
      continue;
    }
      
      await page.waitForSelector('li.dcs-menu-cat-li');
      
    const cards = page.locator('li.dcs-menu-cat-li');
      
    const count = await cards.count();
      
    for (let i = 0; i < count; i++) {
      try {
          const card = cards.nth(i);
          
          const name = await card
            .locator('.rt_cf_product_name')
            .textContent();
          
          const url = await card
            .locator('a')
            .getAttribute('href');
          
          if (!name || !url) continue;
          
          results.push({
            category: cat.category,
            item: name.trim(),
            url_item: new URL(url, 'https://www.doutor.co.jp').href,
          });
        } catch {
          console.log('スキップ（1件）　:', cat.category);
        }
      }
  }
fs.writeFileSync(
    path.join(dataDir, 'doutor_items.json'),
    JSON.stringify(results, null, 2),
    'utf-8'
  );

  console.log('合計件数:', results.length);

});
