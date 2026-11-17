import { useEffect, useRef, useState } from "react";
import PawTrails from "./PawTrails";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SUBMIT_DELAY = 500;

function validateIdentifier(value) {
  const identifier = value.trim();
  if (!identifier) return "Saisissez votre email ou identifiant.";
  if (identifier.includes("@") && !EMAIL_PATTERN.test(identifier)) {
    return "Saisissez une adresse email valide.";
  }
  if (!identifier.includes("@") && identifier.length < 3) {
    return "L’identifiant doit contenir au moins 3 caractères.";
  }
  return "";
}

function validatePassword(value) {
  if (!value) return "Saisissez votre mot de passe.";
  if (value.length < 6) return "Le mot de passe doit contenir au moins 6 caractères.";
  return "";
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}

function HotelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

const BENEFITS = [
  { icon: HeartIcon, label: "Retrouvez vos favoris" },
  { icon: CartIcon, label: "Suivez votre panier" },
  { icon: HotelIcon, label: "Réservez l’hôtel facilement" },
];

function Login({ login, goTo }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ identifier: "", password: "" });
  const [touched, setTouched] = useState({ identifier: false, password: false });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const identifierRef = useRef(null);
  const passwordRef = useRef(null);
  const submitTimer = useRef(null);

  useEffect(() => () => clearTimeout(submitTimer.current), []);

  const clearFormError = () => {
    if (formError) setFormError("");
  };

  const handleIdentifierChange = (event) => {
    const value = event.target.value;
    setIdentifier(value);
    clearFormError();
    setFieldErrors((current) => ({
      ...current,
      identifier: touched.identifier ? validateIdentifier(value) : current.identifier,
    }));
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    clearFormError();
    setFieldErrors((current) => ({
      ...current,
      password: touched.password ? validatePassword(value) : current.password,
    }));
  };

  const validateField = (field) => {
    setTouched((current) => ({ ...current, [field]: true }));
    if (field === "identifier") {
      setFieldErrors((current) => ({
        ...current,
        identifier: validateIdentifier(identifier),
      }));
      return;
    }
    setFieldErrors((current) => ({
      ...current,
      password: validatePassword(password),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = {
      identifier: validateIdentifier(identifier),
      password: validatePassword(password),
    };
    setTouched({ identifier: true, password: true });
    setFieldErrors(nextErrors);
    setFormError("");

    if (nextErrors.identifier || nextErrors.password) {
      if (nextErrors.identifier) identifierRef.current?.focus();
      else passwordRef.current?.focus();
      return;
    }

    setSubmitting(true);
    submitTimer.current = setTimeout(() => {
      let message = "";
      try {
        message = login(identifier.trim(), password);
      } catch (error) {
        message = "Une erreur est survenue. Réessayez dans un instant.";
      }
      setSubmitting(false);

      if (message) {
        setFormError(message);
        identifierRef.current?.focus();
      }
    }, SUBMIT_DELAY);
  };

  const identifierError = fieldErrors.identifier;
  const passwordError = fieldErrors.password;

  return (
    <section className="auth-section auth-section--login" aria-labelledby="login-title">
      <PawTrails variant="auth" />

      <div className="login-layout">
        <div className="login-visual" aria-hidden="true">
          <img
            src="/images/poster.jpg"
            alt=""
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/cat-shopping.png";
            }}
          />
          <span className="login-visual__mark">MichaLand</span>
        </div>

        <form
          className="login-card"
          onSubmit={handleSubmit}
          aria-labelledby="login-title"
          aria-busy={submitting}
          noValidate
        >
          <div className="login-card__header">
            <h2 id="login-title" className="login-card__title">Connexion</h2>
            <p className="login-card__intro">
              Accédez à vos favoris, votre panier et vos réservations.
            </p>
          </div>

          <div className={`form-group login-field${identifierError ? " login-field--error" : ""}`}>
            <label className="form-label" htmlFor="login-email">Email ou identifiant</label>
            <input
              ref={identifierRef}
              className={`input login-field__input${identifierError ? " input--error" : ""}`}
              id="login-email"
              type="text"
              value={identifier}
              onChange={handleIdentifierChange}
              onBlur={() => validateField("identifier")}
              aria-invalid={identifierError ? "true" : "false"}
              aria-describedby={identifierError ? "login-email-error" : undefined}
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              inputMode="email"
              required
            />
            {identifierError && (
              <p className="form-error login-field__error" id="login-email-error" role="alert">
                {identifierError}
              </p>
            )}
          </div>

          <div className={`form-group login-field${passwordError ? " login-field--error" : ""}`}>
            <label className="form-label" htmlFor="login-password">Mot de passe</label>
            <input
              ref={passwordRef}
              className={`input login-field__input${passwordError ? " input--error" : ""}`}
              id="login-password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => validateField("password")}
              aria-invalid={passwordError ? "true" : "false"}
              aria-describedby={passwordError ? "login-password-error" : undefined}
              autoComplete="current-password"
              required
            />
            {passwordError && (
              <p className="form-error login-field__error" id="login-password-error" role="alert">
                {passwordError}
              </p>
            )}
          </div>

          {formError && (
            <p className="form-error login-card__form-error" role="alert">
              {formError}
            </p>
          )}

          <button
            className="btn btn--primary btn--block login-card__submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="login-card__spinner" aria-hidden="true" />
                Connexion en cours…
              </>
            ) : (
              "Se connecter"
            )}
          </button>
          <span className="sr-only" role="status" aria-live="polite">
            {submitting ? "Connexion en cours" : ""}
          </span>

          <p className="auth__link login-card__link">
            Pas de compte ?{" "}
            <button type="button" className="link-btn" onClick={() => goTo("register")}>
              S'inscrire
            </button>
          </p>
        </form>

        <aside className="login-benefits" aria-labelledby="login-benefits-title">
          <span className="login-benefits__label">MichaLand</span>
          <h3 id="login-benefits-title" className="login-benefits__title">Tout pour vos compagnons</h3>
          <ul className="login-benefits__list">
            {BENEFITS.map(({ icon: Icon, label }) => (
              <li key={label} className="login-benefits__item">
                <span className="login-benefits__icon"><Icon /></span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
          <button type="button" className="login-benefits__link" onClick={() => goTo("products")}>
            Découvrir nos produits <span aria-hidden="true">→</span>
          </button>
        </aside>
      </div>
    </section>
  );
}

export default Login;
