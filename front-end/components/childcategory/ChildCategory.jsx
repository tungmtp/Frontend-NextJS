import {
  selectCategoryProducts,
  setSelectedCategory,
} from "@/redux/categoryProductRedux";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";
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

export default function ChildCategory(parentProp) {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(
    (state) => state.categoryProduct.selectedCategory
  );
  const categoryProducts = useSelector(
    (state) => state.categoryProduct.categoryProducts
  );

  // Lọc tất cả các mục con của selectedCategory
  const childCategories = categoryProducts.filter(
    (category) => category?.isChildOf === selectedCategory
  );

  const hasChildren = (categoryId) => {
    const child = categoryProducts.filter(
      (category1) => category1?.isChildOf === categoryId
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
            <Link underline="none" key={category.id} variant="body1" href="#">
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
  return (
    <Paper elevation={6} sx={{ paddingTop: 1, height: "84vh" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ paddingBottom: 2, marginLeft: "15px" }}
        >
          {breadcrumbs}
        </Breadcrumbs>

        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            rowGap: "16px",
            paddingLeft: "30px",
            justifyContent: "flex-start",
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
                <Tooltip title={category[parentProp.title]} arrow>
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
        {!hasChildren(selectedCategory) ? (
          <div style={{ height: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={1}
              checkboxSelection
              disableRowSelectionOnClick
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </Paper>
  );
}
