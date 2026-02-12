import pandas as pd
import os
import matplotlib.pyplot as plt
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm

plt.rcParams['font.family'] = 'Meiryo'

# data/doutor-products.csv を読み込む
script_dir = os.path.dirname(__file__)

base_dir = os.path.dirname(script_dir)

data_dir = os.path.join(base_dir, "data")
image_dir = os.path.join(base_dir, "image")

os.makedirs(data_dir, exist_ok=True)
os.makedirs(image_dir, exist_ok=True)

csv_path = os.path.join(data_dir, 'doutor-products.csv')

df = pd.read_csv(csv_path)

df['price'] = (
    df['eatin_price']
    .astype(str)
    .str.replace('¥', '', regex=False)
    .str.replace(',', '', regex=False)
    .str.replace(' ', '', regex=False)
    .str.replace('～', '', regex=True)
)

df['price'] = pd.to_numeric(df['price'], errors='coerce')
df = df.dropna(subset=['price', 'category'])

plt.figure(figsize=(12, 6))
df.boxplot(column='price', by='category')
plt.title('Price distribution by category')
plt.suptitle('')
plt.ylabel('price (yen)')
plt.xticks(rotation=45, ha='right', fontsize=8)

plt.tight_layout()
plt.savefig(os.path.join(image_dir, 'boxplot_by_category.png'))
plt.close()


for category, group in df.groupby('category'):
    plt.figure(figsize=(12, 10))
    
    plt.bar(group['name'], group['price'], width=0.4)
    plt.title(f'{category} price distribution')
    plt.ylabel('price (yen)')
    plt.xticks(rotation=45, ha='right')
    
    plt.tight_layout()
    plt.savefig(os.path.join(image_dir, f'{category}_bar.png'))
    plt.close()