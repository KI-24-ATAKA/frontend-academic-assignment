import test from "node:test";
import assert from "node:assert/strict";

import { products } from "../src/products.js";
import {
  findProductById,
  filterProducts,
  searchProducts,
  sortProducts,
  getCatalogSummary,
  selectProducts,
} from "../src/catalog.js";

function ids(items) {
  return items.map((item) => item.id);
}

test("findProductById находит товар по числовому id", () => {
  assert.equal(findProductById(products, 4)?.title, "Vue: от компонентов к приложению");
});

test("findProductById преобразует строковый id", () => {
  assert.equal(findProductById(products, "9")?.id, 9);
});

test("findProductById возвращает undefined, если товара нет", () => {
  assert.equal(findProductById(products, 999), undefined);
});

test("filterProducts фильтрует по категории", () => {
  assert.deepEqual(ids(filterProducts(products, { category: "books" })), [1, 2, 3, 9, 10]);
});

test("filterProducts одновременно применяет наличие и максимальную цену", () => {
  const result = filterProducts(products, {
    inStockOnly: true,
    maxPrice: 2000,
  });

  assert.deepEqual(ids(result), [1, 2, 10]);
});

test("filterProducts со значениями по умолчанию возвращает все элементы новой ссылкой", () => {
  const result = filterProducts(products);

  assert.deepEqual(result, products);
  assert.notEqual(result, products);
});

test("searchProducts ищет без учёта регистра в названии", () => {
  assert.deepEqual(ids(searchProducts(products, "  BROWSER API  ")), [3]);
});

test("searchProducts ищет в тегах", () => {
  assert.deepEqual(ids(searchProducts(products, "javascript")), [1, 3, 5, 12]);
});

test("searchProducts с пустым запросом возвращает копию массива", () => {
  const result = searchProducts(products, "   ");

  assert.deepEqual(result, products);
  assert.notEqual(result, products);
});

test("sortProducts сортирует по возрастанию цены", () => {
  assert.deepEqual(ids(sortProducts(products, "price-asc")).slice(0, 3), [10, 2, 1]);
});

test("sortProducts сортирует по убыванию цены", () => {
  assert.deepEqual(ids(sortProducts(products, "price-desc")).slice(0, 3), [4, 11, 5]);
});

test("sortProducts сортирует по убыванию рейтинга", () => {
  const result = sortProducts(products, "rating-desc");

  assert.equal(result[0].rating, 4.9);
  assert.equal(result[1].rating, 4.9);
});

test("sortProducts не изменяет исходный массив", () => {
  const before = ids(products);

  const result = sortProducts(products, "price-desc");

  assert.deepEqual(ids(products), before);
  assert.notEqual(result, products);
});

test("sortProducts для неизвестного режима сохраняет порядок, но возвращает копию", () => {
  const result = sortProducts(products, "unknown");

  assert.deepEqual(result, products);
  assert.notEqual(result, products);
});

test("getCatalogSummary считает статистику", () => {
  assert.deepEqual(getCatalogSummary(products.slice(0, 3)), {
    count: 3,
    inStockCount: 2,
    totalPrice: 5500,
    averageRating: 4.7,
  });
});

test("getCatalogSummary корректно обрабатывает пустой массив", () => {
  assert.deepEqual(getCatalogSummary([]), {
    count: 0,
    inStockCount: 0,
    totalPrice: 0,
    averageRating: 0,
  });
});

test("selectProducts соединяет фильтр, поиск и сортировку", () => {
  const result = selectProducts(products, {
    category: "books",
    inStockOnly: true,
    maxPrice: 2500,
    query: "frontend",
    sort: "rating-desc",
  });

  assert.deepEqual(ids(result), [9, 1]);
});
