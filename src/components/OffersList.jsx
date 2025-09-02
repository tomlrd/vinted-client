import { useEffect, useState } from "react";
import { offersService } from "../services/api.js";
import CardOffer from "./CardOffer.jsx";

const OffersList = ({ filters }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 8;

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);

        // Construire les paramètres de requête avec les filtres
        const params = {
          page: currentPage,
          limit,
          ...(filters?.title && { title: filters.title }),
          ...(filters?.priceMin > 0 && { priceMin: filters.priceMin }),
          ...(filters?.priceMax < 500 && { priceMax: filters.priceMax }),
          ...(filters?.sort && { sort: filters.sort }),
        };

        const data = await offersService.getOffers(params);
        console.log(data);

        if (data.offers && Array.isArray(data.offers)) {
          setOffers(data.offers);
          setTotalPages(Math.ceil(data.count / limit));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des offres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [currentPage, filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="offers-container">
      <div className="offers-grid">
        {offers.map((offer) => (
          <CardOffer key={offer._id} offer={offer} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Précédent
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? "active" : ""}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default OffersList;
