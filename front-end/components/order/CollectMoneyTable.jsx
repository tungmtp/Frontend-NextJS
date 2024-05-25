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
    field: "ngayThu",
    headerName: "Ngày thu",
    type: "date",
    flex: 4,
    valueFormatter: (params) => dayjs(params?.value).format("DD/MM/YYYY"),
  },
  { field: "noiDung", headerName: "Nội dung", flex: 8 },
  { field: "soTien", headerName: "Số tiền", flex: 4, type: "number" },
  { field: "quy", headerName: "Quỹ", flex: 5 },
];

// Define the data for the DataGrid
const rows = [
  {
    id: 1,
    index: 1,
    ngayThu: "2024-05-12",
    noiDung: "Anh B nộp công nợ của KHÁCH LẺ LA VTB = 22.000.000đ",
    soTien: 639928,
    quantity: "96 hộp 147 1208*123*12 = 199.70 m2",
    quy: "LAN ANH VTB 102870409761",
  },
  {
    id: 2,
    index: 2,
    ngayThu: "2024-05-12",
    noiDung: "Anh C nộp công nợ của KHÁCH LẺ LA VTB = 22.000.000đ",
    soTien: 639928,
    quantity: "96 hộp 147 1208*123*12 = 199.70 m2",
    quy: "LAN ANH VTB 102870409761",
  },
];
export default function CollectMoneyTable() {
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
          Thu tiền
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
            <MenuItem> Thu tiền mặt</MenuItem>
          </Link>
          <Link
            href={"/business/addOrderDelivery"}
            style={{ color: "black", textDecoration: "none" }}
          >
            <MenuItem onClick={handleClose}>Thu chuyển khoản</MenuItem>
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
            py: "8px",
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
