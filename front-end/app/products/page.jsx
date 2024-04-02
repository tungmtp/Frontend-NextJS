"use client";
import Dropdown from "@/components/dropdown/Dropdown";
import React from "react";
function Products() {
  const top100Films = [
    { label: "The Shawshank Redemption", year: 1994 },
    { label: "The Godfather", year: 1972 },
    { label: "The Godfather: Part II", year: 1974 },
    { label: "Monty Python and the Holy Grail", year: 1975 },
  ];

  const onChange = (event, value, productId) => {
    console.log(productId);
  };
  return (
    <div>
      testing <br />
      <Dropdown
        productId="hello"
        options={top100Films}
        selectedDataGrid={1}
        onChange={onChange}
      />
    </div>
  );
}

export default Products;
