import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateSubtotal,
  calculateDiscount,
  calculateDelivery,
  calculateOrder,
  formatOrder,
  formatMoney,
} from "../src/order.js";

function normalizeSpaces(value) {
  return value.replaceAll(/\s/g, " ").trim();
}

test("calculateSubtotal преобразует строки в числа", () => {
  assert.equal(calculateSubtotal("1500", "3"), 4500);
});

test("calculateSubtotal работает и с числовыми аргументами", () => {
  assert.equal(calculateSubtotal(1250, 2), 2500);
});

test("calculateDiscount применяет STUDENT10", () => {
  assert.equal(calculateDiscount(4500, "STUDENT10"), 450);
});

test("calculateDiscount применяет SALE20", () => {
  assert.equal(calculateDiscount(2600, "SALE20"), 520);
});

test("calculateDiscount возвращает 0 для неизвестного промокода", () => {
  assert.equal(calculateDiscount(2000, "UNKNOWN"), 0);
  assert.equal(calculateDiscount(2000), 0);
});

test("calculateDelivery возвращает 0 для самовывоза", () => {
  assert.equal(calculateDelivery(1000, "pickup"), 0);
});

test("calculateDelivery считает платную курьерскую доставку", () => {
  assert.equal(calculateDelivery(2999.99, "courier"), 300);
});

test("calculateDelivery делает курьерскую доставку бесплатной от 3000", () => {
  assert.equal(calculateDelivery(3000, "courier"), 0);
});

test("calculateDelivery возвращает null для неизвестного типа", () => {
  assert.equal(calculateDelivery(3000, "drone"), null);
});

test("calculateOrder возвращает полный расчёт", () => {
  const order = {
    product: "Практический JavaScript",
    price: "1500",
    quantity: "3",
    deliveryType: "courier",
    promoCode: "STUDENT10",
  };

  assert.deepEqual(calculateOrder(order), {
    product: "Практический JavaScript",
    quantity: 3,
    subtotal: 4500,
    discount: 450,
    delivery: 0,
    total: 4050,
  });
});

test("calculateOrder не изменяет исходный объект", () => {
  const order = {
    product: "Книга",
    price: "1000",
    quantity: "2",
    deliveryType: "pickup",
    promoCode: "",
  };
  const snapshot = structuredClone(order);

  calculateOrder(order);

  assert.deepEqual(order, snapshot);
});

test("calculateOrder возвращает null для неизвестной доставки", () => {
  const order = {
    product: "Книга",
    price: "1000",
    quantity: "2",
    deliveryType: "teleport",
    promoCode: "",
  };

  assert.equal(calculateOrder(order), null);
});

test("formatOrder возвращает понятный текст и форматирует деньги", () => {
  const result = {
    product: "Практический JavaScript",
    quantity: 3,
    subtotal: 4500,
    discount: 450,
    delivery: 0,
    total: 4050,
  };

  const text = normalizeSpaces(formatOrder(result));

  assert.match(text, /Товар: Практический JavaScript/);
  assert.match(text, /Количество: 3/);
  assert.ok(text.includes(normalizeSpaces(formatMoney(4500))));
  assert.ok(text.includes(normalizeSpaces(formatMoney(450))));
  assert.ok(text.includes(normalizeSpaces(formatMoney(4050))));
  assert.match(text, /Доставка: бесплатно/);
});
