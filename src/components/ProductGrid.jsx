import ProductCard from "./ProductCard";
import { getProductKey } from "../api/products";

export default function ProductGrid({ products, wishlist, onToggleWish, onAddToCart, size = "large" }) {
  return (
    <div className={size === "small" ? "grid grid--small" : "grid"}>
      {products.map((p) => {
        const key = getProductKey(p);
        return (
          <ProductCard
            key={key}
            product={p}
            wished={wishlist.includes(key)}
            onWish={onToggleWish}
            onAdd={onAddToCart}
          />
        );
      })}
    </div>
  );
}
