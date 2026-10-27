import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import PageHeader from "../../components/dashboard/PageHeader";
import AddProductModal from "../../components/dashboard/AddProductModal";
import { getProductKey } from "../../api/products";

function ProductRow({ product, onOpen }) {
  const url = `/product/${encodeURIComponent(getProductKey(product))}`;

  return (
    <tr
      className="is-clickable"
      // Клик по любому месту строки открывает страницу товара.
      // Клик по самой ссылке обрабатывает Link, поэтому здесь его пропускаем.
      onClick={(e) => {
        if (!e.target.closest("a")) onOpen(url);
      }}
    >
      <td>
        <div className="cell-user">
          <span className="thumb-sm">
            {product.image ? (
              <img src={product.image} alt="" loading="lazy" />
            ) : (
              <span aria-hidden="true">🛍️</span>
            )}
          </span>
          <div className="cell-main">
            <Link to={url} className="cell-link">{product.name}</Link>
            {product.isNew && <span className="tag-new">NEW</span>}
          </div>
        </div>
      </td>
      <td>{product.category || "—"}</td>
      <td className="t-green">${product.price}</td>
      <td>★ {product.rating}</td>
      <td>{product.reviews}</td>
    </tr>
  );
}

export default function ProductsPage() {
  const { products, productsStatus, onProductCreated } = useOutletContext();
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <>
      <PageHeader title="Products">
        <button type="button" className="dash-btn dash-btn--green" onClick={() => setAdding(true)}>
          Add
        </button>
      </PageHeader>

      {productsStatus === "loading" && <p className="dash__status">Loading products…</p>}
      {productsStatus === "error" && (
        <p className="dash__status dash__status--error">Could not load products. Try again later.</p>
      )}

      {productsStatus === "success" && (
        <div className="dash-scroll">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Reviews</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <ProductRow key={getProductKey(p)} product={p} onOpen={navigate} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {adding && (
        <AddProductModal
          categories={categories}
          onClose={() => setAdding(false)}
          onCreated={onProductCreated}
        />
      )}
    </>
  );
}
