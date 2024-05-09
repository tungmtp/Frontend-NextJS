import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Menu,
  Button,
} from "@mui/material";
import Link from "next/link";
import Divider from "@mui/material/Divider";
import ProductAddDialog from "../dialog/productDialog/ProductAddDialog";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const columns = [
  { field: "id", headerName: "id", width: 70 },
  { field: "index", headerName: "STT", width: 30 },
  {
    field: "itemName",
    headerName: "Thêm sản phẩm",
    width: 380,
    renderCell: (params) => {
      return (
        <Link
          href=""
          key={params.row.id}
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            cursor: "pointer",
            ":hover": " underline",
          }}
          // onClick={() => {
          //   setSelectedDataGrid(params.row);
          // }}
        >
          {params.row.itemName}
        </Link>
      );
    },
  },
  { field: "quality", headerName: "CL", width: 50 },
  { field: "quantity", headerName: "Số lượng", width: 300 },
  { field: "price", headerName: "Giá bán", width: 100 },
  { field: "total", headerName: "Thành tiền", width: 150 },
];

// Define the data for the DataGrid
const rows = [
  {
    id: 1,
    index: 1,
    itemName: "	DG2-9-STD.TĐ-X8.V10.8211.AL3.3D.S.NEWSKY",
    quality: 1,
    quantity: "96 hộp 147 1208*123*12 = 199.70 m2",
    price: 275400,
    total: 54996525,
  },
  {
    id: 2,
    index: 2,
    itemName: "PS2-9-STD.TĐ-X8.V10.8211.AL3.3D.S.NEWSKY",
    quality: 1,
    quantity: "2 tấm PS 1208*123*12mm = 0.30 m2",
    price: 275400,
    total: 81840,
  },
];
export default function OrderDetailTable() {
  const [openAddProduct, setOpenAddProduct] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpenAddproduct = () => {
    setOpenAddProduct(true);
  };
  const handleCloseAddproduct = () => {
    setOpenAddProduct(false);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" marginBottom={2} sx={{ mt: 4 }}>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
          variant="contained"
        >
          Đặt hàng
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            style={{ color: "black", textDecoration: "none" }}
            onClick={handleOpenAddproduct}
          >
            Thêm sản phẩm
          </MenuItem>
          <ProductAddDialog
            open={openAddProduct}
            handleCloseAddproduct={handleCloseAddproduct}
          />
          <Link
            href={"/produce/addSupplyRequests"}
            style={{ color: "black", textDecoration: "none" }}
          >
            <MenuItem> Lệnh cung ứng</MenuItem>
          </Link>
          <Link
            href={"/business/addOrderDelivery"}
            style={{ color: "black", textDecoration: "none" }}
          >
            <MenuItem onClick={handleClose}>Lệnh giao hàng</MenuItem>
          </Link>
          <Divider variant="middle" />
          <Link
            href={"/business/deliveryProcess"}
            style={{ color: "black", textDecoration: "none" }}
          >
            <MenuItem onClick={handleClose}>Quá trình giao hàng</MenuItem>
          </Link>
          <Divider variant="middle" />
          <MenuItem onClick={handleClose}>Nhật kí sản xuất</MenuItem>
        </Menu>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
      />
    </Box>
  );
}
