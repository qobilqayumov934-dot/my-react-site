import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Icon } from "./Icon";
import AccountMenu from "./AccountMenu";
import { NAV_LINKS } from "../data/data";

export default function Header({ wishlistCount, cartCount, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false); // бургер-меню на телефонах
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="logo" onClick={closeMenu}>Exclusive</Link>

        <nav id="main-nav" className={menuOpen ? "nav is-open" : "nav"} aria-label="Main">
          {NAV_LINKS.filter((item) => !(item.guestOnly && user)).map((item) =>
            item.to ? (
              <NavLink
                key={item.label}
                to={item.to}
                end
                className={({ isActive }) => (isActive ? "nav__link is-active" : "nav__link")}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ) : (
              // Страницы ещё нет — обычная ссылка-заглушка
              <a
                key={item.label}
                href="#"
                className="nav__link"
                onClick={(e) => {
                  e.preventDefault();
                  closeMenu();
                }}
              >
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className="header__actions">
          <label className="search">
            <input type="text" placeholder="What are you looking for?" />
            <Icon name="search" size={20} />
          </label>

          <Link to="/wishlist" className="icon-btn" aria-label="Wishlist" onClick={closeMenu}>
            <Icon name="heart" size={26} />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </Link>

          <Link to="/cart" className="icon-btn" aria-label="Cart" onClick={closeMenu}>
            <Icon name="cart" size={26} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>

          {user ? (
            <AccountMenu user={user} onLogout={onLogout} />
          ) : (
            <Link to="/login" className="icon-btn" aria-label="Log in" onClick={closeMenu}>
              <Icon name="user" size={26} />
            </Link>
          )}
        </div>

        <button
          type="button"
          className="burger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? "close" : "menu"} size={26} />
        </button>
      </div>
    </header>
  );
}
