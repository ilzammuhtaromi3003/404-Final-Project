import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, Button, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { getProducts } from "../../api/api";
import ProductCard from "./ProductCard";

const ProductGrid = ({
  selectedCategory,
  sortingOption,
  products,
  currentPage,
  totalPages,
  handleNextPage,
  handlePrevPage,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Box p={2}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4, xl: 6 }}
        spacing={4}
        p={6}
        m={2}
        bg={"gray.300"}
        rounded={"lg"}
      >
        {loading ? (
          <p>Loading...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </SimpleGrid>

      <Box mt={4} textAlign="center">
        <IconButton
          icon={<ChevronLeftIcon />}
          aria-label="Previous Page"
          onClick={handlePrevPage}
          isDisabled={currentPage === 1 || loading}
        />
        <Button mx={2} variant="outline" disabled>
          {currentPage} / {totalPages}
        </Button>
        <IconButton
          icon={<ChevronRightIcon />}
          aria-label="Next Page"
          onClick={handleNextPage}
          isDisabled={currentPage === totalPages || loading}
        />
      </Box>
    </Box>
  );
};

export default ProductGrid;
