const PROMO_DISCOUNTS = {
  STUDENT10: 0.1,
  SALE20: 0.2,
};

const COURIER_PRICE = 300;
const FREE_COURIER_FROM = 3000;

const moneyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 2,
});

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatMoney(value) {
  return moneyFormatter.format(value);
}

export function calculateSubtotal(price, quantity) {
  return roundMoney(Number(price) * Number(quantity));
}

export function calculateDiscount(subtotal, promoCode) {
  return subtotal * PROMO_DISCOUNTS[promoCode] ?? 0;
}

export function calculateDelivery(amountAfterDiscount, deliveryType) {
  const deliveryPrise = 
  (deliveryType === "courier" & amountAfterDiscount < FREE_COURIER_FROM) ? COURIER_PRICE 
  : (deliveryType === "pickup" || (deliveryType === "courier" & amountAfterDiscount >= FREE_COURIER_FROM)) ? 0 
  : null; 
  return deliveryPrise;
}

export function calculateOrder(order) {
  const product = order.product ?? "";
  const quantity = Number(order.quantity) ?? 0;
  const price = Number(order.price) ?? 0;
  const subtotal = calculateSubtotal(price, quantity);
  const discount = calculateDiscount(subtotal, order.promoCode ?? "");
  const delivery = calculateDelivery(subtotal - discount, order.deliveryType ?? "")
  const total = subtotal - discount - (delivery ?? 0);

  const calculatedOrder = {
    product: product,
    quantity: quantity,
    subtotal: subtotal,
    discount: discount,
    delivery: delivery,
    total: total
  }

  return calculatedOrder.delivery !== null ? calculatedOrder : null;
}

export function formatOrder(orderResult) {
  return `Товар: ${orderResult.product}
    Количество: ${orderResult.quantity}
    Цена без учета скидки: ${formatMoney(orderResult.subtotal)}
    Скидка: ${formatMoney(orderResult.discount)}
    Итоговая цена: ${formatMoney(orderResult.total)}
    Доставка: ${orderResult.delivery ? orderResult.delivery : "бесплатно"}
    `;
}
