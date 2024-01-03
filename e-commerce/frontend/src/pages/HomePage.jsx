import React, { useState, useEffect } from "react";
import FilterBar from "../Components/FilterBar";
import ProductGrid from "../Components/ProductGrid/ProductGrid";
import { getAllProducts, getProducts } from "../api/api";

const HomePage = ({ searchTerm }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortingOption, setSortingOption] = useState(null);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortingOption, selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts({
        page: currentPage,
        limit: 12,
        filter: selectedCategory,
        sort: sortingOption,
        search: searchTerm,
      });

      // console.log(response.data);
      if (response && response.data) {
        setSearchedProducts(response.data);
        setTotalPages(Math.ceil(response.length / 12));
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchProducts();
  };

  const handleSortingChange = (option) => {
    setSortingOption(option);
    fetchProducts();
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div>
      <FilterBar
        selectedCategory={selectedCategory}
        sortingOption={sortingOption}
        onCategoryChange={handleCategoryChange}
        onSortingChange={handleSortingChange}
      />

      <ProductGrid
        selectedCategory={selectedCategory}
        sortingOption={sortingOption}
        products={searchedProducts}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
      />
    </div>
  );
};

export default HomePage;
