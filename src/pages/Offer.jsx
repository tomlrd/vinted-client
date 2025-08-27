import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Offer = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/offers/${id}`
        );
        const data = await response.json();
        setOffer(data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'offre:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!offer) {
    return <div>Offre non trouvée</div>;
  }

  return (
    <main>
      <div className="offer-details">
        <Link to="/offers" className="back-link">
          ← Retour aux annonces
        </Link>

        <div className="offer-content">
          <div className="offer-image-section">
            {offer.product_image && offer.product_image.secure_url ? (
              <img
                src={offer.product_image.secure_url}
                alt={offer.product_name}
                className="main-image"
              />
            ) : (
              <div className="no-image">Pas d'image</div>
            )}
          </div>

          <div className="offer-info-section">
            <h1>{offer.product_name}</h1>
            <p className="price">{offer.product_price} €</p>
            <p className="description">{offer.product_description}</p>

            {offer.product_details && offer.product_details.length > 0 && (
              <div className="details">
                <h3>Détails</h3>
                <ul>
                  {offer.product_details.map((detail, index) => {
                    const [key, value] = Object.entries(detail)[0];
                    return (
                      <li key={index}>
                        <strong>{key}:</strong> {value}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {offer.owner && (
              <div className="owner-info">
                <h3>Vendeur</h3>
                <p>{offer.owner.account?.username || "Utilisateur"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Offer;
