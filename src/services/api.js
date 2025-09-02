import axios from "axios";
import { cookieService } from "./cookieService.js";

// Configuration de base d'axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter automatiquement le token aux requêtes qui en ont besoin
api.interceptors.request.use(
  (config) => {
    // Liste des routes qui nécessitent un token
    const protectedRoutes = [
      "/offer/publish",
      "/user/profile",
      "/offer/",
      "/payment",
    ];

    // Vérifier si la route actuelle nécessite un token
    const needsToken = protectedRoutes.some(
      (route) => config.url?.includes(route) || config.url?.startsWith(route)
    );

    if (needsToken) {
      const token = cookieService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service pour les offres
export const offersService = {
  // Récupérer toutes les offres avec pagination et filtres
  getOffers: async (params = {}) => {
    const response = await api.get("/offers", { params });
    return response.data;
  },

  // Récupérer une offre par ID
  getOffer: async (id) => {
    const response = await api.get(`/offers/${id}`);
    return response.data;
  },

  // Récupérer les offres d'un utilisateur spécifique
  getOffersByUser: async (userId) => {
    const response = await api.get(`/offers/user/${userId}`);
    return response.data;
  },

  // Créer une nouvelle offre
  createOffer: async (offerData) => {
    const response = await api.post("/offer/publish", offerData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Supprimer une offre
  deleteOffer: async (id) => {
    const response = await api.delete(`/offer/${id}`);
    return response.data;
  },

  // Créer un paiement
  createPayment: async (paymentData) => {
    const response = await api.post("/payment", paymentData);
    return response.data;
  },
};

// Service pour l'authentification
export const authService = {
  // Inscription
  signup: async (userData) => {
    const response = await api.post("/user/signup", userData);
    return response.data;
  },

  // Connexion
  login: async (credentials) => {
    const response = await api.post("/user/login", credentials);
    return response.data;
  },
};

// Service pour les utilisateurs
export const userService = {
  // Récupérer un utilisateur par ID
  getUser: async (id) => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },

  // Récupérer le profil de l'utilisateur connecté
  getCurrentUser: async () => {
    const response = await api.get("/user/profile");
    return response.data;
  },
};

export default api;
