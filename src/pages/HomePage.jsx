import { Icon } from "../components/Icon";
import Hero from "../components/Hero";
import Features from "../components/Features";
import ProductGrid from "../components/ProductGrid";
import Status from "../components/Status";

export default function HomePage({ products, status, wishlist, onToggleWish, onAddToCart }) {
  return (
    <>
      <Hero />

      <section id="products" className="products">
        <div className="tag">
          <span className="tag__bar" />
          <span className="tag__text">Our Products</span>
        </div>

        <div className="products__arrows">
          <button type="button" className="arrow" aria-label="Previous">
            <Icon name="left" size={20} />
          </button>
          <button type="button" className="arrow" aria-label="Next">
            <Icon name="right" size={20} />
          </button>
        </div>

        <Status status={status} />

        {status === "success" && (
          <>
            <ProductGrid
              products={products}
              wishlist={wishlist}
              onToggleWish={onToggleWish}
              onAddToCart={onAddToCart}
            />
            <div className="products__more">
              <button type="button" className="btn-red">View All Products</button>
            </div>
          </>
        )}
      </section>

      <Features />
    </>
  );
}
