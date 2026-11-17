import { statusLabel } from "../labels";

function Profile({ user, orders, logout, goTo, isAdmin }) {
  const myOrders = user ? orders.filter((o) => o.userEmail === user.email) : orders;

  return (
    <section className="section" aria-labelledby="profile-title">
      <div className="container">
        <div className="profile">
          <div className="avatar" aria-hidden="true">{user ? user.name[0].toUpperCase() : "?"}</div>
          <div className="profile__info">
            <h2 className="profile__name">{user?.name}</h2>
            <p className="profile__email">{user?.email}</p>
            <p className="profile__phone">{user?.phone || "Aucun téléphone"}</p>
          </div>
          <div className="profile__actions">
            {isAdmin && <button className="btn btn--primary" onClick={() => goTo("dashboard")}>Tableau de bord</button>}
            <button className="btn btn--outline" onClick={logout}>Déconnexion</button>
          </div>
        </div>

        <h2 className="section-title section-title--left">Mes commandes</h2>

        {myOrders.length === 0 ? (
          <div className="empty-state" role="status">
            <span className="empty-state__icon" aria-hidden="true">📦</span>
            <h3 className="empty-state__title">Aucune commande pour l'instant</h3>
            <p className="empty-state__text">Vos commandes apparaîtront ici après votre premier achat.</p>
            <button className="btn btn--primary" onClick={() => goTo("products")}>Aller à la boutique</button>
          </div>
        ) : (
          <div className="table-wrapper" role="region" aria-label="Liste des commandes">
            <table className="table">
              <thead>
                <tr><th>Commande</th><th>Produits</th><th>Total</th><th>Statut</th></tr>
              </thead>
              <tbody>
                {myOrders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.products}</td>
                    <td>{o.total} DH</td>
                    <td><span className={`status-badge status-badge--${o.status.toLowerCase()}`}>{statusLabel(o.status)}</span></td>
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

export default Profile;