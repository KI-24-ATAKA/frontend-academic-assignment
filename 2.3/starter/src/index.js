import { initialCart, productsToAdd } from "./data.js";
import {
  addItem,
  applyPromoCode,
  changeQuantity,
  getCartSummary,
} from "./cart.js";

const originalSnapshot = structuredClone(initialCart);

let cart = initialCart;
cart = addItem(cart, productsToAdd[0]);
cart = addItem(cart, productsToAdd[1]);
cart = changeQuantity(cart, 1, 3);
cart = applyPromoCode(cart, " student10 ");
cart = addItem(cart, productsToAdd[2])
cart = changeQuantity(cart, 7, 10)

console.log("Итоговая корзина:");
console.table(cart.items);
console.log("Резюме:");
console.log(getCartSummary(cart));
console.log("\nИсходная корзина не изменилась:");
console.log(JSON.stringify(initialCart) === JSON.stringify(originalSnapshot));
