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
import dayjs from "dayjs";

const columns = [
  { field: "id", headerName: "id", width: 70 },
  { field: "index", headerName: "STT", width: 30 },
  {
    field: "ngayChi",
    headerName: "Ngày Chi",
    type: "date",
    width: 180,
    valueFormatter: (params) => dayjs(params?.value).format("DD/MM/YYYY"),
  },
  { field: "noiDung", headerName: "Nội dung", width: 450 },
  { field: "soTien", headerName: "Số tiền", width: 150, type: "number" },
  { field: "quy", headerName: "Quỹ", width: 250 },
];

// Define the data for the DataGrid
const rows = [
  {
    id: 1,
    index: 1,
    ngayChi: "2024-05-12",
    noiDung: "...",
    soTien: 639928,
    quantity: "96 hộp 147 1208*123*12 = 199.70 m2",
    quy: "...",
  },
];
export default function OrderPaymentTable() {
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
          Chi tiền
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
          <Link
            href={"/produce/addSupplyRequests"}
            style={{ color: "black", textDecoration: "none" }}
          >
            <MenuItem> Chi tiền mặt</MenuItem>
          </Link>
          <Link
            href={"/business/addOrderDelivery"}
            style={{ color: "black", textDecoration: "none" }}
          >
            <MenuItem onClick={handleClose}>Chi chuyển khoản</MenuItem>
          </Link>
        </Menu>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        getRowHeight={() => "auto"}
        sx={{
          "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
            py: 1,
          },
          "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
            py: "15px",
          },
          "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
            py: "22px",
          },
        }}
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
