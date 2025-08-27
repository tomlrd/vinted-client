import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Header from "./components/Header";
import Footer from "./components/Footer";
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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
