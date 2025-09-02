import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import "../assets/styles/AddOffer.css";
import { offersService } from "../services/api.js";

const AddOffer = ({ currentUser }) => {
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est connecté au chargement de la page
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    condition: "",
    city: "",
    brand: "",
    size: "",
    color: "",
  });
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    onDrop: (acceptedFiles) => {
      const newPictures = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setPictures((prev) => [...prev, ...newPictures]);
    },
  });

  const removePicture = (index) => {
    setPictures((prev) => {
      const newPictures = [...prev];
      URL.revokeObjectURL(newPictures[index].preview);
      newPictures.splice(index, 1);
      return newPictures;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Créer un FormData pour l'upload de fichiers
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("condition", formData.condition);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("size", formData.size);
      formDataToSend.append("color", formData.color);

      // Ajouter toutes les images
      pictures.forEach((picture) => {
        formDataToSend.append("pictures", picture.file);
      });

      const response = await offersService.createOffer(formDataToSend);
      console.log("Offre créée:", response);

      // Nettoyer les URLs de prévisualisation
      pictures.forEach((picture) => {
        URL.revokeObjectURL(picture.preview);
      });

      // Rediriger vers la page de l'offre créée
      navigate(`/offer/${response._id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // Si l'utilisateur n'est pas connecté, ne pas afficher le formulaire
  if (!currentUser) {
    return <div>Redirection...</div>;
  }

  return (
    <main>
      <div className="add-offer-container">
        <h1>Publier une annonce</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="add-offer-form">
          {/* Section d'ajout d'images en premier */}
          <div className="form-group">
            <label htmlFor="pictures">Images de l'annonce</label>
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? "drag-active" : ""}`}
            >
              <input {...getInputProps()} />
              {pictures.length === 0 ? (
                <div className="dropzone-content">
                  <p>
                    Glissez-déposez vos images ici, ou cliquez pour sélectionner
                  </p>
                  <p className="dropzone-hint">
                    Formats acceptés : JPEG, PNG, GIF, WebP
                  </p>
                </div>
              ) : (
                <div className="pictures-preview">
                  {pictures.map((picture, index) => (
                    <div key={index} className="picture-item">
                      <img
                        src={picture.preview}
                        alt={`Prévisualisation ${index + 1}`}
                        className="picture-preview"
                      />
                      <button
                        type="button"
                        onClick={() => removePicture(index)}
                        className="remove-picture"
                        title="Supprimer cette image"
                      >
                        ×
                      </button>
                      {index === 0 && (
                        <span className="main-image-label">
                          Image principale
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Titre de l'annonce</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Prix</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="condition">État</label>
            <input
              type="text"
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              required
              placeholder="Ex: Neuf avec étiquette, Très bon état, Bon état..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">Ville</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="brand">Marque</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="size">Taille</label>
            <input
              type="text"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              required
              placeholder="Ex: XS, S, M, L, XL, XXL, 36, 38, 40..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="color">Couleur</label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Publication..." : "Publier l'annonce"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AddOffer;
