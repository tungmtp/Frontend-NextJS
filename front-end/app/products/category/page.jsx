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
import SelectNewsky from "@/components/select/SelectNewsky";
import { useDispatch } from "react-redux";
import {
  setSelectedCategory,
  setSelectedProduct,
} from "@/redux/categoryProductRedux";

export default function Category() {
  const dispatch = useDispatch();
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
        <Grid item xs={2.5}>
          <Box sx={{ pb: "10px" }}>
            <SelectNewsky
              lblinput="Tìm kiếm sản phẩm"
              emitParent={(id) => {
                if (id !== "") {
                  const getProduct = async () => {
                    const response = await getData(
                      `/product-service/product/${id}`
                    );
                    console.log(response);
                    dispatch(setSelectedCategory(response?.extraCategoryID));
                    dispatch(setSelectedProduct(response));
                  };
                  getProduct();
                } else {
                  dispatch(setSelectedCategory(null));
                  dispatch(setSelectedProduct(null));
                }
              }}
              byNameStr="/product-service/product/byNameStr"
              firstCall="/product-service/product/firstCall"
              // currentItemLink="/product-service/product/oneForSelect"
            />
          </Box>
          <TreeViewComp
            serviceURL={"/product-service/category"}
            title={"catName"}
            openAddProduct={openAddProduct}
            handleOpenAddproduct={handleOpenAddproduct}
            handleCloseAddproduct={handleCloseAddproduct}
          />
        </Grid>
        <Grid item xs={9.5}>
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
