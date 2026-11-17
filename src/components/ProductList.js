import ProductCard from "./ProductCard";

function ProductList({ products, category, setCategory, search, setSearch, addToCart, toggleWishlist, wishlist, openProduct }) {
  const tabs = [
    { key: "all", label: "Tous" },
    { key: "cats", label: "Chats" },
    { key: "dogs", label: "Chiens" },
    { key: "birds", label: "Oiseaux" },
  ];

  // filter by category, then by search text
  const filtered = products.filter((p) => {
    const matchCategory = category === "all" || p.category === category;
    const text = search.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(text) ||
      p.type.toLowerCase().includes(text) ||
      p.description.toLowerCase().includes(text);
    return matchCategory && matchSearch;
  });

  return (
    <section className="section" aria-labelledby="products-title">
      <div className="container">
        <h2 id="products-title" className="section-title">Nos produits</h2>

        <div className="filters" role="group" aria-label="Filtres produits">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`filter-chip ${category === t.key ? "filter-chip--active" : ""}`}
              onClick={() => setCategory(t.key)}
              aria-pressed={category === t.key}
            >
              {t.label}
            </button>
          ))}
          <div className="filter-search">
            <svg className="filter-search__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="input"
              type="search"
              placeholder="Rechercher dans les produits..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Rechercher dans les produits"
            />
          </div>
        </div>

        <p className="muted" style={{ marginBottom: 'var(--space-4)' }} aria-live="polite">
          {filtered.length} produit{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
        </p>

        {filtered.length === 0 ? (
          <div className="empty-state" role="status">
            <span className="empty-state__icon" aria-hidden="true">🔍</span>
            <h3 className="empty-state__title">Aucun produit ne correspond</h3>
            <p className="empty-state__text">Essayez de modifier votre recherche ou vos filtres.</p>
          </div>
        ) : (
          <div className="grid grid-4" role="list">
            {filtered.map((p) => (
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

export default ProductList;