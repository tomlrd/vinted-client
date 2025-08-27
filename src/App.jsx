import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import About from "./pages/About";
import Home from "./pages/Home";
import Offer from "./pages/Offer";
import Offers from "./pages/Offers";
import Product from "./pages/Product";

function App() {
  // Le composant App.jsx ne contiendra plus que le ROUTER
  // Le router contient un composant Routes, qui contiendra chaque Route
  // Chaque Route a deux props : "path", et "element"

  // N'utilisez les balises "a" que dans le cas ou vous voulez rediriger votre utilisateur sur un site externe !
  // Pour les liens menant à une autre page, on préférera le Link (car la page n'est pas rechargée)
  // Ce qui est mis entre la balise ouvrante et la balise fermante du Link, sera clickable, d'une, et redirigera selon le path donné à la props "to"
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/offer/:id" element={<Offer />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
