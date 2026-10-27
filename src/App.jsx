import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import "./App.css";

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import Footer from "./components/Footer";

import DashboardLayout from "./layouts/DashboardLayout";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import WishlistPage from "./pages/WishlistPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

import OverviewPage from "./pages/dashboard/OverviewPage";
import ProductsPage from "./pages/dashboard/ProductsPage";
import UsersPage from "./pages/dashboard/UsersPage";
import OrdersPage from "./pages/dashboard/OrdersPage";

import useLocalStorage from "./hooks/useLocalStorage";
import { fetchProducts, getProductKey } from "./api/products";

// Статус заказа по клику меняется по кругу: new → done → cancelled → new
const NEXT_ORDER_STATUS = { new: "done", done: "cancelled", cancelled: "new" };

// Оболочка магазина: верхняя полоса, шапка, страница, подвал.
// У панели управления (/dashboard) своя оболочка — см. layouts/DashboardLayout.jsx
function SiteLayout({ wishlistCount, cartCount, user, onLogout, products, productsStatus }) {
  return (
    <div className="page">
      <TopBar />
      <Header
        wishlistCount={wishlistCount}
        cartCount={cartCount}
        user={user}
        onLogout={onLogout}
        products={products}
        productsStatus={productsStatus}
      />

      <main className="container">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();

  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [wishlist, setWishlist] = useLocalStorage("wishlist", []); // массив ключей товаров
  const [cart, setCart] = useLocalStorage("cart", []); // [{ key, qty }]
  const [user, setUser] = useLocalStorage("user", null); // вошедший пользователь (без пароля)
  const [orders, setOrders] = useLocalStorage("orders", []); // заказы, оформленные в этом браузере

  // Загружаем все товары один раз — дальше все страницы берут их отсюда
  useEffect(() => {
    const controller = new AbortController();

    fetchProducts(controller.signal)
      .then((data) => {
        setProducts(data);
        setStatus("success");
      })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("error");
      });

    return () => controller.abort();
  }, []);

  // При переходе на другую страницу — наверх
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const toggleWish = (key) =>
    setWishlist((list) =>
      list.includes(key) ? list.filter((k) => k !== key) : [...list, key]
    );

  const addToCart = (key, qty = 1) =>
    setCart((items) =>
      items.some((i) => i.key === key)
        ? items.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
        : [...items, { key, qty }]
    );

  const setCartQty = (key, qty) =>
    setCart((items) => items.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i)));

  const removeFromCart = (key) => setCart((items) => items.filter((i) => i.key !== key));

  const clearCart = () => setCart([]);

  // ---- Заказы (показываются в панели управления) ----
  const addOrder = ({ number, customer, lines, total }) =>
    setOrders((list) => [
      {
        id: number,
        createdAt: new Date().toISOString(),
        status: "new",
        customer: {
          name: customer.name.trim(),
          phone: customer.phone.trim(),
          address: customer.address.trim(),
          comment: customer.comment.trim(),
        },
        items: lines.map((l) => ({ name: l.product.name, price: l.product.price, qty: l.qty })),
        total,
      },
      ...list,
    ]);

  const cycleOrderStatus = (id) =>
    setOrders((list) =>
      list.map((o) => (o.id === id ? { ...o, status: NEXT_ORDER_STATUS[o.status] ?? "new" } : o))
    );

  const deleteOrder = (id) => setOrders((list) => list.filter((o) => o.id !== id));

  const clearOrders = () => setOrders([]);

  // Товар, созданный кнопкой «Add» в панели, сразу появляется и в магазине
  const addProduct = (product) => setProducts((list) => [...list, product]);

  // Строки корзины с полными данными товара (товары, которых нет в API, отбрасываем)
  const cartLines =
    status === "success"
      ? cart
          .map((item) => ({
            ...item,
            product: products.find((p) => getProductKey(p) === item.key),
          }))
          .filter((line) => line.product)
      : [];

  const cartCount = (status === "success" ? cartLines : cart).reduce((n, l) => n + l.qty, 0);

  // Считаем только те товары из вишлиста, которые реально есть в API
  const wishlistCount =
    status === "success"
      ? products.filter((p) => wishlist.includes(getProductKey(p))).length
      : wishlist.length;

  const shared = {
    products,
    status,
    wishlist,
    onToggleWish: toggleWish,
    onAddToCart: addToCart,
  };

  const logout = () => setUser(null);

  return (
    <Routes>
      {/* ---- Магазин ---- */}
      <Route
        element={
          <SiteLayout
            wishlistCount={wishlistCount}
            cartCount={cartCount}
            user={user}
            onLogout={logout}
            products={products}
            productsStatus={status}
          />
        }
      >
        <Route path="/" element={<HomePage {...shared} />} />
        <Route path="/shop" element={<ShopPage {...shared} />} />
        <Route path="/wishlist" element={<WishlistPage {...shared} />} />
        <Route path="/product/:id" element={<ProductDetailsPage {...shared} />} />
        <Route
          path="/cart"
          element={
            <CartPage
              status={status}
              cartLines={cartLines}
              onSetQty={setCartQty}
              onRemove={removeFromCart}
              onClear={clearCart}
              onOrderPlaced={addOrder}
              user={user}
            />
          }
        />
        <Route path="/login" element={<LoginPage user={user} onLogin={setUser} />} />
        <Route path="/signup" element={<SignUpPage user={user} onLogin={setUser} />} />
      </Route>

      {/* ---- Панель управления (после входа или регистрации) ---- */}
      <Route
        path="/dashboard"
        element={
          <DashboardLayout
            user={user}
            onLogout={logout}
            products={products}
            productsStatus={status}
            orders={orders}
            onOrderCycle={cycleOrderStatus}
            onOrderDelete={deleteOrder}
            onOrdersClear={clearOrders}
            onProductCreated={addProduct}
          />
        }
      >
        <Route index element={<OverviewPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
