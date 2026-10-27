import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet } from "react-router-dom";
import { Icon } from "../components/Icon";
import Avatar from "../components/dashboard/Avatar";
import useLocalStorage from "../hooks/useLocalStorage";
import { listUsers } from "../api/users";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: "grid", end: true },
  { to: "/dashboard/products", label: "Products", icon: "box" },
  { to: "/dashboard/users", label: "Users", icon: "users" },
  { to: "/dashboard/orders", label: "Orders", icon: "file" },
];

// На телефоне сайдбар выезжает поверх страницы, на компьютере стоит слева
const isDesktop = () =>
  typeof window.matchMedia !== "function" || window.matchMedia("(min-width: 861px)").matches;

export default function DashboardLayout({
  user,
  onLogout,
  products,
  productsStatus,
  orders,
  onOrderCycle,
  onOrderDelete,
  onOrdersClear,
  onProductCreated,
}) {
  const [theme, setTheme] = useLocalStorage("dashboardTheme", "light");
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);
  const [users, setUsers] = useState([]);
  const [usersStatus, setUsersStatus] = useState("loading");

  const loadUsers = useCallback(
    (signal) =>
      listUsers(signal)
        .then((data) => {
          setUsers(data);
          setUsersStatus("success");
        })
        .catch((err) => {
          if (err.name !== "AbortError") setUsersStatus("error");
        }),
    []
  );

  // Пользователей грузим только когда кто-то вошёл
  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    loadUsers(controller.signal);
    return () => controller.abort();
  }, [user, loadUsers]);

  const refreshUsers = () => {
    setUsersStatus("loading");
    loadUsers();
  };

  // Панель доступна только после входа
  if (!user) return <Navigate to="/login" replace />;

  const closeOnMobile = () => {
    if (!isDesktop()) setSidebarOpen(false);
  };

  const context = {
    products,
    productsStatus,
    users,
    usersStatus,
    refreshUsers,
    orders,
    onOrderCycle,
    onOrderDelete,
    onOrdersClear,
    onProductCreated,
  };

  const className = ["dash", theme === "dark" && "dash--dark", sidebarOpen && "is-sidebar-open"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <aside className="dash__sidebar" aria-label="Dashboard menu">
        <div className="dash__brand">
          <Icon name="box" size={24} />
          <span>Dashboard</span>
        </div>

        <nav className="dash__nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "dash__link is-active" : "dash__link")}
              onClick={closeOnMobile}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dash__bottom">
          <Link to="/" className="dash__link">
            <Icon name="home" size={18} />
            <span>Back to shop</span>
          </Link>
          <button
            type="button"
            className="dash__link"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          >
            <Icon name="moon" size={18} />
            <span>Change mode</span>
          </button>
          <button type="button" className="dash__link" onClick={onLogout}>
            <Icon name="logout" size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="dash__backdrop" onClick={() => setSidebarOpen(false)} />

      <div className="dash__main">
        <header className="dash__topbar">
          <button
            type="button"
            className="dash__burger"
            aria-label="Toggle menu"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((open) => !open)}
          >
            <Icon name="menu" size={22} />
          </button>

          <div className="dash__user">
            <span>{user.name}</span>
            <Avatar name={user.name} size={32} />
          </div>
        </header>

        <div className="dash__content">
          <Outlet context={context} />
        </div>
      </div>
    </div>
  );
}
