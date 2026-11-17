// Small validation helpers used by the forms. Each one returns an error message, or "" if the value is OK.

// today's date as YYYY-MM-DD (local time)
export const todayString = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

// Moroccan phone: 0612345678 or +212612345678
export const checkPhone = (phone) => {
  const cleaned = phone.replace(/[\s.-]/g, "");
  if (!/^(0|\+212)[5-7]\d{8}$/.test(cleaned)) {
    return "Numéro de téléphone invalide (exemple : 0612345678 ou +212612345678).";
  }
  return "";
};

// Password: at least 6 characters, one UPPERCASE letter and one lowercase letter
export const checkPassword = (password) => {
  if (password.length < 6) return "Le mot de passe doit contenir au moins 6 caractères.";
  if (!/[A-Z]/.test(password)) return "Le mot de passe doit contenir au moins une majuscule.";
  if (!/[a-z]/.test(password)) return "Le mot de passe doit contenir au moins une minuscule.";
  return "";
};

// Dates: check-in cannot be in the past, check-out must be after check-in
export const checkDates = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return "Veuillez choisir les dates d'arrivée et de départ.";
  if (checkIn < todayString()) return "La date d'arrivée ne peut pas être dans le passé.";
  if (checkOut <= checkIn) return "La date de départ doit être après la date d'arrivée.";
  return "";
};

// Names: at least 2 characters (not only spaces)
export const checkName = (name, label = "Nom") => {
  if (name.trim().length < 2) return `${label} doit contenir au moins 2 caractères.`;
  return "";
};
