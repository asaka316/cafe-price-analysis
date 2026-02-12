import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.setTimeout(120_000);

test('タリーズ カテゴリページ → 商品名取得', async ({ page }) => {
  const dataDir = path.join(__dirname, '../data');
  const listPath = path.join(dataDir, 'tullys_category_list.json');

  const items: { category: string; url_category: string }[] =
    JSON.parse(fs.readFileSync(listPath, 'utf-8'));

  const results: {
    category: string;
    item: string;
    url_item: string;
  }[] = [];

  for (const cat of items) {
    try {
      await page.goto(cat.url_category, { waitUntil: 'domcontentloaded' });

      await page.waitForSelector(
        'li.js_item_list_new',
        { state: 'attached' }
    );
    } catch {
        console.log('ページ遷移 or 要素町失敗:', cat.url_category);
        continue;
    }
      
    const cards = page.locator('li.js_item_list_new');
      
    const count = await cards.count();
      
    for (let i = 0; i < count; i++) {
      try {
          const card = cards.nth(i);
          
          const name = await card
            .locator('img')
            .getAttribute('alt');
          
          const url = await card
            .locator('a')
            .getAttribute('href');
          
          if (!name || !url) continue;
          
          results.push({
            category: cat.category,
            item: name.trim(),
            url_item: new URL(url, 'https://www.tullys.co.jp/').href,
          });
        } catch {
          console.log('スキップ（1件）　:', cat.category);
        }
      }
  }
fs.writeFileSync(
    path.join(dataDir, 'tullys_items.json'),
    JSON.stringify(results, null, 2),
    'utf-8'
  );

  console.log('合計件数:', results.length);

});
