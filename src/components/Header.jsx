import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Filters from "./Filters.jsx";
import LoginModal from "./LoginModal.jsx";
import SignupModal from "./SignupModal.jsx";
import UserBadge from "./UserBadge.jsx";

const Header = ({
  currentUser,
  loading,
  onLogout,
  onLoginSuccess,
  onFiltersChange,
  currentFilters,
}) => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleSellClick = () => {
    if (currentUser) {
      navigate("/add-offer");
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            <div className="logo-image"></div>
          </Link>

          <div className="search-section">
            <Filters
              onFiltersChange={onFiltersChange}
              currentFilters={currentFilters}
            />
          </div>

          <div className="header-buttons">
            {!loading && currentUser ? (
              <>
                <UserBadge user={currentUser} />
                <button className="btn-logout" onClick={handleLogout}>
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-signup"
                  onClick={() => setIsSignupModalOpen(true)}
                >
                  S'inscrire
                </button>
                <button
                  className="btn-login"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Se connecter
                </button>
              </>
            )}
            <button className="btn-sell" onClick={handleSellClick}>
              Vends tes articles
            </button>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={(userData) => {
          onLoginSuccess(userData);
          setIsLoginModalOpen(false);
        }}
      />

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSuccess={(userData) => {
          onLoginSuccess(userData);
          setIsSignupModalOpen(false);
        }}
      />
    </>
  );
};

export default Header;
