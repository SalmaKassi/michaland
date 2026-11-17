import { FALLBACK_IMAGE } from "../data";
import { typeLabel, categoryLabel } from "../labels";
import ProductCard from "./ProductCard";

function ProductDetails({ product, products, goTo, addToCart, toggleWishlist, wishlist, openProduct }) {
  // similar products: same category, different type
  const similar = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <section className="section" aria-labelledby="product-title">
      <div className="container">
        <div className="details">
          <div className="details__image">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
            />
          </div>
          <div className="details__info">
            <h1 id="product-title" className="details__name">{product.name}</h1>
            <p className="details__description">{product.description}</p>
            <p className="details__price">{product.price} DH</p>
            <ul className="details__meta" aria-label="Détails du produit">
              <li><span>Catégorie</span><span>{categoryLabel(product.category)}</span></li>
              <li><span>Type</span><span>{typeLabel(product.type)}</span></li>
              <li><span>Prix</span><span>{product.price} DH</span></li>
            </ul>
            <div className="details__actions">
              <button className="btn btn--primary btn--lg" onClick={() => addToCart(product.id)}>Ajouter au panier</button>
              <button className="btn btn--outline btn--lg" onClick={() => toggleWishlist(product.id)}>
                {wishlist.includes(product.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
              </button>
            </div>
            <button className="btn btn--secondary btn--block" onClick={() => goTo("products")}>← Retour aux produits</button>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt" style={{ marginTop: 'var(--space-10)' }}>
            <h2 className="section-title">Produits similaires</h2>
            <div className="grid grid-4" role="list">
              {similar.map((p) => (
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
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductDetails;