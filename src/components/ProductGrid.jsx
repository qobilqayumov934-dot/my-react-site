import ProductCard from "./ProductCard";
import { getProductKey } from "../api/products";

export default function ProductGrid({ products, wishlist, onToggleWish, onAddToCart }) {
  return (
    <div className="grid">
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
