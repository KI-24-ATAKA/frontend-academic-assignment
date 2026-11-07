import { products } from "./products.js";
import { getCatalogSummary, selectProducts } from "./catalog.js";

const options = {
  sort: "title-asc",
};

const visibleProducts = selectProducts(products, options);

console.log("Параметры выборки:");
console.log(options);
console.log("\nРезультат:");
console.table(visibleProducts);
console.log("Статистика результата:");
console.log(getCatalogSummary(visibleProducts));
