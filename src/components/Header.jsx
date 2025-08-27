import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Vinted</h1>
        </Link>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher des articles..."
            className="search-input"
          />
        </div>

        <div className="header-buttons">
          <button className="btn-signup">S'inscrire</button>
          <button className="btn-login">Se connecter</button>
          <button className="btn-sell">Vends tes articles</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
