const num = (v) => Number(v) || 0;

// Возвращает НОВЫЙ отсортированный массив (исходный не меняется).
// "default" — порядок, в котором товары пришли из API.
export function sortProducts(products, key) {
  const list = [...products];

  switch (key) {
    case "price-asc":
      return list.sort((a, b) => num(a.price) - num(b.price));
    case "price-desc":
      return list.sort((a, b) => num(b.price) - num(a.price));
    case "rating":
      return list.sort((a, b) => num(b.rating) - num(a.rating) || num(b.reviews) - num(a.reviews));
    case "reviews":
      return list.sort((a, b) => num(b.reviews) - num(a.reviews));
    case "new":
      return list.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
    case "name":
      return list.sort((a, b) =>
        String(a.name).localeCompare(String(b.name), undefined, { sensitivity: "base" })
      );
    default:
      return list;
  }
}
