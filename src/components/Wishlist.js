import ProductCard from "./ProductCard";

function Wishlist({ products, addToCart, toggleWishlist, wishlist, openProduct, goTo }) {
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <section className="section" aria-labelledby="wishlist-title">
      <div className="container">
        <h2 id="wishlist-title" className="section-title">Mes favoris</h2>

        {items.length === 0 ? (
          <div className="empty-state" role="status">
            <span className="empty-state__icon" aria-hidden="true">♥</span>
            <h2 className="empty-state__title">Vos favoris sont vides</h2>
            <p className="empty-state__text">Sauvegardez les produits que vous aimez en cliquant sur l'icône cœur.</p>
            <button className="btn btn--primary" onClick={() => goTo("products")}>Aller à la boutique</button>
          </div>
        ) : (
          <div className="grid grid-4" role="list">
            {items.map((p) => (
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
        )}
      </div>
    </section>
  );
}

export default Wishlist;