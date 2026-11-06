const PROMO_DISCOUNTS = {
  STUDENT10: 0.1,
  SALE20: 0.2,
};

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function addItem(cart, product) {
  let newCart = {...cart, items: [...cart.items]};
  for (let i = 0; i < newCart.items.length; i++) {
    const currentItem = newCart.items[i];
    if (currentItem.productId == product.id) {
      newCart.items[i] = { ...currentItem, quantity: currentItem.quantity + 1 };
      return newCart;
    }
  }
  newCart.items.push({
    productId: product.id,
    title: product.title,
    price: product.price,
    quantity: 1,
  });
  return newCart;
}

export function changeQuantity(cart, productId, quantity) {
  let newCart = {...cart, items: [...cart.items]};
  const intID = Number(productId);
  const intQuantity = Number(quantity);
  for (let i = 0; i < newCart.items.length; i++) {
    const currentItem = newCart.items[i];
    if (currentItem.productId == intID) {
      if (intQuantity <= 0) {
        newCart.items = newCart.items.filter((item) => item.productId !== intID);
      } else {
        newCart.items[i] = {...currentItem, quantity: intQuantity};
      }
      return newCart;
    }
  }
  return newCart;
}

export function removeItem(cart, productId) {
  const intID = Number(productId)
  const clearedItems = cart.items.filter((item) => item.productId !== intID);
  const newCart = {...cart, items: [...clearedItems]};
  return newCart;
}

export function applyPromoCode(cart, promoCode) {
  if (!promoCode) {
    return {...cart, promoCode: null};
  }
  const formatedPromo = promoCode.toUpperCase().trim();
  return {...cart, promoCode: PROMO_DISCOUNTS[formatedPromo] ? formatedPromo : null};
}

export function getCartSummary(cart) {
  let summary = {
    linesCount: 0,
    itemsCount: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
  };
  for (; summary.linesCount < cart.items.length; summary.linesCount++) { 
    const currentItem = cart.items[summary.linesCount];
    summary.itemsCount += currentItem.quantity;
    summary.subtotal += currentItem.price * currentItem.quantity;
  }
  summary.discount = summary.subtotal * (PROMO_DISCOUNTS[cart.promoCode] ?? 0)
  summary.total = summary.subtotal - summary.discount;
  return summary;
}
