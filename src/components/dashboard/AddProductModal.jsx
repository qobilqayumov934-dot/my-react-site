import { useEffect, useState } from "react";
import { createProduct } from "../../api/products";

const EMPTY = { name: "", price: "", category: "", image: "", rating: "5", reviews: "0", isNew: false };

export default function AddProductModal({ categories, onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Escape закрывает окно
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter a product name";
    if (!(Number(form.price) > 0)) next.price = "Price must be above 0";
    if (!form.category.trim()) next.category = "Enter a category";
    if (form.image.trim() && !/^https?:\/\//i.test(form.image.trim())) next.image = "Use a full link starting with http(s)://";
    const rating = Number(form.rating);
    if (form.rating === "" || Number.isNaN(rating) || rating < 0 || rating > 5) next.rating = "0 to 5";
    const reviews = Number(form.reviews);
    if (form.reviews === "" || !Number.isInteger(reviews) || reviews < 0) next.reviews = "Whole number, 0 or more";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const next = validate();
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      const created = await createProduct({
        name: form.name.trim(),
        price: Number(form.price),
        rating: Number(form.rating),
        reviews: Number(form.reviews),
        isNew: form.isNew,
        category: form.category.trim(),
        image: form.image.trim(),
      });
      onCreated(created);
      onClose();
    } catch (err) {
      console.error("Could not create product:", err);
      setFormError("Could not save the product. Please try again.");
      setSaving(false);
    }
  };

  const field = (label, name, props = {}) => (
    <label className={errors[name] ? "field field--error" : "field"}>
      <span>{label}</span>
      <input name={name} value={form[name]} onChange={handleChange} {...props} />
      {errors[name] && <span className="field__error">{errors[name]}</span>}
    </label>
  );

  return (
    <div className="modal" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form
        className="modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 id="add-product-title" className="modal__title">Add product</h2>

        {field("Name *", "name", { autoFocus: true, maxLength: 100 })}
        <div className="modal__row">
          {field("Price *", "price", { type: "number", min: "0", step: "any", inputMode: "decimal" })}
          {field("Category *", "category", { list: "product-categories", maxLength: 40 })}
        </div>
        <datalist id="product-categories">
          {categories.map((c) => <option key={c} value={c} />)}
        </datalist>
        {field("Image link", "image", { placeholder: "https://…", maxLength: 500 })}
        <div className="modal__row">
          {field("Rating (0–5)", "rating", { type: "number", min: "0", max: "5", step: "0.5" })}
          {field("Reviews", "reviews", { type: "number", min: "0", step: "1" })}
        </div>
        <label className="modal__check">
          <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} />
          Mark as NEW
        </label>

        {formError && <p className="form__error" role="alert">{formError}</p>}

        <div className="modal__actions">
          <button type="button" className="dash-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="dash-btn dash-btn--green" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
