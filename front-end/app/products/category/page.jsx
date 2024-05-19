"use client";
import { getData } from "@/hook/Hook";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { Label, NotificationsOutlined } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TreeViewComp from "@/components/treeview/TreeViewComp";
import ChildCategory from "@/components/childcategory/ChildCategory";

export default function Category() {
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const handleOpenAddproduct = () => {
    setOpenAddProduct(true);
  };
  const handleCloseAddproduct = () => {
    setOpenAddProduct(false);
  };
  return (
    <div>
      <Grid container spacing={4}>
        <Grid item xs={2.5} sx={{ minWidth: "200px" }}>
          <TreeViewComp
            serviceURL={"/product-service/category"}
            title={"catName"}
            openAddProduct={openAddProduct}
            handleOpenAddproduct={handleOpenAddproduct}
            handleCloseAddproduct={handleCloseAddproduct}
          />
        </Grid>
        <Grid item md={9.5} xs={8}>
          <ChildCategory
            title={"catName"}
            openAddProduct={openAddProduct}
            handleOpenAddproduct={handleOpenAddproduct}
            handleCloseAddproduct={handleCloseAddproduct}
          />
        </Grid>
      </Grid>
    </div>
  );
}
