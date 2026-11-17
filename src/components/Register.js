import { useState } from "react";
import { checkPassword, checkPhone, checkName } from "../validation";

function Register({ register, goTo }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = checkName(form.name, "Nom complet") || checkPhone(form.phone) || checkPassword(form.password);
    if (message) {
      setError(message);
      return;
    }
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    const registerError = register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
    setError(registerError);
  };

  return (
    <section className="section" aria-labelledby="register-title">
      <div className="auth-layout">
        <div className="auth__image" aria-hidden="true">
          <img src="/images/cart-cat.jpg" alt="Micha" onError={(e) => { e.target.onerror = null; e.target.src = "/images/cat-shopping.png"; }} />
        </div>
        <form className="auth__form" onSubmit={handleSubmit} aria-labelledby="register-title">
          <h2 id="register-title" className="auth__title">Créer un compte</h2>
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Nom complet</label>
            <input className="input" id="register-name" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email</label>
            <input className="input" id="register-email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="register-phone">Téléphone</label>
            <input className="input" id="register-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Mot de passe</label>
            <input className="input" id="register-password" name="password" type="password" placeholder="Min 6 caractères, 1 MAJUSCULE, 1 minuscule" value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm">Confirmer le mot de passe</label>
            <input className="input" id="register-confirm" name="confirm" type="password" value={form.confirm} onChange={handleChange} required />
          </div>
          {error && <p className="form-error" role="alert">⚠️ {error}</p>}
          <button className="btn btn--primary btn--block" type="submit">S'inscrire</button>
          <p className="auth__link">
            Déjà un compte ? <button type="button" className="link-btn" onClick={() => goTo("login")}>Se connecter</button>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Register;