import { useEffect, useState } from "react";
import "../assets/styles/Filters.css";

const Filters = ({ onFiltersChange, currentFilters }) => {
  const [filters, setFilters] = useState({
    title: "",
    priceMin: 0,
    priceMax: 500,
    sort: "",
    page: 1,
    limit: 8,
  });

  useEffect(() => {
    if (currentFilters) {
      setFilters((prev) => ({ ...prev, ...currentFilters }));
    }
  }, [currentFilters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value,
      page: 1, // Reset à la première page lors du changement de filtres
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceMinChange = (e) => {
    const value = Math.min(Number(e.target.value), filters.priceMax - 1);
    const newFilters = {
      ...filters,
      priceMin: value,
      page: 1,
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), filters.priceMin + 1);
    const newFilters = {
      ...filters,
      priceMax: value,
      page: 1,
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSortChange = (sortValue) => {
    const newFilters = {
      ...filters,
      sort: sortValue,
      page: 1,
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="filters-container">
      {/* Barre de recherche */}
      <div className="search-bar">
        <input
          type="text"
          name="title"
          value={filters.title}
          onChange={handleInputChange}
          placeholder="Rechercher des articles..."
          className="search-input"
        />
      </div>

      {/* Slider de prix */}
      <div className="price-range-container">
        <div className="price-range-label">
          Prix : {filters.priceMin}€ - {filters.priceMax}€
        </div>
        <div className="price-inputs">
          <input
            type="range"
            min="0"
            max="500"
            value={filters.priceMin}
            onChange={handlePriceMinChange}
            className="price-slider-min"
          />
          <input
            type="range"
            min="0"
            max="500"
            value={filters.priceMax}
            onChange={handlePriceMaxChange}
            className="price-slider-max"
          />
        </div>
      </div>

      {/* Bouton toggle pour le tri */}
      <div className="sort-toggle-container">
        <button
          className={`sort-toggle ${
            filters.sort === "price-asc" ? "active" : ""
          }`}
          onClick={() =>
            handleSortChange(filters.sort === "price-asc" ? "" : "price-asc")
          }
          title="Prix croissant"
        >
          ↑
        </button>
        <button
          className={`sort-toggle ${
            filters.sort === "price-desc" ? "active" : ""
          }`}
          onClick={() =>
            handleSortChange(filters.sort === "price-desc" ? "" : "price-desc")
          }
          title="Prix décroissant"
        >
          ↓
        </button>
      </div>
    </div>
  );
};

export default Filters;
