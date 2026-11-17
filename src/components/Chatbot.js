import { useState, useRef, useEffect } from "react";
import { DELIVERY_FEE, FREE_DELIVERY_LIMIT, FALLBACK_IMAGE } from "../data";

const ASSISTANT_IMAGE = "/images/micha-assist.png";

// Decorative avatar shared by the launcher, the header and the messages.
// The local logo is used as a fallback; if that also fails, a clean initial takes over.
function AssistantAvatar({ className }) {
  const [src, setSrc] = useState(ASSISTANT_IMAGE);
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (src === FALLBACK_IMAGE) {
      setFailed(true);
      return;
    }
    setSrc(FALLBACK_IMAGE);
  };

  if (failed) {
    return (
      <span className={`${className} assistant-avatar--fallback`} aria-hidden="true">
        M
      </span>
    );
  }

  return <img className={className} src={src} alt="" aria-hidden="true" onError={handleError} />;
}

// Groq API configuration
const API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const MODEL = "openai/gpt-oss-120b";

const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const WELCOME =
  "Bonjour ! Je suis Micha, l’assistant virtuel de MichaLand. Je peux vous aider avec nos produits, la livraison ou l’hôtel pour animaux.";

// System instructions: French only, no second greeting, grounded in site data.
function buildSystemPrompt(products) {
  const catalog = products
    .map(
      (p) =>
        `- ${p.name} | catégorie: ${p.category} | type: ${p.type} | prix: ${p.price} DH | ${p.description}`
    )
    .join("\n");

  return `Tu es Micha, l'assistant virtuel de MichaLand, une animalerie et un hôtel pour animaux en ligne au Maroc.

LANGUE:
- Réponds toujours en français, même si l'utilisateur écrit dans une autre langue.
- Ne utilise ni anglais ni arabe dans tes réponses.

SALUTATION:
- La fenêtre affiche déjà un message de bienvenue. Ne dis jamais bonjour, salut ou bonsoir, et ne te présente plus jamais.
- Commence directement par la réponse utile.

TON:
- Chaleureux, concis et utile : 1 à 4 phrases courtes.
- Professionnel et simple. Pas de suite d'émojis ; un seul emoji animal au plus, seulement si cela aide.
- Ne répète pas la même formulation d'une réponse à l'autre.

PRIORITÉS:
- Produits, chats, chiens, oiseaux.
- Livraison, panier, favoris.
- Réservation de l'hôtel pour animaux.

RÈGLES STRICTES:
- Ne mentionne que les produits, prix et politiques qui apparaissent ci-dessous.
- N'INVENTE JAMAIS de prix, stocks, réductions, commandes, réservations ou politiques.
- Si l'information manque, dis-le simplement et propose une action concrète : consulter les produits, réserver l'hôtel ou contacter l'équipe via le pied de page.
- Tous les prix sont en Dirhams marocains (DH).
- Pour une question médicale ou d'urgence, ne diagnostique pas : donne un conseil de base prudent et recommande un vétérinaire.
- Ramène poliment la conversation vers les animaux ou MichaLand si le sujet est sans rapport.

INFORMATIONS SITE WEB:
- Menu: Accueil, Chats, Chiens, Oiseaux, Hôtel, Favoris.
- Barre de recherche et icône de profil disponibles.
- Le panier est le bouton flottant en bas à gauche.
- Boutique: chercher, filtrer par catégorie (Chats, Chiens, Oiseaux), voir les détails, ajouter au panier et aux favoris.
- Livraison: ${DELIVERY_FEE} DH.
- Livraison GRATUITE quand le total dépasse ${FREE_DELIVERY_LIMIT} DH.
- Commande: cliquer sur Commander, remplir nom complet, téléphone, adresse et ville, puis confirmer.
- Hôtel: ouvrir Hôtel et remplir nom client, téléphone, type animal (Chat/Chien/Oiseau), nom animal, dates et instructions, puis cliquer Réserver.
- Les dates ne peuvent pas être dans le passé. L'équipe contacte le client pour confirmer.
- Aucun prix d'hôtel n'est défini sur le site. N'en invente jamais.

CATALOGUE PRODUITS:
${catalog}`;
}

// Remove any automatic second greeting the model might still produce.
function cleanAnswer(raw) {
  let text = String(raw || "").trim();

  text = text
    .replace(/^(?:bonjour|bonsoir|salut|coucou|hello|hi|hey)\b[^.!?\n]*[.!?\n]?\s*/i, "")
    .replace(/^je suis (?:micha|l['’]assistant)[^.!?\n]*[.!?\n]?\s*/i, "")
    .trim();

  if (!text) return "Je vous écoute. Comment puis-je vous aider ?";

  // Last-resort guard so an off-language answer never reaches the user.
  const englishWords = /\b(the|you|your|for|with|our|we|can|help|would|please|thanks|products|delivery|hotel)\b/i;
  const frenchWords = /\b(le|la|les|vous|votre|nos|nous|peux|produits|livraison|hôtel|merci|pour|avec)\b/i;
  if (englishWords.test(text) && !frenchWords.test(text)) {
    return "Désolé, je n’ai pas pu formuler cette réponse en français. Pouvez-vous reformuler votre question ?";
  }

  return text;
}

function Chatbot({ products = [] }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fabRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);

  // Keep the newest message in view without moving the fixed input area.
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, loading, error, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closePanel();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function closePanel() {
    setOpen(false);
    // Focus after React has hidden the panel, so it is not pulled back into it.
    requestAnimationFrame(() => fabRef.current?.focus());
  }

  // Send message to Groq
  const sendMessage = async (e) => {
    e.preventDefault();

    const text = input.trim();

    if (!text || loading) return;

    setError("");

    if (!API_KEY) {
      setError("Clé API manquante. Ajoutez REACT_APP_GROQ_API_KEY dans votre fichier .env et redémarrez le serveur.");
      return;
    }

    const newMessages = [...messages, { role: "user", content: text }];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Keep the last 12 conversation messages
      const history = newMessages
        .slice(1)
        .slice(-12)
        .map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        }));

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: buildSystemPrompt(products) },
            ...history,
          ],
          temperature: 0.5,
          max_tokens: 500,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const reason = data.error?.message || "Erreur inconnue";
        console.error("Groq API Error:", response.status, data);

        if (response.status === 401 || response.status === 403) {
          throw new Error("Clé API Groq invalide. Vérifiez votre fichier .env.");
        }
        if (response.status === 429) {
          throw new Error("Limite d'utilisation Groq atteinte. Patientez et réessayez.");
        }
        if (response.status === 503) {
          throw new Error("Serveurs Groq temporairement indisponibles. Réessayez plus tard.");
        }
        throw new Error(`Erreur Groq (${response.status}): ${reason}`);
      }

      const answer = data.choices?.[0]?.message?.content;

      if (!answer) {
        throw new Error("Micha assist n'a pas pu générer de réponse. Réessayez.");
      }

      setMessages([...newMessages, { role: "assistant", content: cleanAnswer(answer) }]);
    } catch (err) {
      console.error("Chatbot Error:", err);
      if (err instanceof TypeError) {
        setError("Erreur réseau. Vérifiez votre connexion et réessayez.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Launcher stays visible so the panel can be anchored directly above it. */}
      <button
        ref={fabRef}
        type="button"
        className="chat-fab"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="micha-assist-panel"
        aria-label={open ? "Fermer Micha assist" : "Ouvrir Micha assist"}
      >
        <AssistantAvatar className="chat-fab__image" />
      </button>

      <div
        id="micha-assist-panel"
        className={`chat-window${open ? " chat-window--open" : ""}`}
        role="dialog"
        aria-label="Micha assist"
        aria-hidden={!open}
      >
        <div className="chat-window__header">
          <AssistantAvatar className="chat-window__avatar" />
          <div className="chat-window__info">
            <div className="chat-window__title">Micha assist</div>
            <div className="chat-window__subtitle">Assistant virtuel MichaLand</div>
          </div>
          <button
            type="button"
            className="chat-window__close"
            onClick={closePanel}
            aria-label="Fermer Micha assist"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div
          className="chat-window__messages"
          ref={messagesRef}
          role="log"
          aria-live="polite"
          aria-label="Conversation avec Micha assist"
        >
          {messages.map((m, index) => (
            <div key={index} className={`message-row ${m.role === "user" ? "message-row--user" : ""}`}>
              {m.role === "assistant" && <AssistantAvatar className="message-avatar" />}
              <div className={`message ${m.role === "user" ? "message--user" : "message--assistant"}`}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row">
              <AssistantAvatar className="message-avatar" />
              <div className="message message--assistant typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}

          {error && (
            <div className="chat-error" role="alert">{error}</div>
          )}
        </div>

        <form className="chat-window__input" onSubmit={sendMessage}>
          <input
            ref={inputRef}
            className="chat-window__input-field"
            type="text"
            placeholder="Écrivez votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            aria-label="Votre message"
          />
          <button
            className="chat-window__send"
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Envoyer"
          >
            Envoyer
          </button>
        </form>
      </div>
    </>
  );
}

export default Chatbot;
