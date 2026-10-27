import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthField from "../components/AuthField";
import { registerUser } from "../api/users";

const EMPTY = { name: "", username: "", email: "", phone_number: "", country: "", password: "" };

const CONFLICT_MESSAGES = {
  email: ["email", "This email is already registered"],
  username: ["username", "This username is taken"],
  phone: ["phone_number", "This phone number is already registered"],
};

export default function SignUpPage({ user, onLogin }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your name";
    if (!/^[A-Za-z0-9_.-]{3,24}$/.test(form.username.trim()))
      next.username = "3–24 characters: letters, digits, _ . -";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email";
    if (!/^\+?[0-9\s()-]{7,20}$/.test(form.phone_number.trim()) || form.phone_number.replace(/\D/g, "").length < 7)
      next.phone_number = "Enter a valid phone number";
    if (form.password.length < 6) next.password = "At least 6 characters";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const next = validate();
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const result = await registerUser(form);
      if (result.conflict) {
        const [field, message] = CONFLICT_MESSAGES[result.conflict];
        setErrors({ [field]: message });
      } else {
        onLogin(result.user); // сразу входим в созданный аккаунт
      }
    } catch (err) {
      console.error("Sign up failed:", err);
      setFormError("Could not create the account. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="auth__title">Create an account</h1>
      <p className="auth__subtitle">Enter your details below</p>

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <AuthField label="Name" error={errors.name}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} autoComplete="name" maxLength={80} />
        </AuthField>
        <AuthField label="Username" error={errors.username}>
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} autoComplete="username" maxLength={24} />
        </AuthField>
        <AuthField label="Email" error={errors.email}>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} autoComplete="email" maxLength={100} />
        </AuthField>
        <AuthField label="Phone number" error={errors.phone_number}>
          <input name="phone_number" type="tel" placeholder="Phone Number" value={form.phone_number} onChange={handleChange} autoComplete="tel" maxLength={20} />
        </AuthField>
        <AuthField label="Country (optional)" error={errors.country}>
          <input name="country" placeholder="Country (optional)" value={form.country} onChange={handleChange} autoComplete="country-name" maxLength={60} />
        </AuthField>
        <AuthField label="Password" error={errors.password}>
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} autoComplete="new-password" maxLength={64} />
        </AuthField>

        {formError && <p className="form__error" role="alert">{formError}</p>}

        <button type="submit" className="btn-red auth__submit" disabled={submitting}>
          {submitting ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="auth__switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
}
