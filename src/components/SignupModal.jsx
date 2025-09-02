import { useState } from "react";
import { authService } from "../services/api.js";
import { cookieService } from "../services/cookieService.js";
import "../assets/styles/Modals.css";

const SignupModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    newsletter: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.signup({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        newsletter: formData.newsletter,
      });
      console.log("Inscription réussie:", response);

      // Sauvegarder le token
      cookieService.setToken(response.token);

      // Appeler le callback de succès avec les données utilisateur
      onSuccess(response);
    } catch (error) {
      setError(error.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>S'inscrire</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleInputChange}
            required
          />

          <label>
            <input
              type="checkbox"
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleInputChange}
            />
            Newsletter
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#09b1ba",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              padding: "10px",
            }}
          >
            {loading ? "Chargement..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
