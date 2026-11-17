import { useState } from "react";
import { initialProducts, initialOrders, initialBookings, initialUsers } from "./data";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import Booking from "./components/Booking";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Chatbot from "./components/Chatbot";
import CartButton from "./components/CartButton";

// App keeps ALL the data in useState. When the page refreshes, everything resets.
function App() {
  // which page is shown: home, products, details, cart, wishlist, booking, login, register, profile, dashboard
  const [page, setPage] = useState("home"); // start on homepage for public access
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]); // [{ id, qty }]
  const [wishlist, setWishlist] = useState([]); // [productId]
  const [orders, setOrders] = useState(initialOrders);
  const [bookings, setBookings] = useState(initialBookings);

  const [users, setUsers] = useState(initialUsers);
  const [user, setUser] = useState(null); // logged-in customer
  const [isAdmin, setIsAdmin] = useState(false);

  const [toast, setToast] = useState("");

  // ---------- helpers ----------
  const goTo = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  const openCategory = (cat) => {
    setCategory(cat);
    setSearch("");
    goTo("products");
  };

  const openProduct = (id) => {
    setSelectedId(id);
    goTo("details");
  };

  const handleSearch = (text) => {
    setSearch(text);
    setCategory("all");
    if (page !== "products") goTo("products");
  };

  // ---------- cart ----------
  const addToCart = (id) => {
    const exists = cart.find((item) => item.id === id);
    if (exists) {
      setCart(cart.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)));
    } else {
      setCart([...cart, { id, qty: 1 }]);
    }
    showToast("Ajouté au panier 🛒");
  };

  const changeQty = (id, change) => {
    setCart(
      cart
        .map((item) => (item.id === id ? { ...item, qty: item.qty + change } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id) => setCart(cart.filter((item) => item.id !== id));

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // ---------- wishlist ----------
  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((w) => w !== id));
      showToast("Retiré des favoris");
    } else {
      setWishlist([...wishlist, id]);
      showToast("Ajouté aux favoris ♥");
    }
  };

  // ---------- orders & bookings ----------
  const placeOrder = (customer, total) => {
    const productsText = cart
      .map((item) => {
        const p = products.find((prod) => prod.id === item.id);
        return `${p ? p.name : "Produit supprimé"} x${item.qty}`;
      })
      .join(", ");
    const newOrder = {
      id: "ORD-" + (1001 + orders.length),
      customer: customer.name,
      phone: customer.phone,
      products: productsText,
      total,
      status: "Pending",
      userEmail: user ? user.email : "",
    };
    setOrders([...orders, newOrder]);
    setCart([]);
    return newOrder.id;
  };

  const addBooking = (booking) => {
    const newBooking = { ...booking, id: "BK-" + (2001 + bookings.length), status: "Pending" };
    setBookings([...bookings, newBooking]);
    return newBooking.id;
  };

  // ---------- account ----------
  const login = (username, password) => {
    if (username === "admin" && password === "admin123") {
      setIsAdmin(true);
      setUser({ name: "Admin", email: "admin@michaland.ma", phone: "" });
      goTo("dashboard");
      return "";
    }
    const found = users.find((u) => u.email === username && u.password === password);
    if (!found) return "Identifiant/email ou mot de passe incorrect.";
    setUser(found);
    setIsAdmin(false);
    goTo("home");
    return "";
  };

  const register = (newUser) => {
    if (users.find((u) => u.email === newUser.email)) return "Cette adresse email est déjà enregistrée.";
    setUsers([...users, newUser]);
    setUser(newUser);
    setIsAdmin(false);
    goTo("home");
    return "";
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setCart([]);
    setWishlist([]);
    goTo("login");
    showToast("Vous êtes déconnecté");
  };

  // ---------- which page to show ----------
  const selectedProduct = products.find((p) => p.id === selectedId);

  // props shared by pages that show product cards
  const cardActions = { addToCart, toggleWishlist, wishlist, openProduct };

  // Pages that require authentication
  const privatePages = ["cart", "wishlist", "profile", "dashboard"];
  const isPrivatePage = privatePages.includes(page);
  const needsAuth = isPrivatePage && !user;

  let content;
  if (page === "home") {
    content = <Home products={products} openCategory={openCategory} goTo={goTo} {...cardActions} />;
  } else if (page === "products") {
    content = (
      <ProductList
        products={products}
        category={category}
        setCategory={setCategory}
        search={search}
        setSearch={setSearch}
        {...cardActions}
      />
    );
  } else if (page === "details") {
    content = selectedProduct ? (
      <ProductDetails product={selectedProduct} products={products} goTo={goTo} {...cardActions} />
    ) : (
      <p className="container empty">Produit introuvable.</p>
    );
  } else if (page === "cart") {
    content = (
      <Cart
        cart={cart}
        products={products}
        changeQty={changeQty}
        removeFromCart={removeFromCart}
        placeOrder={placeOrder}
        goTo={goTo}
        user={user}
      />
    );
  } else if (page === "wishlist") {
    content = <Wishlist products={products} {...cardActions} goTo={goTo} />;
  } else if (page === "booking") {
    content = <Booking addBooking={addBooking} user={user} />;
  } else if (page === "login") {
    content = <Login login={login} goTo={goTo} />;
  } else if (page === "register") {
    content = <Register register={register} goTo={goTo} />;
  } else if (page === "profile") {
    content = <Profile user={user} orders={orders} logout={logout} goTo={goTo} isAdmin={isAdmin} />;
  } else if (page === "dashboard") {
    content = (
      <Dashboard
        isAdmin={isAdmin}
        goTo={goTo}
        products={products}
        setProducts={setProducts}
        orders={orders}
        setOrders={setOrders}
        bookings={bookings}
        setBookings={setBookings}
        logout={logout}
      />
    );
  }

  // If private page but not logged in, redirect to login
  if (needsAuth) {
    return (
      <div className="app">
        <main>
          <Login login={login} goTo={goTo} />
        </main>
        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  return (
    <div className={`app${page === "login" ? " app--auth" : ""}`}>
      <Header
        page={page}
        category={category}
        cartCount={cartCount}
        goTo={goTo}
        openCategory={openCategory}
        search={search}
        handleSearch={handleSearch}
        wishlistCount={wishlist.length}
        user={user}
        isAdmin={isAdmin}
      />

      <main>{content}</main>

      <Footer goTo={goTo} openCategory={openCategory} />

      {!isAdmin && <CartButton cartCount={cartCount} goTo={goTo} />}

      <Chatbot products={products} />

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
