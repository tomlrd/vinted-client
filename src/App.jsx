import { Suspense, lazy, useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Header } from "./components";
import { userService } from "./services/api.js";
import { cookieService } from "./services/cookieService.js";

// Lazy Loading des composants
const Home = lazy(() => import("./pages/Home"));
const AddOffer = lazy(() => import("./pages/AddOffer"));
const Offer = lazy(() => import("./pages/Offer"));
const Payment = lazy(() => import("./pages/Payment"));
const UserProfile = lazy(() => import("./pages/UserProfile"));

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: "",
    priceMin: 0,
    priceMax: 500,
    sort: "",
    page: 1,
    limit: 8,
  });

  // Charger l'utilisateur au montage si token présent
  useEffect(() => {
    const loadUser = async () => {
      const token = cookieService.getToken();
      if (token) {
        try {
          const userData = await userService.getCurrentUser();
          setCurrentUser(userData);
        } catch (error) {
          console.error("Erreur lors du chargement de l'utilisateur:", error);
          if (error.response?.status === 401) {
            cookieService.logout();
            setCurrentUser(null);
          }
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    cookieService.logout();
    setCurrentUser(null);
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <Router>
      <Header
        currentUser={currentUser}
        loading={loading}
        onLogout={handleLogout}
        onLoginSuccess={handleLoginSuccess}
        onFiltersChange={handleFiltersChange}
        currentFilters={filters}
      />
      <Suspense fallback={<div className="loading-spinner">Chargement...</div>}>
        <Routes>
          <Route path="/" element={<Home filters={filters} />} />
          <Route
            path="/offer/:id"
            element={<Offer currentUser={currentUser} />}
          />
          <Route
            path="/add-offer"
            element={<AddOffer currentUser={currentUser} />}
          />
          <Route path="/payment/:offerId" element={<Payment />} />
          <Route path="/user/:id" element={<UserProfile />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
