// Поле формы в стиле макета (линия снизу). label виден только скринридерам,
// для обычных пользователей роль подписи играет placeholder.
export default function AuthField({ label, error, children }) {
  return (
    <label className={error ? "auth-field auth-field--error" : "auth-field"}>
      <span className="visually-hidden">{label}</span>
      {children}
      {error && <span className="field__error">{error}</span>}
    </label>
  );
}
