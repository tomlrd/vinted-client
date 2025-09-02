import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import "../assets/styles/CheckoutForm.css";
import { offersService } from "../services/api.js";

const CheckoutForm = ({ offer, onPaymentCompleted }) => {
  const buyerProtectionFee = 1.0; // Frais protection acheteurs
  const shippingFee = 2.0; // Frais de port

  // Permet de faire une requête à Stripe pour confirmer le paiement
  const stripe = useStripe();
  // Permet de récupérer le contenu des inputs
  const elements = useElements();

  // State qui gère les messages d'erreurs
  const [errorMessage, setErrorMessage] = useState(null);
  // State qui gère le fait que le paiement a été effectué
  const [completed, setCompleted] = useState(false);
  // State qui gère le fait qu'on est en train de payer
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // On commence à charger
    setIsLoading(true);
    setErrorMessage(null);

    if (elements == null) {
      return;
    }

    // Vérification et validation des infos entrées dans les inputs
    const { error: submitError } = await elements.submit();
    if (submitError) {
      // Affiche l'erreur en question
      setErrorMessage(submitError.message);
      setIsLoading(false);
      return;
    }

    try {
      // Calculer le total avec les frais
      const totalAmount =
        offer.product_price + buyerProtectionFee + shippingFee;

      // Demande au backend de créer l'intention de paiement, il nous renvoie le clientSecret
      const response = await offersService.createPayment({
        amount: totalAmount,
        currency: "eur",
        description: `Achat de ${offer.product_name}`,
        offerId: offer._id,
      });

      const clientSecret = response.client_secret;

      // Requête à Stripe pour valider le paiement
      const stripeResponse = await stripe.confirmPayment({
        // elements contient les infos et la configuration du paiement
        elements,
        clientSecret,
        // Éventuelle redirection
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        // Bloque la redirections
        redirect: "if_required",
      });

      // Si une erreur a lieu pendant la confirmation
      if (stripeResponse.error) {
        // On la montre au client
        setErrorMessage(stripeResponse.error.message);
      }

      // Si on reçois un status succeeded on fais passer completed à true
      if (stripeResponse.paymentIntent?.status === "succeeded") {
        setCompleted(true);
        // Notifier le composant parent que le paiement est terminé
        if (onPaymentCompleted) {
          onPaymentCompleted(true);
        }
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Erreur lors du paiement"
      );
    } finally {
      // On a fini de charger
      setIsLoading(false);
    }
  };

  if (completed) {
    return null; // Ne rien afficher ici quand le paiement est terminé
  }

  return (
    <div className="checkout-form">
      <h3>Informations de paiement</h3>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button
          type="submit"
          disabled={!stripe || !elements || isLoading}
          className="pay-button"
        >
          {isLoading ? "Traitement..." : `Payer`}
        </button>

        {/* Éventuel message d'erreur */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default CheckoutForm;
