import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false); // Track if a suggestion is selected

  useEffect(() => {
    // Fetch suggestions dynamically when the user types at least 3 characters
    if (searchQuery.length >= 3 && !isSuggestionSelected) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, isSuggestionSelected]);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`https://fakestoreapi.com/products`);
      const filteredSuggestions = response.data.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a product name.");
      return;
    }

    setLoading(true);
    setError("");
    setNoResults(false);

    try {
      const response = await axios.get(`https://fakestoreapi.com/products`);
      const filteredProducts = response.data.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setProducts(filteredProducts);

      if (filteredProducts.length === 0) {
        setNoResults(true);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("There was an error fetching product data.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    setSuggestions([]); // Hide suggestions when a product is selected
    setIsSuggestionSelected(true); // Mark that a suggestion was selected
    setProducts([suggestion]); // Only show the selected product
  };

  // Reset suggestion state when the user starts typing again
  useEffect(() => {
    if (searchQuery.length === 0) {
      setIsSuggestionSelected(false);
      setSuggestions([]); // Clear suggestions when search is cleared
    }
  }, [searchQuery]);

  return (
    <div className="product-search-container">
      <h1>Product Search</h1>
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSuggestionSelected(false); // Reset suggestion state when typing
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter product name (e.g., Shirt)"
        />
        <button onClick={handleSearch}>Search</button>
        {suggestions.length > 0 && !isSuggestionSelected && (
          <ul className="suggestions">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.title}
              </li>
            ))}
          </ul>
        )}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {noResults && !loading && (
        <p className="no-results">No products found for your search.</p>
      )}
      <div className="product-results">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.title}
              className="product-image"
            />
            <h3>{product.title}</h3>
            <p>
              <strong>Price:</strong> ${product.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSearch;
