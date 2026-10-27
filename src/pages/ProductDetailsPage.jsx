import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import ProductGrid from "../components/ProductGrid";
import Stars from "../components/Stars";
import Status from "../components/Status";
import { getProductKey } from "../api/products";
import { OPTIONS_BY_CATEGORY } from "../data/data";

const RELATED_COUNT = 8;

// В новом API категории записаны строчными буквами (electronic, clothing),
// а OPTIONS_BY_CATEGORY использует старые названия. Приводим их к одному виду.
const CATEGORY_ALIASES = {
  electronic: "Electronics",
  electronics: "Electronics",
  clothing: "Fashion",
  fashion: "Fashion",
  sports: "Sports",
  gaming: "Gaming",
  toys: "Toys",
};

const words = (value) =>
  String(value ?? "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2);

// Насколько товар-кандидат похож на текущий:
// главный вес — та же категория, затем общие слова в названии,
// затем близость цены и рейтинга.
function similarityScore(current, candidate) {
  const currentCategory = String(current.category ?? "").toLowerCase();
  const candidateCategory = String(candidate.category ?? "").toLowerCase();
  let score = currentCategory && currentCategory === candidateCategory ? 1000 : 0;

  const currentWords = new Set(words(current.name));
  score += words(candidate.name).filter((word) => currentWords.has(word)).length * 100;

  const priceA = Number(current.price) || 0;
  const priceB = Number(candidate.price) || 0;
  score += 50 * (1 - Math.abs(priceA - priceB) / Math.max(priceA, priceB, 1));

  const ratingA = Number(current.rating) || 0;
  const ratingB = Number(candidate.rating) || 0;
  score += 20 * (1 - Math.abs(ratingA - ratingB) / 5);

  return score;
}

// Берём не больше RELATED_COUNT товаров, самых похожих на текущий.
function getRelatedProducts(products, current, limit = RELATED_COUNT) {
  const currentKey = getProductKey(current);

  return products
    .filter((product) => getProductKey(product) !== currentKey)
    .map((product) => ({ product, score: similarityScore(current, product) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.product);
}

function Details({ product, wished, onToggleWish, onAddToCart }) {
  const images = product.images?.length ? product.images : [product.image].filter(Boolean);
  const categoryKey =
    CATEGORY_ALIASES[String(product.category ?? "").toLowerCase()] ?? product.category;
  const options = OPTIONS_BY_CATEGORY[categoryKey] ?? {};
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

  const related = getRelatedProducts(products, product);

  // key={id}: при переходе на другой товар состояние (цвет, размер, количество) сбрасывается
  return (
    <>
      <Details
        key={id}
        product={product}
        wished={wishlist.includes(id)}
        onToggleWish={onToggleWish}
        onAddToCart={onAddToCart}
      />

      {related.length > 0 && (
        <section className="related" aria-label="Related products">
          <div className="tag">
            <span className="tag__bar" />
            <span className="tag__text">Related Items</span>
          </div>

          <ProductGrid
            products={related}
            wishlist={wishlist}
            onToggleWish={onToggleWish}
            onAddToCart={onAddToCart}
          />
        </section>
      )}
    </>
  );
}
