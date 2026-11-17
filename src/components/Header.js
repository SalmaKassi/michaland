import { useState } from "react";

function Header({ page, category, cartCount = 0, goTo, openCategory, search, handleSearch, wishlistCount, user, isAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // returns "active" when the menu item matches the current page
  const active = (name) => {
    if (name === "home") return page === "home" ? "nav__item--active" : "";
    if (name === "cats" || name === "dogs" || name === "birds")
      return page === "products" && category === name ? "nav__item--active" : "";
    return page === name ? "nav__item--active" : "";
  };

  const profileTarget = user ? (isAdmin ? "dashboard" : "profile") : "login";
  const profileLabel = user ? (isAdmin ? "Tableau de bord" : "Mon compte") : "Connexion";

  const navigate = (action) => {
    setMenuOpen(false);
    action();
  };

  return (
    <header className="header" role="banner">
      <div className="container header__top">
        <button
          type="button"
          className="header__menu-toggle"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>

        <button type="button" className="header__brand" onClick={() => navigate(() => goTo("home"))} aria-label="MichaLand - Accueil">
          <img className="header__brand-img" src="/images/logo-cat.png" alt="" />
          <span className="header__brand-text">
            <span className="header__brand-name">Micha<strong>Land</strong></span>
            <span className="header__brand-tagline">Animalerie & Hôtel</span>
          </span>
        </button>

        <div className="header__search" role="search">
          <svg className="header__search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="header__search-input"
            type="search"
            placeholder="Rechercher des produits..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Rechercher des produits"
          />
        </div>

        <div className="header__actions">
          <button
            type="button"
            className="header__action"
            title="Favoris"
            aria-label={`Favoris (${wishlistCount})`}
            onClick={() => navigate(() => goTo("wishlist"))}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
            <span className="header__action-label">Favoris</span>
            {wishlistCount > 0 && <span className="badge badge--danger header__badge">{wishlistCount}</span>}
          </button>

          <button
            type="button"
            className="header__action"
            title="Panier"
            aria-label={`Panier (${cartCount})`}
            onClick={() => navigate(() => goTo("cart"))}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.6L22 7H6" />
            </svg>
            <span className="header__action-label">Panier</span>
            {cartCount > 0 && <span className="badge badge--danger header__badge">{cartCount}</span>}
          </button>

          <button
            type="button"
            className="header__action"
            title={profileLabel}
            aria-label={profileLabel}
            onClick={() => navigate(() => goTo(profileTarget))}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
            <span className="header__action-label">{isAdmin ? "Admin" : "Compte"}</span>
          </button>
        </div>
      </div>

      <nav className={`nav${menuOpen ? " nav--open" : ""}`} aria-label="Navigation principale">
        <div className="container nav__list">
          <button className={`nav__item ${active("home")}`} onClick={() => navigate(() => goTo("home"))}>Accueil</button>
          <button className={`nav__item ${active("cats")}`} onClick={() => navigate(() => openCategory("cats"))}>Chats</button>
          <button className={`nav__item ${active("dogs")}`} onClick={() => navigate(() => openCategory("dogs"))}>Chiens</button>
          <button className={`nav__item ${active("birds")}`} onClick={() => navigate(() => openCategory("birds"))}>Oiseaux</button>
          <button className={`nav__item ${active("booking")}`} onClick={() => navigate(() => goTo("booking"))}>Hôtel</button>
          <button className={`nav__item ${active("wishlist")}`} onClick={() => navigate(() => goTo("wishlist"))}>
            Favoris{wishlistCount > 0 ? <span className="nav__count"> ({wishlistCount})</span> : ""}
          </button>
          {isAdmin && (
            <button className={`nav__item ${active("dashboard")}`} onClick={() => navigate(() => goTo("dashboard"))}>Admin</button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
