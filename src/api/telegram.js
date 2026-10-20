import { formatPrice } from "../utils/format";

// Значения берутся из файла .env в корне проекта (рядом с package.json):
//   TOKEN=123456789:AAH...     ← токен бота от @BotFather
//   USER_ID=123456789          ← твой числовой Telegram ID (его покажет @userinfobot)
// ВАЖНО: Vite не отдаёт в код переменные без префикса VITE_, поэтому в vite.config.js
// должна быть строка  envPrefix: ["VITE_", "TOKEN", "USER_ID"]
// (вариант с VITE_TOKEN / VITE_USER_ID тоже работает). После изменения .env или
// vite.config.js dev-сервер нужно перезапустить.
const TOKEN = import.meta.env.TOKEN ?? import.meta.env.VITE_TOKEN;
const USER_ID = import.meta.env.USER_ID ?? import.meta.env.VITE_USER_ID;

export const NOT_CONFIGURED = "TELEGRAM_NOT_CONFIGURED";

// Короткий уникальный номер заказа, например "MBX9K2QP"
export const makeOrderNumber = () => Date.now().toString(36).toUpperCase();

// Telegram в режиме HTML ломается от символов < > & — экранируем всё, что ввёл покупатель
const esc = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function buildOrderMessage({ orderNumber, customer, lines, total }) {
  const items = lines
    .map((line, i) => {
      const { name, price } = line.product;
      return `${i + 1}. ${esc(name)} — ${line.qty} × ${formatPrice(price)} = ${formatPrice(price * line.qty)}`;
    })
    .join("\n");

  const parts = [
    `🛒 <b>Новый заказ #${esc(orderNumber)}</b>`,
    "",
    `👤 Имя: ${esc(customer.name)}`,
    `📞 Телефон: ${esc(customer.phone)}`,
    `📍 Адрес: ${esc(customer.address)}`,
  ];
  if (customer.comment.trim()) parts.push(`💬 Комментарий: ${esc(customer.comment.trim())}`);
  parts.push(
    "",
    "📦 <b>Товары:</b>",
    items,
    "",
    `💰 <b>Итого: ${formatPrice(total)}</b>`,
    `🕒 ${new Date().toLocaleString("ru-RU")}`
  );
  return parts.join("\n");
}

// Отправляет заказ в Telegram. Если что-то пошло не так — бросает ошибку.
// Чтобы позже перейти на свой сервер, достаточно заменить содержимое этой функции.
export async function sendOrderToTelegram(order) {
  if (!TOKEN || !USER_ID) throw new Error(NOT_CONFIGURED);

  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: USER_ID,
      text: buildOrderMessage(order),
      parse_mode: "HTML",
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.description || `Telegram error ${res.status}`);
  }
}
