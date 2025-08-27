import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main>
      <div className="hero">
        <div className="hero-content">
          <h1>Prêts à faire du tri dans vos placards ?</h1>
          <p>Vendez les vêtements que vous ne portez plus</p>
          <Link to="/offers" className="cta-button">
            Voir les annonces
          </Link>
        </div>
      </div>

      <div className="features">
        <div className="feature">
          <h3>Vendez en toute simplicité</h3>
          <p>Publiez vos articles en quelques clics</p>
        </div>
        <div className="feature">
          <h3>Achetez en toute sécurité</h3>
          <p>Des milliers d'articles vérifiés</p>
        </div>
        <div className="feature">
          <h3>Économisez et gagnez</h3>
          <p>Mode d'occasion, prix imbattables</p>
        </div>
      </div>
    </main>
  );
};

export default Home;
