import { products } from "./products.js";
import { getCatalogSummary, selectProducts } from "./catalog.js";

const options = {
  category: "books",
  inStockOnly: true,
  maxPrice: 2500,
  query: "frontend",
  sort: "rating-desc",
};

const visibleProducts = selectProducts(products, options);

console.log("Параметры выборки:");
console.log(options);
console.log("\nРезультат:");
console.table(visibleProducts);
console.log("Статистика результата:");
console.log(getCatalogSummary(visibleProducts));
