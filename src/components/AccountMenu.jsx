import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";

// Иконка пользователя с выпадающим меню (когда вход выполнен)
export default function AccountMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Закрываем меню по клику/тапу вне него и по Escape
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="account" ref={ref}>
      <button
        type="button"
        className="icon-btn"
        aria-label="Account"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="user" size={26} />
        <span className="account__dot" />
      </button>

      {open && (
        <div className="account__menu">
          <p className="account__label">Signed in as</p>
          <p className="account__name">{user.name}</p>
          <Link to="/dashboard" className="account__link" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          <button
            type="button"
            className="btn-outline account__logout"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
