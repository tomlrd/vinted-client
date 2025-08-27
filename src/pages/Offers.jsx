import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 8;

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/offers?page=${currentPage}&limit=${limit}`
        );
        const data = await response.json();
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
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <main>
      <div className="offers-container">
        <h1>Annonces disponibles</h1>

        <div className="offers-grid">
          {offers.map((offer) => (
            <Link
              key={offer._id}
              to={`/offer/${offer._id}`}
              className="offer-card"
            >
              <div className="offer-image">
                {offer.product_image && offer.product_image.secure_url ? (
                  <img
                    src={offer.product_image.secure_url}
                    alt={offer.product_name}
                  />
                ) : (
                  <div className="no-image">Pas d'image</div>
                )}
              </div>
              <div className="offer-info">
                <h3>{offer.product_name}</h3>
                <p className="price">{offer.product_price} €</p>
              </div>
            </Link>
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
    </main>
  );
};

export default Offers;
