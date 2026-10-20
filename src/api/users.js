const USERS_URL = "https://686519fe5b5d8d03397fb476.mockapi.io/ap/v1/users";

const norm = (v) => String(v ?? "").trim().toLowerCase();
const digits = (v) => String(v ?? "").replace(/\D/g, "");
// Номера сравниваем только по цифрам: "+1 (555) 123-4567" == "15551234567".
// Меньше 7 цифр — это не телефон (например, заглушка "phone_number 23" из тестовых данных).
const samePhone = (a, b) => digits(a).length >= 7 && digits(a) === digits(b);

// Пароль никогда не кладём в состояние приложения и localStorage
function toSafeUser(u) {
  return {
    id: u.id,
    name: u.name,
    username: u.username,
    email: u.email,
    phone_number: u.phone_number,
    country: u.country,
  };
}

async function fetchUsers() {
  const res = await fetch(USERS_URL);
  if (res.status === 404) return []; // MockAPI отвечает 404, когда записей нет
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// Возвращает пользователя (без пароля) или null, если логин/пароль не подошли.
export async function loginUser(login, password) {
  const users = await fetchUsers();
  const isEmail = login.includes("@");

  const found = users.find((u) =>
    (isEmail ? norm(u.email) === norm(login) : samePhone(u.phone_number, login)) &&
    u.password === password
  );
  return found ? toSafeUser(found) : null;
}

// Возвращает { user } при успехе или { conflict: "email" | "username" | "phone" }.
export async function registerUser({ name, username, email, phone_number, country, password }) {
  const users = await fetchUsers();

  if (users.some((u) => norm(u.email) === norm(email))) return { conflict: "email" };
  if (users.some((u) => norm(u.username) === norm(username))) return { conflict: "username" };
  if (users.some((u) => samePhone(u.phone_number, phone_number))) return { conflict: "phone" };

  const res = await fetch(USERS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      country: country.trim(),
      phone_number: phone_number.trim(),
      password,
      isActive: true,
      createdAt: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  return { user: toSafeUser(await res.json()) };
}
