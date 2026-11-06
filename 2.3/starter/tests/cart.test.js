import test from "node:test";
import assert from "node:assert/strict";

import { initialCart, productsToAdd } from "../src/data.js";
import {
  addItem,
  applyPromoCode,
  changeQuantity,
  getCartSummary,
  removeItem,
} from "../src/cart.js";

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);

    for (const nestedValue of Object.values(value)) {
      deepFreeze(nestedValue);
    }
  }

  return value;
}

function frozenCart() {
  return deepFreeze(structuredClone(initialCart));
}

test("addItem добавляет новую позицию", () => {
  const cart = frozenCart();
  const nextCart = addItem(cart, productsToAdd[1]);

  assert.equal(nextCart.items.length, 3);
  assert.deepEqual(nextCart.items.at(-1), {
    productId: 9,
    title: "TypeScript для frontend",
    price: 2300,
    quantity: 1,
  });
});

test("addItem увеличивает количество существующей позиции", () => {
  const cart = frozenCart();
  const nextCart = addItem(cart, productsToAdd[0]);

  assert.equal(nextCart.items.find((item) => item.productId === 2)?.quantity, 3);
  assert.equal(cart.items.find((item) => item.productId === 2)?.quantity, 2);
});

test("addItem возвращает новые ссылки cart и items", () => {
  const cart = frozenCart();
  const nextCart = addItem(cart, productsToAdd[1]);

  assert.notEqual(nextCart, cart);
  assert.notEqual(nextCart.items, cart.items);
});

test("changeQuantity изменяет позицию без мутации", () => {
  const cart = frozenCart();
  const oldItem = cart.items[0];
  const nextCart = changeQuantity(cart, "1", "4");
  const newItem = nextCart.items[0];

  assert.equal(newItem.quantity, 4);
  assert.equal(oldItem.quantity, 1);
  assert.notEqual(nextCart, cart);
  assert.notEqual(nextCart.items, cart.items);
  assert.notEqual(newItem, oldItem);
});

test("changeQuantity удаляет позицию при количестве 0", () => {
  const cart = frozenCart();
  const nextCart = changeQuantity(cart, 1, 0);

  assert.deepEqual(nextCart.items.map((item) => item.productId), [2]);
});

test("removeItem удаляет нужную позицию и не меняет исходную", () => {
  const cart = frozenCart();
  const nextCart = removeItem(cart, "2");

  assert.deepEqual(nextCart.items.map((item) => item.productId), [1]);
  assert.equal(cart.items.length, 2);
  assert.notEqual(nextCart, cart);
  assert.notEqual(nextCart.items, cart.items);
});

test("applyPromoCode нормализует поддерживаемый код", () => {
  const cart = frozenCart();
  const nextCart = applyPromoCode(cart, " student10 ");

  assert.equal(nextCart.promoCode, "STUDENT10");
  assert.equal(cart.promoCode, null);
  assert.notEqual(nextCart, cart);
});

test("applyPromoCode сохраняет неизвестный и пустой код как null", () => {
  const cart = frozenCart();

  assert.equal(applyPromoCode(cart, "unknown").promoCode, null);
  assert.equal(applyPromoCode(cart, "   ").promoCode, null);
  assert.equal(applyPromoCode(cart, null).promoCode, null);
});

test("getCartSummary считает позиции, товары и сумму", () => {
  assert.deepEqual(getCartSummary(initialCart), {
    linesCount: 2,
    itemsCount: 3,
    subtotal: 5000,
    discount: 0,
    total: 5000,
  });
});

test("getCartSummary применяет STUDENT10", () => {
  const cart = {
    ...initialCart,
    promoCode: "STUDENT10",
  };

  assert.deepEqual(getCartSummary(cart), {
    linesCount: 2,
    itemsCount: 3,
    subtotal: 5000,
    discount: 500,
    total: 4500,
  });
});

test("getCartSummary корректно обрабатывает пустую корзину", () => {
  assert.deepEqual(getCartSummary({ items: [], promoCode: "SALE20" }), {
    linesCount: 0,
    itemsCount: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
  });
});

test("цепочка операций не изменяет исходную корзину", () => {
  const cart = frozenCart();
  const snapshot = structuredClone(cart);

  let nextCart = addItem(cart, productsToAdd[0]);
  nextCart = changeQuantity(nextCart, 1, 5);
  nextCart = applyPromoCode(nextCart, "SALE20");
  nextCart = removeItem(nextCart, 2);

  assert.deepEqual(cart, snapshot);
  assert.notEqual(nextCart, cart);
});
