import ProductCard from "./ProductCard";
import PawTrails from "./PawTrails";

const reasons = [
  { icon: "🌿", title: "Produits de qualité", text: "Nourriture, jouets et accessoires soigneusement sélectionnés pour chats, chiens et oiseaux." },
  { icon: "🏨", title: "Hôtel sûr pour animaux", text: "Réservez un séjour confortable pour votre compagnon pendant vos déplacements." },
  { icon: "🚚", title: "Livraison rapide", text: "Livraison à 40 DH. Offerte dès 800 DH d'achats." },
  { icon: "🤖", title: "Micha assist", text: "Notre assistant répond en français à vos questions sur nos produits, la livraison et l’hôtel." },
];

function Home({ products, openCategory, goTo, addToCart, toggleWishlist, wishlist, openProduct }) {
  // one product of each type so the homepage shows variety
  const types = ["Food", "Toys", "Accessories", "Beds", "Hygiene"];
  const featured = [];
  types.forEach((type) => {
    products.filter((p) => p.type === type).slice(0, 2).forEach((p) => featured.push(p));
  });

  return (
    <div>
      {/* HERO — the cat-shopping illustration is a full-section wallpaper (see App.css) */}
      <section className="hero" aria-labelledby="hero-title">
        <PawTrails variant="hero" />
        <div className="container hero__inner">
          <div className="hero__content">
            <span className="hero__badge">Animalerie & Hôtel pour animaux</span>
            <h1 id="hero-title" className="hero__title">Bienvenue chez <span>MichaLand</span></h1>
            <p className="hero__description">
              Tout pour vos compagnons à poils et à plumes : nourriture savoureuse, jouets
              amusants, couchages douillets et un hôtel où ils se sentent comme à la maison.
            </p>
            <div className="hero__actions">
              <button className="btn btn--primary btn--lg" onClick={() => openCategory("all")}>Voir les produits</button>
              <button className="btn btn--outline btn--lg" onClick={() => goTo("booking")}>Réserver l'hôtel</button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section" aria-labelledby="featured-title">
        <div className="container">
          <h2 id="featured-title" className="section-title">Produits vedettes</h2>
          <div className="grid grid-4" role="list">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                wishlist={wishlist}
                openProduct={openProduct}
              />
            ))}
          </div>
          <div className="hero__more">
            <button className="btn btn--outline" onClick={() => openCategory("all")}>Voir tous les produits</button>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section section--soft" aria-labelledby="reasons-title">
        <div className="container">
          <h2 id="reasons-title" className="section-title">Pourquoi choisir MichaLand ?</h2>
          <div className="reasons-grid" role="list">
            {reasons.map((r) => (
              <article className="reason-card" key={r.title} role="listitem">
                <span className="reason-card__icon" aria-hidden="true">{r.icon}</span>
                <h3 className="reason-card__title">{r.title}</h3>
                <p className="reason-card__text">{r.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
