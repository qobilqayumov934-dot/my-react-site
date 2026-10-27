import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import ProductGrid from "../components/ProductGrid";
import Status from "../components/Status";
import { SORT_OPTIONS } from "../data/data";
import { sortProducts } from "../utils/sort";

export default function ShopPage({ products, status, wishlist, onToggleWish, onAddToCart }) {
  // Сортировка и размер карточек живут в адресе (?sort=price-asc&view=small),
  // поэтому сохраняются при обновлении страницы и кнопке «назад»
  const [params, setParams] = useSearchParams();

  const sortParam = params.get("sort");
  const sortKey = SORT_OPTIONS.some((o) => o.value === sortParam) ? sortParam : "default";
  const size = params.get("view") === "small" ? "small" : "large";

  const sorted = useMemo(() => sortProducts(products, sortKey), [products, sortKey]);

  const setParam = (name, value, defaultValue) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === defaultValue) next.delete(name);
        else next.set(name, value);
        return next;
      },
      { replace: true }
    );

  return (
    <>
      <section id="products" className="shop">
        <div className="tag">
          <span className="tag__bar" />
          <span className="tag__text">All Products</span>
        </div>

        <Status status={status} />

        {status === "success" && (
          <>
            <div className="shop__toolbar">
              <p className="shop__count">
                {sorted.length} {sorted.length === 1 ? "product" : "products"}
              </p>

              <div className="shop__controls">
                <label className="shop__sort">
                  <span>Sort by</span>
                  <select value={sortKey} onChange={(e) => setParam("sort", e.target.value, "default")}>
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>

                <div className="shop__view" role="group" aria-label="Card size">
                  <button
                    type="button"
                    className={size === "large" ? "is-active" : ""}
                    aria-label="Large cards"
                    aria-pressed={size === "large"}
                    onClick={() => setParam("view", "large", "large")}
                  >
                    <Icon name="grid" size={18} />
                  </button>
                  <button
                    type="button"
                    className={size === "small" ? "is-active" : ""}
                    aria-label="Small cards"
                    aria-pressed={size === "small"}
                    onClick={() => setParam("view", "small", "large")}
                  >
                    <Icon name="apps" size={18} />
                  </button>
                </div>
              </div>
            </div>

            {sorted.length === 0 ? (
              <p className="status">No products yet.</p>
            ) : (
              <ProductGrid
                products={sorted}
                size={size}
                wishlist={wishlist}
                onToggleWish={onToggleWish}
                onAddToCart={onAddToCart}
              />
            )}
          </>
        )}
      </section>
    </>
  );
}
