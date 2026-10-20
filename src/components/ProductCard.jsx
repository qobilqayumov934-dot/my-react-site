import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import Stars from "./Stars";
import { getProductKey } from "../api/products";

export default function ProductCard({ product, wished, onWish, onAdd }) {
  const [imgFailed, setImgFailed] = useState(false);
  const key = getProductKey(product);
  const url = `/product/${encodeURIComponent(key)}`;

  return (
    <article className="card">
      <div className="card__media">
        <Link to={url} className="card__image-link" aria-label={product.name}>
          {product.image && !imgFailed ? (
            <img
              className="card__img"
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <span className="card__fallback" aria-hidden="true">🛍️</span>
          )}
        </Link>

        {product.isNew && <span className="card__badge">NEW</span>}

        <div className="card__tools">
          <button
            type="button"
            className={wished ? "tool is-active" : "tool"}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wished}
            onClick={() => onWish(key)}
          >
            <Icon name="heart" size={18} filled={wished} />
          </button>
          <Link to={url} className="tool" aria-label="View details">
            <Icon name="eye" size={18} />
          </Link>
        </div>

        <button type="button" className="card__add" onClick={() => onAdd(key, 1)}>
          Add To Cart
        </button>
      </div>

      <h3 className="card__name">
        <Link to={url}>{product.name}</Link>
      </h3>
      <div className="card__meta">
        <span className="card__price">${product.price}</span>
        <Stars value={product.rating} />
        <span className="card__reviews">({product.reviews})</span>
      </div>
    </article>
  );
}
