import { orders } from "./data.js";
import { calculateOrder, formatOrder } from "./order.js";

for (const order of orders) {
  const result = calculateOrder(order);

  console.log("=".repeat(48));

  if (result === null) {
    console.log(`Заказ «${order.product}»: неизвестный тип доставки`);
    continue;
  }

  console.log(formatOrder(result));
}
