function roundToOneDecimal(value) {
  return Math.round(value * 10) / 10;
}

export function findProductById(products, productId) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id == productId) {
      return products[i];
    }
  }
  return undefined;
}

export function filterProducts(products, filters = {}) {
  let filtredProducts = []
  const filterMask = {
    category: (filters?.category && filters?.category !== "all") ? true : false,
    inStockOnly: !!filters?.inStockOnly,
    maxPrice: !!filters?.maxPrice
  }
  
  if (!(filterMask.category || filterMask.inStockOnly || filterMask.maxPrice)) {
    filtredProducts = structuredClone(products);
    return filtredProducts;
  }

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    if (filterMask.category) {
      if (product.category !== filters.category) {
        continue;
      }
    } 
    if (filterMask.inStockOnly) {
      if (!product.inStock) {
        continue;
      }
    }
    if (filterMask.maxPrice) {
      if (product.price > filters.maxPrice) {
        continue;
      }
    }
    filtredProducts.push(product);
  }

  return filtredProducts;
}

export function searchProducts(products, query) {
  if (query == ""  || query == undefined) {
    return products;
  }
  
  let searchedProducts = [];
  const formatedQuery = query.toLowerCase().trim();

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    if (product.title.toLowerCase().includes(formatedQuery)) {
      searchedProducts.push(product);
      continue;
    }
    for (let l = 0; l < product.tags.length; l++) {
      const productTag = product.tags[l].toLowerCase();
      if (productTag.includes(formatedQuery)) {
        searchedProducts.push(product);
        continue;
      }
    }
  }
  
  return searchedProducts;
}

export function sortProducts(products, sort = "default") {
  // ШАГ 4: верните новый отсортированный массив и не меняйте products.
  let sortedProducts = structuredClone(products);
  switch (sort) {
    case "price-asc":
      sortedProducts.sort((a, b) => a.price - b.price)
      return sortedProducts;
    case "price-desc":
      sortedProducts.sort((a, b) => b.price - a.price)
      return sortedProducts;
    case "rating-desc":
      sortedProducts.sort((a, b) => b.rating - a.rating)
      return sortedProducts;
    case "title-asc":
      sortedProducts.sort((a, b) => a.title.localeCompare(b.title, "ru"));
      return sortedProducts;
    default:
      return sortedProducts;
  }
}

export function getCatalogSummary(products) {
  let metric = {
    count: 0,
    inStockCount: 0,
    totalPrice: 0,
    averageRating: 0,
  };

  if (products.length == 0) {
    return metric;
  }
  
  for (; metric.count < products.length; metric.count++) {
    const product = products[metric.count];
    metric.inStockCount += product.inStock;
    metric.totalPrice += product.price;
    metric.averageRating += product.rating;
  }

  metric.averageRating = roundToOneDecimal(metric.averageRating / metric.count)

  return metric;
}

export function selectProducts(products, options = {}) {
  let currentProducts = filterProducts(products, 
    {
      category: options?.category,
      inStock: options?.inStockOnly,
      maxPrice: options?.maxPrice
    });
  currentProducts = searchProducts(currentProducts, options?.query);
  currentProducts = sortProducts(currentProducts, options?.sort);
  return currentProducts;
}
