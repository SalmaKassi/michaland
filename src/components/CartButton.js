import { FALLBACK_IMAGE } from "../data";

// Swaps to the existing local logo if an asset is ever missing, without retry loops.
const handleImageError = (e) => {
  if (!e.currentTarget.dataset.fallbackApplied) {
    e.currentTarget.dataset.fallbackApplied = "true";
    e.currentTarget.src = FALLBACK_IMAGE;
  }
};

function CartButton({ cartCount, goTo }) {
  if (cartCount === 0) return null;
  return (
    <button
      className="cart-fab"
      onClick={() => goTo("cart")}
      aria-label={`Panier (${cartCount} article${cartCount > 1 ? 's' : ''})`}
      title={`Panier (${cartCount} article${cartCount > 1 ? 's' : ''})`}
    >
      <img className="cart-fab__image" src="/images/cart-icon.png" alt="" onError={handleImageError} />
      <span className="badge badge--danger cart-fab__badge">{cartCount}</span>
    </button>
  );
}

export default CartButton;
