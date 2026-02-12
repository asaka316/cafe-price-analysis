☕ Doutor Menu Price Analysis

This project analyzes menu prices at Doutor Coffee in Japan.
Using web scraping and data visualization, I explored pricing characteristics across different product categories.

📌 Overview

Scraped product categories and item pages using Playwright

Collected data in multiple stages: category → item → price (stored as JSON)

Converted JSON data into CSV format

Visualized price distributions using Python (pandas & matplotlib)

🛠️ Tech Stack

Node.js / TypeScript

Playwright

Python

pandas

matplotlib

🔍 Scraping Flow

Category Scraping
Extract category names and URLs from the menu page

Item List Scraping
Extract product names and detail page URLs for each category

Detail Page Scraping
Extract eat-in prices from individual product pages

📊 Visualization

Box plots to show price distributions by category

Bar charts to compare individual product prices

🧠 Key Learnings

Accurate selector design is critical for reliable scraping

Clear and consistent variable naming is essential in multi-stage scraping

Data normalization greatly simplifies downstream analysis and visualization

🚀 Future Improvements

Compare prices with other coffee chains (e.g. Tully’s Coffee)

Analyze price trends over time

Add summary statistics such as mean, median, and standard deviation

⚠️ Disclaimer

This project is for educational purposes only.
All data was collected from publicly available web pages.