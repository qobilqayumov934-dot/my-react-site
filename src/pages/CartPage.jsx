import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import Status from "../components/Status";
import { getProductKey } from "../api/products";
import { sendOrderToTelegram, makeOrderNumber, NOT_CONFIGURED } from "../api/telegram";
import { formatPrice } from "../utils/format";

const EMPTY_FORM = { name: "", phone: "", address: "", comment: "" };

function CartRow({ line, onSetQty, onRemove }) {
  const { product, qty } = line;
  const key = getProductKey(product);
  const url = `/product/${encodeURIComponent(key)}`;

  return (
    <div className="cart-row">
      <div className="cart-row__product">
        <Link to={url} className="cart-row__thumb" aria-label={product.name}>
          {product.image ? <img src={product.image} alt="" /> : <span aria-hidden="true">🛍️</span>}
        </Link>
        <Link to={url} className="cart-row__name">{product.name}</Link>
      </div>

      <span className="cart-row__price">{formatPrice(product.price)}</span>

      <div className="qty qty--sm cart-row__qty">
        <button type="button" aria-label="Decrease" onClick={() => onSetQty(key, qty - 1)}>
          <Icon name="minus" size={16} />
        </button>
        <output aria-live="polite">{qty}</output>
        <button type="button" aria-label="Increase" onClick={() => onSetQty(key, qty + 1)}>
          <Icon name="plus" size={16} />
        </button>
      </div>

      <span className="cart-row__subtotal">{formatPrice(product.price * qty)}</span>

      <button
        type="button"
        className="cart-row__remove"
        aria-label={`Remove ${product.name}`}
        onClick={() => onRemove(key)}
      >
        <Icon name="close" size={18} />
      </button>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className={error ? "field field--error" : "field"}>
      <span>{label}</span>
      {children}
      {error && <span className="field__error">{error}</span>}
    </label>
  );
}

const PHONE_RE = /^\+?[0-9\s()-]{7,20}$/;

export default function CartPage({ status, cartLines, onSetQty, onRemove, onClear, onOrderPlaced, user }) {
  // Если пользователь вошёл — заранее подставляем его имя и телефон
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    name: user?.name ?? "",
    phone: PHONE_RE.test(user?.phone_number ?? "") ? user.phone_number : "",
  }));
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [orderNumber, setOrderNumber] = useState(null);

  const total = cartLines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your name";
    if (!/^\+?[0-9\s()-]{7,20}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number";
    if (form.address.trim().length < 5) next.address = "Enter your delivery address";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    setSendError("");
    const number = makeOrderNumber();

    try {
      await sendOrderToTelegram({ orderNumber: number, customer: form, lines: cartLines, total });
      onOrderPlaced?.({ number, customer: form, lines: cartLines, total }); // попадёт в раздел Orders панели
      setOrderNumber(number);
      setForm(EMPTY_FORM);
      onClear();
    } catch (err) {
      console.error("Order was not sent:", err);
      const reason =
        err.message === NOT_CONFIGURED
          ? "Telegram is not configured: add TOKEN and USER_ID to .env, add envPrefix to vite.config.js and restart the dev server."
          : err.message;
      setSendError(
        "We could not send your order. Please try again in a minute." +
          (import.meta.env.DEV ? ` (${reason})` : "")
      );
    } finally {
      setSending(false);
    }
  };

  // ---- Заказ оформлен ----
  if (orderNumber) {
    return (
      <section className="order-done">
        <span className="order-done__icon"><Icon name="shield" size={36} /></span>
        <h1 className="page-title">Thank you! Your order is placed</h1>
        <p>
          Order number: <strong className="order-done__number">#{orderNumber}</strong>
        </p>
        <p>We have received it and will contact you by phone shortly.</p>
        <Link to="/" className="btn-red">Continue shopping</Link>
      </section>
    );
  }

  if (status !== "success") return <Status status={status} />;

  // ---- Пустая корзина ----
  if (cartLines.length === 0) {
    return (
      <div className="empty">
        <p>Your cart is empty.</p>
        <Link to="/" className="btn-red">Go shopping</Link>
      </div>
    );
  }

  return (
    <section className="cart">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <strong>Cart</strong>
      </nav>

      <div className="cart__layout">
        <div className="cart__items">
          <div className="cart__head" aria-hidden="true">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
            <span />
          </div>

          {cartLines.map((line) => (
            <CartRow
              key={getProductKey(line.product)}
              line={line}
              onSetQty={onSetQty}
              onRemove={onRemove}
            />
          ))}

          <div className="cart__actions">
            <Link to="/" className="btn-outline">Return To Shop</Link>
            <button type="button" className="btn-outline" onClick={onClear}>Clear Cart</button>
          </div>
        </div>

        <aside className="checkout">
          <h2 className="checkout__title">Cart Total</h2>
          <div className="checkout__row"><span>Subtotal:</span><span>{formatPrice(total)}</span></div>
          <div className="checkout__row"><span>Shipping:</span><span>Free</span></div>
          <div className="checkout__row checkout__row--total">
            <span>Total:</span><span>{formatPrice(total)}</span>
          </div>

          <form className="form" onSubmit={handleSubmit} noValidate>
            <Field label="Name *" error={errors.name}>
              <input name="name" value={form.name} onChange={handleChange} autoComplete="name" maxLength={80} />
            </Field>
            <Field label="Phone *" error={errors.phone}>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                placeholder="+998 90 123 45 67"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                maxLength={20}
              />
            </Field>
            <Field label="Delivery address *" error={errors.address}>
              <input name="address" value={form.address} onChange={handleChange} autoComplete="street-address" maxLength={200} />
            </Field>
            <Field label="Comment">
              <textarea name="comment" rows={3} value={form.comment} onChange={handleChange} maxLength={500} />
            </Field>

            {sendError && <p className="form__error" role="alert">{sendError}</p>}

            <button type="submit" className="btn-red" disabled={sending}>
              {sending ? "Sending…" : "Place Order"}
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
}
