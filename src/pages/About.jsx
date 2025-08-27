import { Link } from "react-router-dom";
import logo from "../assets/react.svg";

const About = () => {
  return (
    <main>
      <h1>Nous sommes sur la page About</h1>
      <Link to="/">
        <img src={logo} alt="logo react" />
      </Link>
      <div>
        <a href="https://www.google.com">Lien vers Google avec balise "a"</a>
      </div>
    </main>
  );
};

export default About;
