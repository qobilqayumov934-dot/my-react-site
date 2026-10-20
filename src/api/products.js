const API_URL = "https://6a85321d9c451dc67a635aaa.mockapi.io/Products";

export async function fetchProducts(signal) {
  const res = await fetch(API_URL, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Unexpected API response");
  return data;
}

// Уникальный ключ товара: id из MockAPI, а если его нет — название.
// По нему работают вишлист (localStorage) и адрес /product/:id.
export function getProductKey(product) {
  return String(product.id ?? product.name);
}
