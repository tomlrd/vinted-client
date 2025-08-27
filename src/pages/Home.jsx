import { Link } from "react-router-dom";

// pour fonctionner, le composant Link a besoin d'une props : "to"

const Home = () => {
  const productId = "2345678";
  return (
    <main>
      <h1>Nous sommes sur la page Home</h1>
      <Link to="/about">Lien vers la page About</Link>
      <br />
      <Link to="/product/2345678">Lien vers la page Product</Link>
      <br />
      <Link to="/product/987654">Lien vers la page Product</Link>
      <br />
      <Link to="/product/pantalon">Lien vers la page Product</Link>
      <br />
    </main>
  );
};

export default Home;
