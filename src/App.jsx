import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Header } from "./components";
import AddOffer from "./pages/AddOffer";
import Home from "./pages/Home";
import Offer from "./pages/Offer";
import Payment from "./pages/Payment";
import UserProfile from "./pages/UserProfile";
import { userService } from "./services/api.js";
import { cookieService } from "./services/cookieService.js";

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
    </Router>
  );
}

export default App;
