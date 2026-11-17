function Footer({ goTo, openCategory }) {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer__grid">
        <div>
          <div className="footer__brand">
            <img className="footer__brand-img" src="/images/logo-cat.png" alt="" />
            <span className="footer__brand-name">Micha<strong>Land</strong></span>
          </div>
          <p className="footer__description">
            Votre animalerie et hôtel pour animaux de confiance. Tout pour votre chat, votre chien ou votre oiseau, avec amour.
          </p>
        </div>

        <div>
          <h4 className="footer__section-title">Liens rapides</h4>
          <button className="footer__link" onClick={() => goTo("home")}>Accueil</button>
          <button className="footer__link" onClick={() => openCategory("cats")}>Chats</button>
          <button className="footer__link" onClick={() => openCategory("dogs")}>Chiens</button>
          <button className="footer__link" onClick={() => openCategory("birds")}>Oiseaux</button>
          <button className="footer__link" onClick={() => goTo("booking")}>Hôtel pour animaux</button>
        </div>

        <div>
          <h4 className="footer__section-title">Contact</h4>
          <p className="footer__contact">📍 Casablanca, Maroc</p>
          <p className="footer__contact">📞 +212 6 00 00 00 00</p>
          <p className="footer__contact">✉️ contact@michaland.ma</p>
          <p className="footer__contact">
            <a href="https://wa.me/212600000000" target="_blank" rel="noreferrer">💬 WhatsApp</a>
          </p>
          <p className="footer__contact">
            <a href="https://instagram.com/michaland" target="_blank" rel="noreferrer">📸 Instagram</a>
          </p>
        </div>
      </div>
      <div className="footer__copyright">© 2026 MichaLand. Tous droits réservés. 🐾</div>
    </footer>
  );
}

export default Footer;