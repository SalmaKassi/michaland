import { useState } from "react";
import { typeLabel, categoryLabel } from "../labels";

const emptyProduct = { name: "", category: "cats", type: "Food", price: "", image: "", description: "" };

function Dashboard({ isAdmin, goTo, products, setProducts, orders, setOrders, bookings, setBookings, logout }) {
  const [tab, setTab] = useState("overview");
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);

  // only the admin can see this page
  if (!isAdmin) {
    return (
      <section className="section" aria-labelledby="admin-lock-title">
        <div className="container">
          <div className="empty-state" role="status">
            <span className="empty-state__icon" aria-hidden="true">🔒</span>
            <h2 id="admin-lock-title" className="empty-state__title">Espace administrateur</h2>
            <p className="empty-state__text">Veuillez vous connecter avec le compte administrateur (admin / admin123).</p>
            <button className="btn btn--primary" onClick={() => goTo("login")}>Aller à la connexion</button>
          </div>
        </div>
      </section>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const image = form.image.trim() || `https://loremflickr.com/500/400/${form.category === "birds" ? "parrot" : form.category.slice(0, -1)}?lock=${Date.now() % 1000}`;
    if (editingId) {
      // edit an existing product
      setProducts(products.map((p) => (p.id === editingId ? { ...p, ...form, price: Number(form.price), image } : p)));
    } else {
      // add a new product with a new id
      const newId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      setProducts([...products, { ...form, id: newId, price: Number(form.price), image }]);
    }
    setForm(emptyProduct);
    setEditingId(null);
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      type: product.type,
      price: product.price,
      image: product.image,
      description: product.description,
    });
    window.scrollTo(0, 0);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyProduct);
  };

  const deleteProduct = (id) => {
    if (window.confirm("Supprimer ce produit ?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const changeOrderStatus = (id, status) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const changeBookingStatus = (id, status) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  return (
    <section className="section" aria-labelledby="dashboard-title">
      <div className="container">
        <div className="dashboard__header">
          <h2 id="dashboard-title" className="dashboard__title">Tableau de bord administrateur</h2>
          <button className="btn btn--outline" onClick={logout}>Déconnexion</button>
        </div>

        <div className="stats-grid" role="list" aria-label="Statistiques">
          <article className="stat-card" role="listitem">
            <div className="stat-card__value">{products.length}</div>
            <div className="stat-card__label">Produits totaux</div>
          </article>
          <article className="stat-card" role="listitem">
            <div className="stat-card__value">{orders.length}</div>
            <div className="stat-card__label">Commandes totales</div>
          </article>
          <article className="stat-card" role="listitem">
            <div className="stat-card__value">{bookings.length}</div>
            <div className="stat-card__label">Réservations totales</div>
          </article>
        </div>

        <nav className="dashboard__tabs" aria-label="Onglets d'administration" role="tablist">
          <button className={`dashboard__tab ${tab === "overview" ? "dashboard__tab--active" : ""}`} role="tab" aria-selected={tab === "overview"} onClick={() => setTab("overview")}>Vue d'ensemble</button>
          <button className={`dashboard__tab ${tab === "products" ? "dashboard__tab--active" : ""}`} role="tab" aria-selected={tab === "products"} onClick={() => setTab("products")}>Produits</button>
          <button className={`dashboard__tab ${tab === "orders" ? "dashboard__tab--active" : ""}`} role="tab" aria-selected={tab === "orders"} onClick={() => setTab("orders")}>Commandes</button>
          <button className={`dashboard__tab ${tab === "bookings" ? "dashboard__tab--active" : ""}`} role="tab" aria-selected={tab === "bookings"} onClick={() => setTab("bookings")}>Réservations</button>
        </nav>

        {/* ---------- OVERVIEW ---------- */}
        {tab === "overview" && (
          <div className="empty-state" role="status">
            <span className="empty-state__icon" aria-hidden="true">📊</span>
            <h3 className="empty-state__title">Vue d'ensemble</h3>
            <p className="empty-state__text">Utilisez les onglets ci-dessus pour gérer les produits, commandes et réservations.</p>
          </div>
        )}

        {/* ---------- PRODUCTS ---------- */}
        {tab === "products" && (
          <div>
            <form className="form" onSubmit={handleSubmit} aria-labelledby="product-form-title">
              <h3 id="product-form-title" className="form__title">{editingId ? "Modifier le produit" : "Ajouter un produit"}</h3>
              <div className="form__grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="product-name">Nom</label>
                  <input className="input" id="product-name" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="product-price">Prix (DH)</label>
                  <input className="input" id="product-price" name="price" type="number" min="1" value={form.price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="product-category">Catégorie</label>
                  <select className="input" id="product-category" name="category" value={form.category} onChange={handleChange}>
                    <option value="cats">Chats</option>
                    <option value="dogs">Chiens</option>
                    <option value="birds">Oiseaux</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="product-type">Type</label>
                  <select className="input" id="product-type" name="type" value={form.type} onChange={handleChange}>
                    <option value="Food">Nourriture</option>
                    <option value="Toys">Jouets</option>
                    <option value="Accessories">Accessoires</option>
                    <option value="Beds">Couchages</option>
                    <option value="Hygiene">Hygiène</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="product-image">URL de l'image (optionnel)</label>
                <input className="input" id="product-image" name="image" placeholder="https://... ou /images/mon-image.jpg" value={form.image} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="product-description">Description</label>
                <textarea className="input" id="product-description" name="description" rows="3" value={form.description} onChange={handleChange} required />
              </div>
              <div className="form__actions">
                <button className="btn btn--primary" type="submit">{editingId ? "Enregistrer" : "Ajouter"}</button>
                {editingId && <button className="btn btn--outline" type="button" onClick={cancelEdit}>Annuler</button>}
              </div>
            </form>

            <div className="table-wrapper" role="region" aria-label="Liste des produits">
              <table className="table">
                <thead>
                  <tr><th>ID</th><th>Image</th><th>Nom</th><th>Catégorie</th><th>Type</th><th>Prix</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td><img className="table__image" src={p.image} alt="" onError={(e) => { e.target.onerror = null; e.target.src = "/images/logo-cat.png"; }} /></td>
                      <td>{p.name}</td>
                      <td>{categoryLabel(p.category)}</td>
                      <td>{typeLabel(p.type)}</td>
                      <td>{p.price} DH</td>
                      <td className="table__actions">
                        <button className="btn btn--sm btn--outline" onClick={() => startEdit(p)}>Modifier</button>
                        <button className="btn btn--sm btn--danger" onClick={() => deleteProduct(p.id)}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------- ORDERS ---------- */}
        {tab === "orders" && (
          <div className="table-wrapper" role="region" aria-label="Liste des commandes">
            <table className="table">
              <thead>
                <tr><th>Commande</th><th>Client</th><th>Téléphone</th><th>Produits</th><th>Total</th><th>Statut</th></tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.customer}</td>
                    <td>{o.phone}</td>
                    <td>{o.products}</td>
                    <td>{o.total} DH</td>
                    <td>
                      <select className={`status-select status-select--${o.status.toLowerCase()}`} value={o.status} onChange={(e) => changeOrderStatus(o.id, e.target.value)} aria-label={`Statut de la commande ${o.id}`}>
                        <option value="Pending">En attente</option>
                        <option value="Shipped">Expédiée</option>
                        <option value="Delivered">Livrée</option>
                        <option value="Cancelled">Annulée</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ---------- BOOKINGS ---------- */}
        {tab === "bookings" && (
          <div className="table-wrapper" role="region" aria-label="Liste des réservations">
            <table className="table">
              <thead>
                <tr><th>ID</th><th>Client</th><th>Téléphone</th><th>Animal</th><th>Arrivée</th><th>Départ</th><th>Notes</th><th>Statut</th></tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.customer}</td>
                    <td>{b.phone}</td>
                    <td>{b.petName} ({b.petType})</td>
                    <td>{b.checkIn}</td>
                    <td>{b.checkOut}</td>
                    <td>{b.notes || "—"}</td>
                    <td>
                      <select className={`status-select status-select--${b.status.toLowerCase()}`} value={b.status} onChange={(e) => changeBookingStatus(b.id, e.target.value)} aria-label={`Statut de la réservation ${b.id}`}>
                        <option value="Pending">En attente</option>
                        <option value="Confirmed">Confirmée</option>
                        <option value="Cancelled">Annulée</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;