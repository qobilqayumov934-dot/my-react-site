import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthField from "../components/AuthField";
import { loginUser } from "../api/users";

export default function LoginPage({ user, onLogin }) {
  const [form, setForm] = useState({ login: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Уже вошёл — в панель управления
  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const next = {};
    if (!form.login.trim()) next.login = "Enter your email or phone number";
    if (!form.password) next.password = "Enter your password";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const found = await loginUser(form.login.trim(), form.password);
      if (found) onLogin(found);
      else setFormError("Wrong email / phone number or password");
    } catch (err) {
      console.error("Login failed:", err);
      setFormError("Could not reach the server. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="auth__title">Log in to Exclusive</h1>
      <p className="auth__subtitle">Enter your details below</p>

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <AuthField label="Email or phone number" error={errors.login}>
          <input
            name="login"
            placeholder="Email or Phone Number"
            value={form.login}
            onChange={handleChange}
            autoComplete="username"
          />
        </AuthField>

        <AuthField label="Password" error={errors.password}>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </AuthField>

        {formError && <p className="form__error" role="alert">{formError}</p>}

        <div className="auth__row">
          <button type="submit" className="btn-red" disabled={submitting}>
            {submitting ? "Logging in…" : "Log In"}
          </button>
          <a href="#" className="auth__forgot" onClick={(e) => e.preventDefault()}>
            Forget Password?
          </a>
        </div>
      </form>

      <p className="auth__switch">
        Don&apos;t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </AuthLayout>
  );
}
