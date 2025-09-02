import { useNavigate } from "react-router-dom";
import "../assets/styles/Home.css";
import OffersList from "../components/OffersList.jsx";

const Home = ({ filters }) => {
  const navigate = useNavigate();

  const handleStartSelling = () => {
    // On navigue directement vers la page d'ajout d'offre
    // La vérification d'authentification se fera dans AddOffer
    navigate("/add-offer");
  };

  return (
    <main>
      <div className="hero">
        <div className="hero-content">
          <div className="hero-card">
            <h1>Prêts à faire du tri dans vos placards ?</h1>
            <p>Vendez les vêtements que vous ne portez plus</p>
            <div className="hero-buttons">
              <button
                onClick={handleStartSelling}
                className="cta-button-secondary"
              >
                Commencer à vendre
              </button>
            </div>
          </div>
        </div>
      </div>

      <OffersList filters={filters} />
    </main>
  );
};

export default Home;
