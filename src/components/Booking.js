import { useState } from "react";
import { todayString, checkDates, checkPhone, checkName } from "../validation";

const emptyForm = {
  customer: "",
  phone: "",
  petType: "Cat",
  petName: "",
  checkIn: "",
  checkOut: "",
  notes: "",
};

function Booking({ addBooking, user }) {
  const [form, setForm] = useState({ ...emptyForm, customer: user ? user.name : "", phone: user && user.phone ? user.phone : "" });
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState("");

  const today = todayString();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const message =
      checkName(form.customer, "Nom du client") ||
      checkPhone(form.phone) ||
      checkName(form.petName, "Nom de l'animal") ||
      checkDates(form.checkIn, form.checkOut);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    const id = addBooking(form);
    setBookingId(id);
  };

  const newBooking = () => {
    setBookingId("");
    setForm({ ...emptyForm, customer: form.customer, phone: form.phone });
  };

  if (bookingId) {
    return (
      <section className="section" aria-labelledby="booking-success-title">
        <div className="container">
          <div className="message-box message-box--success" role="status">
            <span className="message-box__icon" aria-hidden="true">✅</span>
            <h2 id="booking-success-title" className="message-box__title">Réservation reçue !</h2>
            <p className="message-box__text">
              Merci <strong>{form.customer}</strong>. Votre demande <strong>{bookingId}</strong> pour
              <strong>{form.petName}</strong> ({form.petType}) du <strong>{form.checkIn}</strong> au
              <strong>{form.checkOut}</strong> a été envoyée.
            </p>
            <p className="message-box__text">Nous vous contacterons au <strong>{form.phone}</strong> pour confirmer.</p>
            <button className="btn btn--primary" onClick={newBooking}>Nouvelle réservation</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" aria-labelledby="booking-title">
      <div className="container">
        <h2 id="booking-title" className="section-title">Réservation hôtel pour animaux</h2>
        <div className="booking-layout">
          <aside className="booking__sidebar">
            <img className="booking__sidebar-img" src="/images/booking-cat.jpg" alt="Chat dormant dans un lit douillet" onError={(e) => { e.target.onerror = null; e.target.src = "/images/cat-shopping.png"; }} />
            <h3 className="booking__sidebar-title">Un séjour douillet pour votre animal</h3>
            <p className="booking__sidebar-text">Remplissez le formulaire et nous vous contacterons pour confirmer la réservation. Chats, chiens et oiseaux sont les bienvenus.</p>
          </aside>

          <form className="form" onSubmit={handleSubmit} aria-labelledby="booking-form-title">
            <h3 id="booking-form-title" className="form__title">Nouvelle réservation</h3>
            <div className="form__grid">
              <div className="form-group">
                <label className="form-label" htmlFor="booking-customer">Nom du client</label>
                <input className="input" id="booking-customer" name="customer" value={form.customer} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="booking-phone">Téléphone</label>
                <input className="input" id="booking-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="booking-petType">Type d'animal</label>
                <select className="input" id="booking-petType" name="petType" value={form.petType} onChange={handleChange}>
                  <option value="Cat">Chat</option>
                  <option value="Dog">Chien</option>
                  <option value="Bird">Oiseau</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="booking-petName">Nom de l'animal</label>
                <input className="input" id="booking-petName" name="petName" value={form.petName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="booking-checkIn">Date d'arrivée</label>
                <input className="input" id="booking-checkIn" name="checkIn" type="date" min={today} value={form.checkIn} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="booking-checkOut">Date de départ</label>
                <input className="input" id="booking-checkOut" name="checkOut" type="date" min={form.checkIn || today} value={form.checkOut} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="booking-notes">Instructions particulières</label>
              <textarea className="input" id="booking-notes" name="notes" rows="4" placeholder="Nourriture, médicaments, habitudes..." value={form.notes} onChange={handleChange} />
            </div>

            {error && <p className="form-error" role="alert">⚠️ {error}</p>}
            <button className="btn btn--primary btn--lg" type="submit">Réserver maintenant</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Booking;