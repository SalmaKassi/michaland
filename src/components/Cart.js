import { useState } from "react";
import { checkPhone, checkName } from "../validation";
import { DELIVERY_FEE, FREE_DELIVERY_LIMIT, FALLBACK_IMAGE } from "../data";

function Cart({ cart, products, changeQty, removeFromCart, placeOrder, goTo, user }) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [formError, setFormError] = useState("");
  const [confirmation, setConfirmation] = useState(null); // { orderId, total }
  const [form, setForm] = useState({
    name: user ? user.name : "",
    phone: user && user.phone ? user.phone : "",
    address: "",
    city: "",
  });

  // join cart items with product info
  const items = cart
    .map((item) => ({ ...item, product: products.find((p) => p.id === item.id) }))
    .filter((item) => item.product);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const delivery = subtotal === 0 || subtotal > FREE_DELIVERY_LIMIT ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const message =
      checkName(form.name, "Nom complet") || checkPhone(form.phone) || checkName(form.address, "Adresse") || checkName(form.city, "Ville");
    if (message) {
      setFormError(message);
      return;
    }
    setFormError("");
    const orderId = placeOrder(form, total);
    setConfirmation({ orderId, total });
    setShowCheckout(false);
  };

  // ----- after the order is sent -----
  if (confirmation) {
    return (
      <section className="section" aria-labelledby="confirmation-title">
        <div className="container">
          <div className="message-box message-box--success" role="status">
            <span className="message-box__icon" aria-hidden="true">✅</span>
            <h2 id="confirmation-title" className="message-box__title">Merci pour votre commande !</h2>
            <p className="message-box__text">
              Votre commande <strong>{confirmation.orderId}</strong> a été reçue.
              Total : <strong>{confirmation.total} DH</strong>.
            </p>
            <p className="message-box__text">Nous vous appellerons bientôt pour confirmer la livraison.</p>
            <button className="btn btn--primary" onClick={() => { setConfirmation(null); goTo("products"); }}>
              Continuer mes achats
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ----- empty cart -----
  if (items.length === 0) {
    return (
      <section className="section" aria-labelledby="empty-cart-title">
        <div className="container">
          <div className="empty-state" role="status">
            <span className="empty-state__icon" aria-hidden="true">🛒</span>
            <h2 id="empty-cart-title" className="empty-state__title">Votre panier est vide</h2>
            <p className="empty-state__text">Ajoutez des produits pour votre compagnon.</p>
            <button className="btn btn--primary" onClick={() => goTo("products")}>Aller à la boutique</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" aria-labelledby="cart-title">
      <div className="container">
        <h2 id="cart-title" className="section-title">Panier</h2>

        <div className="cart-layout">
          <div className="cart__items" role="list" aria-label="Articles du panier">
            {items.map(({ product, qty }) => (
              <article className="cart-item" key={product.id} role="listitem">
                <img
                  className="cart-item__image"
                  src={product.image}
                  alt={product.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                />
                <div className="cart-item__info">
                  <h3>{product.name}</h3>
                  <p className="price">{product.price} DH</p>
                </div>
                <div className="cart-item__qty">
                  <button className="cart-item__qty-btn" onClick={() => changeQty(product.id, -1)} aria-label="Diminuer la quantité">−</button>
                  <span className="cart-item__qty-value" aria-live="polite">{qty}</span>
                  <button className="cart-item__qty-btn" onClick={() => changeQty(product.id, 1)} aria-label="Augmenter la quantité">+</button>
                </div>
                <p className="cart-item__total">{product.price * qty} DH</p>
                <button className="cart-item__remove" title="Supprimer" onClick={() => removeFromCart(product.id)} aria-label={`Supprimer ${product.name}`}>🗑️</button>
              </article>
            ))}
          </div>

          <aside className="cart__summary" aria-labelledby="summary-title">
            <div className="summary-card">
              <h3 id="summary-title" className="summary-card__title">Résumé de la commande</h3>
              <div className="summary-row"><span>Sous-total</span><span>{subtotal} DH</span></div>
              <div className="summary-row">
                <span>Livraison</span>
                <span>{delivery === 0 ? "GRATUITE" : delivery + " DH"}</span>
              </div>
              {delivery > 0 && (
                <p className="summary-hint" aria-label="Astuce livraison">
                  💡 Ajoutez {FREE_DELIVERY_LIMIT - subtotal + 1} DH pour la livraison offerte !
                </p>
              )}
              <div className="summary-row summary-row--total"><span>Total</span><span>{total} DH</span></div>
              {!showCheckout && (
                <button className="btn btn--primary btn--block" onClick={() => setShowCheckout(true)}>Commander</button>
              )}
            </div>
          </aside>
        </div>

        {showCheckout && (
          <form className="form" onSubmit={handleSubmit} aria-labelledby="checkout-title">
            <h3 id="checkout-title" className="form__title">Commander</h3>
            <div className="form__grid">
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-name">Nom complet</label>
                <input className="input" id="checkout-name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-phone">Téléphone</label>
                <input className="input" id="checkout-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-address">Adresse</label>
                <input className="input" id="checkout-address" name="address" value={form.address} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-city">Ville</label>
                <input className="input" id="checkout-city" name="city" value={form.city} onChange={handleChange} required />
              </div>
            </div>

            <h4 className="form__subtitle">Récapitulatif</h4>
            <ul className="order-summary__list">
              {items.map(({ product, qty }) => (
                <li key={product.id}><span>{product.name} x{qty}</span><span>{product.price * qty} DH</span></li>
              ))}
              <li><span>Livraison</span><span>{delivery === 0 ? "GRATUITE" : delivery + " DH"}</span></li>
              <li className="total"><span>Total</span><span>{total} DH</span></li>
            </ul>

            {formError && <p className="form-error" role="alert">⚠️ {formError}</p>}
            <div className="form__actions">
              <button type="button" className="btn btn--outline" onClick={() => setShowCheckout(false)}>Annuler</button>
              <button type="submit" className="btn btn--primary btn--lg">Confirmer la commande</button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default Cart;