import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { getProductKey } from "../api/products";

const MAX_RESULTS = 6;

// Ищем по названию и по категории, без учёта регистра.
// Сначала товары, у которых название НАЧИНАЕТСЯ с запроса, потом где он внутри названия, потом по категории.
function searchProducts(products, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const found = [];
  for (const product of products) {
    const name = String(product.name ?? "").toLowerCase();
    const category = String(product.category ?? "").toLowerCase();
    const at = name.indexOf(q);
    if (at === -1 && !category.includes(q)) continue;
    found.push({ product, rank: at === 0 ? 0 : at > 0 ? 1 : 2 });
  }
  return found.sort((a, b) => a.rank - b.rank).map((x) => x.product);
}

export default function SearchBox({ products, status, onNavigate }) {
  const navigate = useNavigate();
  const listId = useId();
  const boxRef = useRef(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1); // подсвеченная стрелками подсказка

  const matches = useMemo(
    () => (status === "success" ? searchProducts(products, query) : []),
    [products, status, query]
  );
  const shown = matches.slice(0, MAX_RESULTS);
  const expanded = open && query.trim().length > 0;

  // Клик или тап вне поиска закрывает список
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const openProduct = (product) => {
    setQuery("");
    setOpen(false);
    setActive(-1);
    onNavigate?.(); // на телефоне закрывает бургер-меню
    navigate(`/product/${encodeURIComponent(getProductKey(product))}`);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setOpen(true);
    setActive(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!expanded || shown.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % shown.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? shown.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      openProduct(shown[active >= 0 ? active : 0]); // Enter без выбора открывает первый результат
    }
  };

  return (
    <div className="search-box" ref={boxRef}>
      <label className="search">
        <input
          type="text"
          role="combobox"
          aria-label="Search products"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          placeholder="What are you looking for?"
          autoComplete="off"
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <Icon name="search" size={20} />
      </label>

      {expanded && (
        <div className="search-results">
          {status === "loading" && <p className="search-results__msg" role="status">Loading products…</p>}
          {status === "error" && <p className="search-results__msg" role="status">Search is unavailable right now.</p>}
          {status === "success" && shown.length === 0 && (
            <p className="search-results__msg" role="status">No products found for “{query.trim()}”</p>
          )}

          {shown.length > 0 && (
            <ul id={listId} role="listbox" className="search-results__list" aria-label="Search results">
              {shown.map((p, i) => (
                <li
                  key={getProductKey(p)}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className={i === active ? "result is-active" : "result"}
                  onMouseDown={(e) => e.preventDefault()} // не терять фокус поля
                  onMouseEnter={() => setActive(i)}
                  onClick={() => openProduct(p)}
                >
                  <span className="result__thumb">
                    {p.image ? (
                      <img src={p.image} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    ) : (
                      <span aria-hidden="true">🛍️</span>
                    )}
                  </span>

                  <span className="result__body">
                    <span className="result__name">
                      {p.name}
                      {p.isNew && <span className="tag-new">NEW</span>}
                    </span>
                    <span className="result__meta">
                      {p.category} · ★ {p.rating} ({p.reviews})
                    </span>
                  </span>

                  <span className="result__price">${p.price}</span>
                </li>
              ))}
            </ul>
          )}

          {matches.length > shown.length && (
            <p className="search-results__more">
              Showing {shown.length} of {matches.length} — keep typing to narrow down
            </p>
          )}
        </div>
      )}
    </div>
  );
}
