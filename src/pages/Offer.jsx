import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserBadge from "../components/UserBadge.jsx";
import { offersService } from "../services/api.js";

const Offer = ({ currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const data = await offersService.getOffer(id);
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

  const hasImages = offer.product_images && offer.product_images.length > 0;
  const mainImage = hasImages ? offer.product_images[selectedImageIndex] : null;

  // Vérifier si l'utilisateur connecté est l'auteur de l'offre
  const isOwner =
    currentUser && offer.owner && currentUser._id === offer.owner._id;

  const handleDeleteOffer = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      return;
    }

    try {
      setDeleting(true);
      await offersService.deleteOffer(offer._id);
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression de l'offre");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main>
      <div className="offer-details">
        <div className="offer-content">
          <div className="offer-image-section">
            {/* Image principale */}
            {mainImage && mainImage.secure_url ? (
              <img
                src={mainImage.secure_url}
                alt={offer.product_name}
                className="main-image"
              />
            ) : (
              <div className="no-image">Pas d'image</div>
            )}

            {/* Carrousel de miniatures */}
            {hasImages && offer.product_images.length > 1 && (
              <div className="image-carousel">
                <div className="carousel-container">
                  {offer.product_images.map((image, index) => (
                    <div
                      key={index}
                      className={`carousel-thumbnail ${
                        index === selectedImageIndex ? "active" : ""
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={image.secure_url}
                        alt={`${offer.product_name} - Image ${index + 1}`}
                        className="thumbnail-image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="offer-info-section">
            <div className="offer-header">
              <h1>{offer.product_name}</h1>
              <div className="offer-actions">
                {isOwner ? (
                  <button
                    onClick={handleDeleteOffer}
                    disabled={deleting}
                    className="delete-offer-btn"
                    title="Supprimer cette offre"
                  >
                    {deleting ? "Suppression..." : "Supprimer"}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/payment/${offer._id}`)}
                    className="buy-offer-btn"
                    title="Acheter cette offre"
                  >
                    Acheter
                  </button>
                )}
              </div>
            </div>
            <p className="price">{offer.product_price} €</p>
            <p className="description">{offer.product_description}</p>

            {/* Informations principales de l'offre */}
            <div className="offer-main-details">
              {offer.product_size && (
                <div className="detail-item">
                  <span className="detail-label">Taille :</span>
                  <span className="detail-value">{offer.product_size}</span>
                </div>
              )}
              {offer.product_condition && (
                <div className="detail-item">
                  <span className="detail-label">État :</span>
                  <span className="detail-value">
                    {offer.product_condition}
                  </span>
                </div>
              )}
              {offer.product_brand && (
                <div className="detail-item">
                  <span className="detail-label">Marque :</span>
                  <span className="detail-value">{offer.product_brand}</span>
                </div>
              )}
              {offer.product_color && (
                <div className="detail-item">
                  <span className="detail-label">Couleur :</span>
                  <span className="detail-value">{offer.product_color}</span>
                </div>
              )}
              {offer.product_city && (
                <div className="detail-item">
                  <span className="detail-label">Localisation :</span>
                  <span className="detail-value">{offer.product_city}</span>
                </div>
              )}
            </div>

            {/* Détails supplémentaires si disponibles */}
            {offer.product_details && offer.product_details.length > 0 && (
              <div className="details">
                <h3>Détails supplémentaires</h3>
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
                <div className="owner-badge">
                  <UserBadge user={offer.owner} size="default" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Offer;
