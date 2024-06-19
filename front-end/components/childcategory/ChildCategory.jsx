import {
  selectCategoryProducts,
  setSelectedCategory,
  setSelectedProduct,
} from "@/redux/categoryProductRedux";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import FolderOpenTwoToneIcon from "@mui/icons-material/FolderOpenTwoTone";
import DetailProduct from "../detailProduct/DetailProduct";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./childCategory.css";
import { getData, getDataById } from "@/hook/Hook";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import AddProduct from "../addProduct/AddProduct";
const rows = [
  {
    nameStr: "",
    extraCategoryID: "7efa8c10-2b04-4c44-a467-07f94c8e92a0",
    minimumStock: 50.0,
    mayBeBuy: true,
    mayBeProduce: false,
    mayBeSell: false,
    canSellWithOutStock: false,
    disContinue: false,
    classPriceID: "1b56b4e0-5e9c-4355-9297-5f99d5b1f2f2",
    segmentID: null,
    comment: "",
    copyFrom: null,
    createdOn: "2023-04-22T17:00:00.000+00:00",
    id: "faddc296-b7ab-413d-af00-4d6bf2adaf38",
    measID: "7bd9b3c9-fcb7-4b4a-9935-ce935e4a2c51",
  },
  {
    nameStr: "Găng tay sợi",
    extraCategoryID: "7efa8c10-2b04-4c44-a467-07f94c8e92a0",
    minimumStock: 100.0,
    mayBeBuy: true,
    mayBeProduce: false,
    mayBeSell: false,
    canSellWithOutStock: false,
    disContinue: false,
    classPriceID: "1b56b4e0-5e9c-4355-9297-5f99d5b1f2f2",
    segmentID: null,
    comment: "",
    copyFrom: null,
    createdOn: "2023-04-22T17:00:00.000+00:00",
    id: "ebc76742-c892-4632-9f61-ece29c4e2a36",
    measID: "7bd9b3c9-fcb7-4b4a-9935-ce935e4a2c51",
  },
];

export default function ChildCategory(parentProp) {
  const [productData, setProductData] = useState([]);
  const [selectedDataGrid, setSelectedDataGrid] = useState();
  // const [openAddProduct, setOpenAddProduct] = useState(false);

  const dispatch = useDispatch();
  const selectedCategory = useSelector(
    (state) => state.categoryProduct.selectedCategory
  );
  const selectedProduct = useSelector(
    (state) => state.categoryProduct.selectedProduct
  );
  // console.log(selectedProduct);
  const categoryProducts = useSelector(
    (state) => state.categoryProduct.categoryProducts
  );

  // Lọc tất cả các mục con của selectedCategory
  const childCategories = categoryProducts.filter(
    (category) => category?.isChildOf === selectedCategory
  );
  // console.log(childCategories);
  const hasChildren = (categoryId) => {
    const child = categoryProducts.filter(
      (category1) => category1?.isChildOf === categoryId
    );
    if (child?.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    if (!hasChildren(selectedCategory) && selectedCategory) {
      const getProductData = async () => {
        try {
          const result = await getDataById(
            "/product-service/product/byCategoryID",
            selectedCategory
          );

          const resultWithIndex = result?.map((row, index) => ({
            ...row,
            index: index + 1,
          }));

          setProductData(resultWithIndex);
          // console.log(selectedCategory);
          // console.log(resultWithIndex);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      };
      getProductData();
    }

    // console.log("rendering again");
  }, [selectedCategory, selectedProduct, parentProp.openAddProduct]);
  //xu ly mo component add product
  // const handleOpenAddproduct = () => {
  //   setOpenAddProduct(true);
  // };
  // const handleCloseAddproduct = () => {
  //   setOpenAddProduct(false);
  // };
  const columns = [
    { field: "id", headerName: "id", width: 1 },
    { field: "index", headerName: "STT", width: 100 },

    {
      field: "nameStr",
      headerName: "Tên thành phẩm",
      width: 450,

      renderCell: (params) => {
        return (
          <Link
            underline="hover"
            key={params.row.id}
            color="inherit"
            variant="body1"
            onClick={() => {
              dispatch(setSelectedProduct(params.row));
            }}
          >
            {params.row.nameStr}
          </Link>
        );
      },
    },
    { field: "minimumStock", headerName: "Tồn kho tối thiểu", width: 150 },
    // { field: "col2", headerName: "Đơn vị tính", width: 150 },
  ];

  const handleClick = (id) => {
    dispatch(setSelectedCategory(id));
    dispatch(setSelectedProduct(null));
    if (parentProp?.handleCloseAddproduct) parentProp?.handleCloseAddproduct();
  };
  // const breadcrumbs = [
  //   <Link
  //     underline="hover"
  //     key="1"
  //     variant="body2"
  //     href="/"
  //     onClick={handleClick}
  //   >
  //     Nguyên liệu chính
  //   </Link>,
  //   <Link
  //     underline="hover"
  //     key="2"
  //     variant="body2"
  //     href="/material-ui/getting-started/installation/"
  //     onClick={handleClick}
  //   >
  //     Sản phẩm A
  //   </Link>,
  //   <Typography key="3" color="text.primary">
  //     Bán thành phẩm A-1
  //   </Typography>,
  // ];
  const generateBreadcrumbs = (categories, selectedCategoryId, handleClick) => {
    const breadcrumbs = [];

    // Hàm đệ quy để tìm kiếm parent của selectedCategoryId
    const findParent = (categoryId, isLastChild = false) => {
      const category = categories.find((cat) => cat?.id === categoryId);
      if (category) {
        if (category.isChildOf) {
          findParent(category.isChildOf, false);
        }
        if (!isLastChild) {
          breadcrumbs.push(
            <Link
              underline="hover"
              key={category.id}
              variant="body2"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleClick(category.id);
              }}
            >
              {category[parentProp.title]}
            </Link>
          );
        } else {
          breadcrumbs.push(
            <Link
              underline="none"
              key={category.id}
              variant="body1"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleClick(category.id);
              }}
            >
              {category[parentProp.title]}
            </Link>
          );
        }
      }
    };

    findParent(selectedCategoryId, true);

    return breadcrumbs;
  };
  const breadcrumbs = generateBreadcrumbs(
    categoryProducts,
    selectedCategory,
    handleClick
  );
  console.log(selectedCategory);
  return (
    <Paper
      elevation={6}
      sx={{ paddingTop: 1, height: "84vh", overflow: "auto" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",

          paddingBottom: "10px",
        }}
      >
        <div
          style={{
            padding: "10px",
            marginLeft: "15px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            // sx={{ paddingBottom: 4, marginLeft: "15px" }}
          >
            {breadcrumbs}
          </Breadcrumbs>
          {!hasChildren(selectedCategory) &&
          !parentProp.openAddProduct &&
          selectedCategory ? (
            <Tooltip title="Thêm sản phẩm mới" placement="left">
              <Fab
                size="small"
                color="primary"
                aria-label="add"
                onClick={parentProp.handleOpenAddproduct}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
          ) : (
            <></>
          )}
        </div>
        {parentProp.openAddProduct ? (
          <AddProduct
            handleCloseAddproduct={parentProp?.handleCloseAddproduct}
          />
        ) : selectedProduct ? (
          <DetailProduct />
        ) : !hasChildren(selectedCategory) && selectedCategory ? (
          <div style={{ height: "91%" }}>
            <DataGrid
              rows={productData}
              columns={columns}
              pageSize={1}
              disableRowSelectionOnClick
              slots={{
                toolbar: GridToolbar,
              }}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    id: false,
                  },
                },
              }}
            />
          </div>
        ) : (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              rowGap: "16px",
              paddingLeft: "30px",
              justifyContent: "flex-start",
              paddingBottom: 3,
            }}
          >
            {childCategories.map((category) => (
              <Box
                sx={{
                  paddingRight: "8px",
                }}
                key={category.id}
              >
                <Paper
                  elevation={4}
                  key={category.id}
                  sx={{
                    textAlign: "center",
                    minHeight: "45px",
                    lineHeight: "45px",
                    cursor: "pointer",
                    fontSize: "16px",
                    width: "250px",
                  }}
                  onClick={() => {
                    dispatch(setSelectedCategory(category.id));
                  }}
                >
                  <Tooltip
                    followCursor
                    title={category[parentProp.title]}
                    arrow
                    sx={{ overflow: "auto", display: "none" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "8px",
                      }}
                    >
                      {hasChildren(category.id) && (
                        <FolderOpenTwoToneIcon fontSize="medium" />
                      )}
                      <div
                        style={{
                          paddingLeft: 6,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "inline-block",
                        }}
                      >
                        {category[parentProp.title]}
                      </div>
                    </Box>
                  </Tooltip>
                </Paper>
              </Box>
            ))}
          </Box>
        )}
      </div>
    </Paper>
  );
}
