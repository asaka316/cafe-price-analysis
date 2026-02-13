import os
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# ===== パス設定 =====
script_dir = os.path.dirname(__file__)
project_root = os.path.dirname(os.path.dirname(script_dir))

doutor_csv = os.path.join(project_root, "doutor", "data", "doutor-products.csv")
tullys_csv = os.path.join(project_root, "tullys", "data", "tullys-products.csv")

images_dir = os.path.join(project_root, "compare", "images")
os.makedirs(images_dir, exist_ok=True)

# ===== CSV 読み込み =====
doutor_df = pd.read_csv(doutor_csv)

tullys_df = pd.read_csv(tullys_csv)

# ===== 価格を数値に変換 =====
def to_price(series):
    return (
        series
        .astype(str)
        .str.replace(r"[^0-9]", "", regex=True)
        .replace("", pd.NA)
        .astype(float)
        .dropna()
    )

doutor_prices = to_price(doutor_df["eatin_price"])
tullys_prices = to_price(tullys_df["eatin_price"])

print("doutor価格件数:", len(doutor_prices))
print("tullys価格件数:", len(tullys_prices))

# ===== グラフ =====
all_prices = np.concatenate([doutor_prices, tullys_prices])
bins = np.histogram_bin_edges(all_prices, bins=15)

plt.figure(figsize=(8,5))
plt.hist(doutor_prices, bins=bins, alpha=0.6, label="Doutor Coffee")
plt.hist(tullys_prices, bins=bins, alpha=0.6, label="Tullys Coffee")

plt.xlabel("Price (¥)")
plt.ylabel("Number of Products")
plt.title("Eatin Price Distribution Comparison")
plt.legend()
plt.tight_layout()

plt.savefig(os.path.join(images_dir, "price_comparison_hist.png"))
plt.show()

plt.figure(figsize=(6,5))
plt.boxplot(
    [doutor_prices, tullys_prices],
    labels=["Doutor Coffee", "Tullys Coffee"]
)
plt.ylabel("Price (¥)")
plt.title("Price Range Comparison")
plt.tight_layout()
plt.savefig(os.path.join(images_dir, "price_boxplot.png"))
plt.show()

summary = pd.DataFrame({
    "Doutor Coffee": doutor_prices.describe(),
    "Tullys Coffee": tullys_prices.describe()
})

summary.to_csv(os.path.join(images_dir, "price_summary.csv"))
print(summary)
