import { useNavigate } from "react-router-dom";
import "../assets/styles/CardOffer.css";
import UserBadge from "./UserBadge.jsx";

const CardOffer = ({ offer }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/offer/${offer._id}`);
  };

  return (
    <div className="offer-card" onClick={handleCardClick}>
      {/* Badge utilisateur sur une ligne */}
      {offer.owner && (
        <div className="offer-user-badge" onClick={(e) => e.stopPropagation()}>
          <UserBadge user={offer.owner} size="small" />
        </div>
      )}

      {/* Image sur une ligne */}
      <div className="offer-image">
        {offer.product_images &&
        offer.product_images.length > 0 &&
        offer.product_images[0].secure_url ? (
          <img
            src={offer.product_images[0].secure_url}
            alt={offer.product_name}
          />
        ) : (
          <div className="no-image">Pas d'image</div>
        )}
      </div>

      {/* Informations de l'offre sur des lignes séparées */}
      <div className="offer-info">
        <h3 className="offer-title">{offer.product_name}</h3>
        <p className="offer-price">{offer.product_price} €</p>
        {offer.product_size && (
          <p className="offer-size">{offer.product_size}</p>
        )}
        {offer.product_brand && (
          <p className="offer-brand">{offer.product_brand}</p>
        )}
      </div>
    </div>
  );
};

export default CardOffer;
