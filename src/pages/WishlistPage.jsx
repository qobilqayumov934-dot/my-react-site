import { Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import Status from "../components/Status";
import { getProductKey } from "../api/products";

export default function WishlistPage({ products, status, wishlist, onToggleWish, onAddToCart }) {
  // Только те товары, у которых нажато сердечко
  const liked = products.filter((p) => wishlist.includes(getProductKey(p)));

  return (
    <section className="wishlist">
      <div className="page-head">
        <h1 className="page-title">Wishlist ({status === "success" ? liked.length : wishlist.length})</h1>
      </div>

      <Status status={status} />

      {status === "success" && liked.length === 0 && (
        <div className="empty">
          <p>Your wishlist is empty. Tap the heart on any product to save it here.</p>
          <Link to="/" className="btn-red">Go shopping</Link>
        </div>
      )}

      {status === "success" && liked.length > 0 && (
        <ProductGrid
          products={liked}
          wishlist={wishlist}
          onToggleWish={onToggleWish}
          onAddToCart={onAddToCart}
        />
      )}
    </section>
  );
}
