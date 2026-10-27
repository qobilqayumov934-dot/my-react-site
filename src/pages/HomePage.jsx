import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import Features from "../components/Features";
import ProductGrid from "../components/ProductGrid";
import Status from "../components/Status";
import { HOME_PRODUCTS_COUNT } from "../data/data";

const isFeatured = (p) => p.featured === true || p.featured === "true";

export default function HomePage({ products, status, wishlist, onToggleWish, onAddToCart }) {
  // На главной — не больше HOME_PRODUCTS_COUNT товаров: сначала те, у которых
  // в MockAPI стоит featured: true, иначе — первые товары из API.
  // Все остальные — на странице /shop.
  // Сортировка и переключение размера карточек есть только на /shop.
  const featured = products.filter(isFeatured);
  const homeProducts = (featured.length > 0 ? featured : products).slice(0, HOME_PRODUCTS_COUNT);

  return (
    <>
      <Hero />

      <section id="products" className="products">
        <div className="tag">
          <span className="tag__bar" />
          <span className="tag__text">Our Products</span>
        </div>

        <Status status={status} />

        {status === "success" && (
          <>
            <ProductGrid
              products={homeProducts}
              wishlist={wishlist}
              onToggleWish={onToggleWish}
              onAddToCart={onAddToCart}
            />
            <div className="products__more">
              <Link to="/shop" className="btn-red">More Products</Link>
            </div>
          </>
        )}
      </section>

      <Features />
    </>
  );
}
