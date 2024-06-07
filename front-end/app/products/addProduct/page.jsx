"use client";
import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import ProductAddDialog from "@/components/dialog/productDialog/ProductAddDialog";
export default function AddProduct() {
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const handleOpenAddproduct = () => {
    setOpenAddProduct(true);
  };
  const handleCloseAddproduct = () => {
    setOpenAddProduct(false);
  };
  return (
    <Box>
      <Typography>
        Đã có dialog add product (\components\dialog\productDialog)
      </Typography>

      <Button variant="contained" onClick={handleOpenAddproduct}>
        {" "}
        New Product
      </Button>
      <ProductAddDialog
        open={openAddProduct}
        handleCloseAddproduct={handleCloseAddproduct}
      />
    </Box>
  );
}
