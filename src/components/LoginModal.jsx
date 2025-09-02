import { useState } from "react";
import { authService } from "../services/api.js";
import { cookieService } from "../services/cookieService.js";

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      console.log("Login réussi:", response);

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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>Se connecter</h2>

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
            {loading ? "Chargement..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
