// Static data for MichaLand. Everything lives in memory (React state) - no storage, no database.

// Product images come from loremflickr.com (random photos matching the keywords).
// To use your own photos: put them in public/images/ and write "/images/my-photo.jpg" in the image field.
const img = (filename) => `/image2/${filename}`;

export const FALLBACK_IMAGE = "/images/logo-cat.png";

export const DELIVERY_FEE = 40;
export const FREE_DELIVERY_LIMIT = 800;

export const initialProducts = [
  // ---------- CATS ----------
  { id: 1, name: "Premium Dry Cat Food 2kg", category: "cats", type: "Food", price: 189, 
    image: img("Premium-Dry-Cat-Food.jpg"),
    description: "Complete and balanced dry food for adult cats, rich in protein with chicken and rice. Supports healthy digestion and a shiny coat." },
  { id: 2, name: "Feather Wand Toy", category: "cats", type: "Toys", price: 45, 
    image: img("Feather-Wand-Toy.jpg"),
    description: "Interactive feather wand that keeps your cat active and entertained. Perfect for daily play sessions with your pet." },
  { id: 3, name: "Cozy Plush Cat Bed", category: "cats", type: "Beds", price: 260, 
    image: img("Cozy-Plush-Cat-Bed.jpg"),
    description: "Soft round bed with raised edges for a warm and safe sleep. Machine washable cover." },
  { id: 4, name: "Scratching Post Tower", category: "cats", type: "Accessories", price: 399, 
    image: img("Scratching-Post-Tower.jpg"),
    description: "Tall sisal scratching post with a comfy platform on top. Protects your furniture and helps your cat stretch." },
  { id: 5, name: "Cat Shampoo Gentle 250ml", category: "cats", type: "Hygiene", price: 79, 
    image: img("Cat-Shampoo-Gentle.jpg"),
    description: "Mild shampoo made for sensitive cat skin. Leaves the fur soft and clean with a light scent." },
  { id: 6, name: "Cat Collar with Bow", category: "cats", type: "Accessories", price: 55, 
    image: img("Cat-Collar-with-Bow.jpg"),
    description: "Adjustable collar with a cute purple bow and a safety clip. Available in one universal size." },

  // ---------- DOGS ----------
  { id: 7, name: "Dog Food Beef & Veggies 5kg", category: "dogs", type: "Food", price: 320, 
    image: img("Dog-Food-Beef-Veggies.jpg"),
    description: "Nutritious dry food for adult dogs with beef and vegetables. Gives energy for walks and play." },
  { id: 8, name: "Rubber Chew Ball", category: "dogs", type: "Toys", price: 39, 
    image: img("Rubber-Chew-Ball.jpg"),
    description: "Strong rubber ball that bounces and floats. Great for fetch and for healthy chewing." },
  { id: 9, name: "Comfort Orthopedic Dog Bed", category: "dogs", type: "Beds", price: 520, 
    image: img("Comfort-Orthopedic-Dog-Bed.jpg"),
    description: "Large soft bed with a thick cushion that supports joints. Removable and washable cover." },
  { id: 10, name: "Adjustable Leash & Harness Set", category: "dogs", type: "Accessories", price: 175, 
    image: img("Adjustable-Leash-Harness.jpg"),
    description: "Comfortable padded harness with a strong leash for safe daily walks." },
  { id: 11, name: "Dog Shampoo Fresh 500ml", category: "dogs", type: "Hygiene", price: 95, 
    image: img("Dog-Shampoo-Fresh.jpg"),
    description: "Gentle cleansing shampoo for dogs that keeps the coat clean, soft and fresh." },
  { id: 12, name: "Dental Chew Sticks (pack of 10)", category: "dogs", type: "Food", price: 85, 
    image: img("Dental-Chew-Sticks.jpg"),
    description: "Tasty chew sticks that help reduce tartar and keep your dog's breath fresh." },

  // ---------- BIRDS ----------
  { id: 13, name: "Mixed Seeds for Parrots 1kg", category: "birds", type: "Food", price: 70, 
    image: img("Mixed-Seeds-Parrots.jpg"),
    description: "A tasty mix of seeds and grains for parrots and large birds." },
  { id: 14, name: "Hanging Bell & Mirror Toy", category: "birds", type: "Toys", price: 35, 
    image: img("Hanging-Belly.jpg"),
    description: "Colorful hanging toy with a bell and a small mirror to keep your bird busy and happy." },
  { id: 15, name: "Large Bird Cage with Stand", category: "birds", type: "Accessories", price: 650, 
    image: img("Large-Bird-Cage.jpg"),
    description: "Spacious metal cage with perches, feeders and a removable tray for easy cleaning." },
  { id: 16, name: "Soft Nest for Small Birds", category: "birds", type: "Beds", price: 60, 
    image: img("Soft-Nest-Small-Birds.jpg"),
    description: "Cozy woven nest where small birds can rest and feel safe." },
  { id: 17, name: "Bird Bath & Mist Spray 200ml", category: "birds", type: "Hygiene", price: 48, 
    image: img("Bird-Bath-Mist-Spray.jpg"),
    description: "Gentle spray that helps keep feathers clean and healthy." },
  { id: 18, name: "Canary Food Premium 500g", category: "birds", type: "Food", price: 42, 
    image: img("Canary-Food-Premium.jpg"),
    description: "Balanced seed mix made especially for canaries and small singing birds." },
];

export const initialOrders = [
  { id: "ORD-1001", customer: "Assia", phone: "0612345678", products: "Premium Dry Cat Food 2kg x2", total: 418, status: "Delivered", userEmail: "" },
  { id: "ORD-1002", customer: "Sara", phone: "0661223344", products: "Comfort Orthopedic Dog Bed x1", total: 560, status: "Shipped", userEmail: "" },
  { id: "ORD-1003", customer: "Sabrine", phone: "0677889900", products: "Large Bird Cage with Stand x1, Mixed Seeds for Parrots 1kg x2", total: 790, status: "Pending", userEmail: "" },
];

export const initialBookings = [
  { id: "BK-2001", customer: "Kassi Salma", phone: "0600112233", petType: "Cat", petName: "Bersya", checkIn: "2026-12-20", checkOut: "2026-12-27", notes: "Needs wet food twice a day", status: "Confirmed" },
  { id: "BK-2002", customer: "Khadija kassi", phone: "0655443322", petType: "Dog", petName: "Rex", checkIn: "2026-12-22", checkOut: "2026-12-25", notes: "", status: "Pending" },
];

export const initialUsers = [
  { name: "User", email: "User@michaland.ma", phone: "0621147534", password: "User123" },
];
