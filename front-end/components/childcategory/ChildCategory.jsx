import {
  selectCategoryProducts,
  setSelectedCategory,
} from "@/redux/categoryProductRedux";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Breadcrumbs, Button, Link, Typography } from "@mui/material";
import FolderOpenTwoToneIcon from "@mui/icons-material/FolderOpenTwoTone";
import DetailCategory from "../detailcategory/DetailCategory";
import { DataGrid } from "@mui/x-data-grid";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./childCategory.css";
const rows = [
  {
    id: 16576556757,
    col1: "CL.C23.TRANG.08770-6.R7.2000  Phào trắng 10",
    col2: "Cây 2.0",
  },
  {
    id: 156765765,
    col1: "CL.C23.TRANG.08770-6.R7.2000  Phào trắng 10",
    col2: "Cây 2.0",
  },
  {
    id: 14564654646,
    col1: "CL.C23.TRANG.08770-6.R7.2000  Phào trắng 10",
    col2: "Cây 2.0",
  },
  {
    id: 1456456464,
    col1: "CL.C23.TRANG.08770-6.R7.2000  Phào trắng 10",
    col2: "Cây 2.0",
  },
  {
    id: 145645665745,
    col1: "CL.C23.TRANG.08770-6.R7.2000  Phào trắng 10",
    col2: "Cây 2.0",
  },
  {
    id: 145645567645,
    col1: "CL.C23.TRANG.08770-6.R7.2000  Phào trắng 10",
    col2: "Cây 2.0",
  },
  {
    id: 145644565645,
    col1: "CL.C23.TRANG.08770-6.R7.2000  Phào trắng 10",
    col2: "Cây 2.0",
  },
  {
    id: 14564456465645,
    col1: "CL.C23.TRANG.08770-6.R7.2000  Phào trắng 10",
    col2: "Cây 2.0",
  },
];

export default function ChildCategory() {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(
    (state) => state.categoryProduct.selectedCategory
  );
  const categoryProducts = useSelector(
    (state) => state.categoryProduct.categoryProducts
  );

  // Lọc tất cả các mục con của selectedCategory
  const childCategories = categoryProducts.filter(
    (category) => category.isChildOf === selectedCategory
  );
  const hasChildren = (categoryId) => {
    const child = categoryProducts.filter(
      (category1) => category1.isChildOf === categoryId
    );
    if (child.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  const columns = [
    { field: "id", headerName: "id", width: 150 },

    {
      field: "col1",
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
              dispatch(setSelectedCategory(params.row.id));
              console.log(params.row);
            }}
          >
            {params.row.col1}
          </Link>
        );
      },
    },
    { field: "col2", headerName: "Đơn vị tính", width: 150 },
  ];

  const handleClick = (id) => {
    dispatch(setSelectedCategory(id));
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
      const category = categories.find((cat) => cat.id === categoryId);
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
              {category.catName}
            </Link>
          );
        } else {
          breadcrumbs.push(
            <Link underline="none" key={category.id} variant="body1" href="#">
              {category.catName}
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
  return (
    <Paper elevation={1} sx={{ paddingTop: 1, height: "84vh" }}>
      {hasChildren(selectedCategory) ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ paddingBottom: 2 }}
          >
            {breadcrumbs}
          </Breadcrumbs>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              flexGrow: 1,
              rowGap: "4px",
            }}
          >
            {childCategories.map((category) => (
              <Box sx={{ paddingRight: "8px" }} key={category.id}>
                <Paper
                  elevation={2}
                  key={category.id}
                  sx={{
                    minWidth: 150,
                    height: 45,
                    textAlign: "center",
                    lineHeight: "45px",
                    cursor: "pointer",
                    paddingX: "15px",
                  }}
                  onClick={() => {
                    dispatch(setSelectedCategory(category.id));
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    {hasChildren(category.id) && (
                      <FolderOpenTwoToneIcon fontSize="medium" />
                    )}
                    <div style={{ paddingLeft: 6 }}>{category.catName}</div>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Box>
          <div style={{ height: 300, width: "100%", flexGrow: 1 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={1}
              checkboxSelection
              disableRowSelectionOnClick
            />
          </div>
        </div>
      ) : (
        <DetailCategory data={selectedCategory} />
      )}
    </Paper>
  );
}
