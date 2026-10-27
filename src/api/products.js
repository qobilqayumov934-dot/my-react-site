const API_URL = "https://6a85321d9c451dc67a635aaa.mockapi.io/Products";

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

// MockAPI может отдавать данные в разном формате: например, картинку в поле `img`,
// без `id`, `reviews` или `isNew`. Приводим товар к одному виду,
// чтобы остальной код не зависел от конкретного ответа API.
export function normalizeProduct(raw) {
  const image = String(raw.image ?? raw.img ?? "");
  const images =
    Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images.filter(Boolean)
      : image
        ? [image]
        : [];

  return {
    ...raw,
    id: raw.id ?? raw.name,
    image,
    images,
    price: toNumber(raw.price),
    rating: toNumber(raw.rating),
    reviews: toNumber(raw.reviews),
    isNew: raw.isNew === true || raw.isNew === "true",
  };
}

export async function fetchProducts(signal) {
  const res = await fetch(API_URL, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Unexpected API response");
  return data.map(normalizeProduct);
}

// Уникальный ключ товара: id из MockAPI, а если его нет — название.
// По нему работают вишлист (localStorage) и адрес /product/:id.
export function getProductKey(product) {
  return String(product.id ?? product.name);
}

// Создаёт товар в MockAPI (используется кнопкой «Add» в панели управления)
export async function createProduct(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return normalizeProduct(await res.json());
}
