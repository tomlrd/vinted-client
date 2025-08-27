import { useParams } from "react-router-dom";

const Product = () => {
  // un hook est le nom que l'on donne à une fonction commencant par "use"
  const params = useParams();
  console.log("params =>", params); // { id : 2345678 }
  return <div>Bienvenue sur la page présentant le produit : {params.id}</div>;
};

export default Product;
