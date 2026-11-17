import { FALLBACK_IMAGE } from "../data";
import { typeLabel } from "../labels";

// One product card, used in Home, ProductList, Wishlist and ProductDetails (similar products).
function ProductCard({ product, addToCart, toggleWishlist, wishlist, openProduct }) {
  const liked = wishlist.includes(product.id);

  return (
    <article className="product-card" role="listitem">
      <div className="product-card__image-wrapper">
        <img
          className="product-card__image"
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        <span className="tag tag--primary product-card__tag">{typeLabel(product.type)}</span>
        <button
          className={`product-card__wishlist ${liked ? "product-card__wishlist--active" : ""}`}
          title={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
          onClick={() => toggleWishlist(product.id)}
          aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
          aria-pressed={liked}
        >
          {liked ? "♥" : "♡"}
        </button>
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price">{product.price} DH</p>
        <div className="product-card__actions">
          <button className="btn btn--primary" onClick={() => addToCart(product.id)}>Ajouter au panier</button>
          <button className="btn btn--outline" onClick={() => openProduct(product.id)}>Voir détails</button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;