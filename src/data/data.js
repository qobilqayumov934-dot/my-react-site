// Сколько товаров показывать на главной, если ни у одного нет featured: true
export const HOME_PRODUCTS_COUNT = 8;

// Варианты сортировки на странице /shop (ключи обрабатывает utils/sort.js)
export const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "reviews", label: "Most Reviews" },
  { value: "new", label: "Newest" },
  { value: "name", label: "Name: A to Z" },
];

// Пункты меню. У тех, где есть `to`, — настоящая страница; остальные пока заглушки.
export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Contact" },
  { label: "About" },
  { label: "Sign Up", to: "/signup", guestOnly: true }, // у вошедшего пользователя скрыт
];

// MockAPI не отдаёт цвета и размеры, поэтому для страницы товара берём их по категории.
// Если добавишь у товара в MockAPI поля `colors`, `sizes`, `images` или `description` —
// они будут главнее.
export const OPTIONS_BY_CATEGORY = {
  Fashion: { colors: ["#1f3b2d", "#2b2b2b"], sizes: ["XS", "S", "M", "L", "XL"] },
  Sports: { colors: ["#c8e600", "#db4444"], sizes: ["40", "41", "42", "43", "44"] },
  Gaming: { colors: ["#a0bce0", "#e07575"] },
  Electronics: { colors: ["#2b2b2b", "#c0c0c0"] },
  Toys: { colors: ["#db4444", "#2f6fdb"] },
};

export const FEATURES = [
  { icon: "truck", title: "FREE AND FAST DELIVERY", text: "Free delivery for all orders over $140" },
  { icon: "headphones", title: "24/7 CUSTOMER SERVICE", text: "Friendly 24/7 customer support" },
  { icon: "shield", title: "MONEY BACK GUARANTEE", text: "We return money within 30 days" },
];

export const FOOTER_SUPPORT = [
  "111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.",
  "exclusive@gmail.com",
  "+88015-88888-9999",
];
export const FOOTER_ACCOUNT = ["My Account", "Login / Register", "Cart", "Wishlist", "Shop"];
export const FOOTER_LINKS = ["Privacy Policy", "Terms Of Use", "FAQ", "Contact"];
export const SOCIALS = ["facebook", "twitter", "instagram", "linkedin"];
