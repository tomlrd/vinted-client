import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { offersService, userService } from "../services/api.js";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserAndOffers = async () => {
      try {
        setLoading(true);

        // Récupérer les données utilisateur
        const userData = await userService.getUser(id);
        setUser(userData);

        // Récupérer les offres de l'utilisateur
        const offersData = await offersService.getOffersByUser(id);
        setOffers(offersData.offers || []);
      } catch (error) {
        setError("Erreur lors du chargement du profil utilisateur");
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOffers();
  }, [id]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return <div>Utilisateur non trouvé</div>;
  }

  return (
    <main>
      <div className="user-profile-container">
        <div className="user-profile-header">
          <div className="user-avatar-large">
            {user.account?.avatar?.secure_url ? (
              <img
                src={user.account.avatar.secure_url}
                alt={user.account.username}
              />
            ) : (
              <div className="avatar-placeholder-large">
                {user.account?.username?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="user-info">
            <h1>{user.account?.username || "Utilisateur"}</h1>
            <p className="user-email">{user.email}</p>
            <p className="user-joined">
              Membre depuis{" "}
              {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <div className="user-stats-inline">
            <div className="stat-item">
              <span className="stat-number">{offers.length}</span>
              <span className="stat-label">Annonces</span>
            </div>
          </div>
        </div>

        {/* Liste des annonces de l'utilisateur */}
        {offers.length > 0 ? (
          <div className="user-offers">
            <h2>Annonces de {user.account?.username}</h2>
            <div className="offers-grid">
              {offers.map((offer) => (
                <Link
                  key={offer._id}
                  to={`/offer/${offer._id}`}
                  className="offer-card"
                >
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
                  <div className="offer-info">
                    <h3>{offer.product_name}</h3>
                    <p className="price">{offer.product_price} €</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-offers">
            <p>Aucune annonce publiée pour le moment.</p>
          </div>
        )}
      </div>
    </main>
  );
};

// Export du composant UserProfile
export default UserProfile;
