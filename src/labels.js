// Display-only French labels for values stored in data.
// The underlying data values are never changed — business logic stays intact.

export const typeLabel = (type) => ({
  Food: "Nourriture",
  Toys: "Jouets",
  Accessories: "Accessoires",
  Beds: "Couchages",
  Hygiene: "Hygiène",
}[type] || type);

export const categoryLabel = (category) => ({
  cats: "Chats",
  dogs: "Chiens",
  birds: "Oiseaux",
}[category] || category);

export const statusLabel = (status) => ({
  Pending: "En attente",
  Shipped: "Expédiée",
  Confirmed: "Confirmée",
  Delivered: "Livrée",
  Cancelled: "Annulée",
}[status] || status);
