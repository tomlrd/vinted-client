import Cookies from "js-cookie";

const COOKIE_NAME = "vinted_token";

export const cookieService = {
  // Sauvegarder le token
  setToken: (token) => {
    Cookies.set(COOKIE_NAME, token, {
      expires: 7, // Expire dans 7 jours
      secure: false, // Permet l'utilisation en HTTP (développement)
      sameSite: "strict", // Protection CSRF
      path: "/", // Accessible sur tout le site
    });
  },

  // Récupérer le token
  getToken: () => {
    return Cookies.get(COOKIE_NAME);
  },

  // Supprimer le token
  removeToken: () => {
    Cookies.remove(COOKIE_NAME);
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!Cookies.get(COOKIE_NAME);
  },

  // Déconnexion complète
  logout: () => {
    Cookies.remove(COOKIE_NAME);
  },
};
