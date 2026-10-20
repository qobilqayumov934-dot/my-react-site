// Общий макет для входа и регистрации: картинка слева, форма справа.
// Картинка лежит в public/2.png
export default function AuthLayout({ children }) {
  return (
    <section className="auth">
      <div className="auth__media" aria-hidden="true">
        <img src="/2.png" alt="" />
      </div>
      <div className="auth__panel">{children}</div>
    </section>
  );
}
