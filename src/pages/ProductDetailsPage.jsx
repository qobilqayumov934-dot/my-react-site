import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import Stars from "../components/Stars";
import Status from "../components/Status";
import { getProductKey } from "../api/products";
import { OPTIONS_BY_CATEGORY } from "../data/data";

function Details({ product, wished, onToggleWish, onAddToCart }) {
  const images = product.images?.length ? product.images : [product.image].filter(Boolean);
  const options = OPTIONS_BY_CATEGORY[product.category] ?? {};
  const colors = product.colors ?? options.colors ?? [];
  const sizes = product.sizes ?? options.sizes ?? [];
  const description =
    product.description ??
    `${product.name} — quality ${String(product.category ?? "product").toLowerCase()} with fast delivery, easy returns and 24/7 customer support.`;

  const [imageIndex, setImageIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
  const [color, setColor] = useState(colors[0]);
  const [size, setSize] = useState(sizes[Math.floor(sizes.length / 2)]);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  const mainImage = images[imageIndex];

  return (
    <section>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <span>Account</span>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <strong>{product.name}</strong>
      </nav>

      <div className="details">
        {/* ---- Галерея ---- */}
        <div className="gallery">
          {images.length > 1 && (
            <div className="gallery__thumbs">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={i === imageIndex ? "thumb is-active" : "thumb"}
                  aria-label={`Image ${i + 1}`}
                  onClick={() => {
                    setImageIndex(i);
                    setImgFailed(false);
                  }}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}

          <div className="gallery__main">
            {mainImage && !imgFailed ? (
              <img src={mainImage} alt={product.name} onError={() => setImgFailed(true)} />
            ) : (
              <span className="card__fallback" aria-hidden="true">🛍️</span>
            )}
          </div>
        </div>

        {/* ---- Информация ---- */}
        <div className="info">
          <h1 className="info__title">{product.name}</h1>

          <div className="info__rating">
            <Stars value={product.rating} />
            <span className="info__reviews">({product.reviews} Reviews)</span>
            <span className="info__divider" />
            <span className="info__stock">In Stock</span>
          </div>

          <p className="info__price">${Number(product.price).toFixed(2)}</p>
          <p className="info__text">{description}</p>

          {colors.length > 0 && (
            <div className="option">
              <span>Colours:</span>
              <div className="swatches">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={c === color ? "swatch is-active" : "swatch"}
                    style={{ background: c }}
                    aria-label={`Colour ${c}`}
                    aria-pressed={c === color}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="option">
              <span>Size:</span>
              <div className="sizes">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={s === size ? "size is-active" : "size"}
                    aria-pressed={s === size}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="buy">
            <div className="qty">
              <button type="button" aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <Icon name="minus" size={20} />
              </button>
              <output aria-live="polite">{qty}</output>
              <button type="button" aria-label="Increase" onClick={() => setQty((q) => q + 1)}>
                <Icon name="plus" size={20} />
              </button>
            </div>

            <button type="button" className="btn-red" onClick={() => {
                onAddToCart(getProductKey(product), qty);
                navigate("/cart");
              }}>
              Buy Now
            </button>

            <button
              type="button"
              className={wished ? "wish-btn is-active" : "wish-btn"}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wished}
              onClick={() => onToggleWish(getProductKey(product))}
            >
              <Icon name="heart" size={20} filled={wished} />
            </button>
          </div>

          <div className="delivery">
            <div className="delivery__row">
              <Icon name="truck" size={36} />
              <div>
                <p className="delivery__title">Free Delivery</p>
                <p className="delivery__text"><u>Enter your postal code for Delivery Availability</u></p>
              </div>
            </div>
            <div className="delivery__row">
              <Icon name="refresh" size={36} />
              <div>
                <p className="delivery__title">Return Delivery</p>
                <p className="delivery__text">Free 30 Days Delivery Returns. <u>Details</u></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProductDetailsPage({ products, status, wishlist, onToggleWish, onAddToCart }) {
  const { id } = useParams();

  if (status !== "success") return <Status status={status} />;

  const product = products.find((p) => getProductKey(p) === id);

  if (!product) {
    return (
      <div className="empty">
        <p>Product not found.</p>
        <Link to="/" className="btn-red">Back to shop</Link>
      </div>
    );
  }

  // key={id}: при переходе на другой товар состояние (цвет, размер, количество) сбрасывается
  return (
    <Details
      key={id}
      product={product}
      wished={wishlist.includes(id)}
      onToggleWish={onToggleWish}
      onAddToCart={onAddToCart}
    />
  );
}
