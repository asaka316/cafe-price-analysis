import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

function toCsv(items: any[]) {
  const header = [
    'category',
    'name',
    'url',
    'eatin_price',
  ].join(',');

  const rows = items.map(item =>
  [
    item.category,
    item.name,
    item.url,
    item.eatin_price,
  ]
    .map(v => `"${(v ?? '').replace(/"/g, '""')}"`)
    .join(',')
  );

  return [header, ...rows].join('\n');
}

test.setTimeout(120_000);

test('タリーズ 詳細ページ → 価格取得', async ({ page }) => {
  const dataDir = path.join(__dirname, '../data');
  const listPath = path.join(dataDir, 'tullys_items.json');

  const rawItems: {
    category: string; 
    item: string; 
    url_item: string;
 }[] =JSON.parse(fs.readFileSync(listPath, 'utf-8'));

  const results: {
    category: string;
    name: string;
    url: string;
    eatin_price: string | null;
  }[] = [];
  
  const items = rawItems.map(p => ({
    category: p.category,
    name: p.item,
    url: p.url_item,
   }));


  for (const product of items) {
    try {
        await page.goto(product.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        
        let eatin_price: string | null = null;
        
        const priceLocator = page
         .locator('ul.price_list li span')
         .first();
        
         if (await priceLocator.count() > 0) {
          eatin_price = (await priceLocator.textContent())?.trim() ?? null;
        }


        
        results.push({
            category: product.category,
            name: product.name,
            url: product.url,
            eatin_price,
        });
    } catch {
    console.log('取得失敗:', product.url);
    results.push({
      category: product.category,
      name: product.item,
      url: product.url,
      eatin_price: null,
    });
  }
}

const csv = toCsv(results);
fs.writeFileSync(
    path.join(dataDir,'tullys-products.csv'),
    csv, 
    'utf-8'
);
});