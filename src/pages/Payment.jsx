import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../assets/styles/Payment.css";
import CheckoutForm from "../components/CheckoutForm";
import { offersService } from "../services/api.js";

// Cette ligne permet de vous connecter à votre compte Stripe en fournissant votre clef publique
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
    "pk_test_51S2uYWE8Bs6v6QxaAPqMVsYulDAG357j9K6sMShCHyJMwmZvqIMspWuPzZBlWvWmWp0rGBtEEtloy4J4pRNgZIZ100ExaR5gjx"
);

const Payment = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const data = await offersService.getOffer(offerId);
        setOffer(data);
      } catch (error) {
        setError("Erreur lors du chargement de l'offre");
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    if (offerId) {
      fetchOffer();
    }
  }, [offerId]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error || !offer) {
    return (
      <div>
        <p>{error || "Offre non trouvée"}</p>
        <button onClick={() => navigate("/")}>Retour à l'accueil</button>
      </div>
    );
  }

  const options = {
    // Type de transaction
    mode: "payment",
    // Montant de la transaction
    amount: offer.product_price,
    // Devise de la transaction
    currency: "eur",
    // On peut customiser l'apparence ici
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#09b1ba",
      },
    },
  };

  return (
    <main>
      <div className="payment-container">
        {/* Résumé de la commande */}
        <div className="order-summary">
          <h2>Résumé de la commande</h2>

          <div className="order-details">
            <div className="order-line">
              <span className="order-label">Commande</span>
              <span className="order-value">{offer.product_price} €</span>
            </div>

            <div className="order-line">
              <span className="order-label">Frais protection acheteurs</span>
              <span className="order-value">1.00 €</span>
            </div>

            <div className="order-line">
              <span className="order-label">Frais de port</span>
              <span className="order-value">2.00 €</span>
            </div>

            <div className="order-line total">
              <span className="order-label">Total</span>
              <span className="order-value">
                {(offer.product_price + 3).toFixed(2)} €
              </span>
            </div>
          </div>

          <div className="order-message">
            {paymentCompleted ? (
              <div className="payment-success">
                <h2>🎉 Paiement effectué avec succès !</h2>
                <p>
                  Votre commande a été validée et sera expédiée prochainement.
                </p>
              </div>
            ) : (
              <>
                <p>
                  Il ne vous reste plus qu'une étape pour vous offrir{" "}
                  <strong>{offer.product_name}</strong>. 😍
                </p>
                <p>
                  Vous allez payer{" "}
                  <strong>{(offer.product_price + 3).toFixed(2)} €</strong>{" "}
                  (frais de protection et frais de port inclus).
                </p>
              </>
            )}
          </div>
        </div>

        {/* Le composant Elements doit contenir toute notre logique de paiement */}
        {/* On lui donner la preuve que nous sommes connectés et les options de paiement */}
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm
            offer={offer}
            onPaymentCompleted={(completed) => setPaymentCompleted(completed)}
          />
        </Elements>
      </div>
    </main>
  );
};

export default Payment;
