import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";

const warehouseID = {
  0: "none",
  1: "Kho văn phòng",
  2: "Kho Nhà máy Việt Á",
  3: "Kho Sài gòn",
  4: "Giao thẳng từ nhà cung cấp",
  10: "Kho CPC",
};
const getWarehouseIDName = (selectedWarehouseID) => {
  return warehouseID[selectedWarehouseID];
};
const columns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "date", headerName: "Ngày Nhập", width: 150 },
  { field: "description", headerName: "Nội dung", width: 400, flex: 1 },
];
const rows = [
  {
    id: 175985,
    date: "24/05/2024",
    description:
      "Nhập hàng cho VINGROUP [Dự án: VINHOMES SMART CITY ĐẠI MỘ]-29C-755.79",
  },
  {
    id: 175986,
    date: "24/05/2024",
    description:
      "Nhập hàng cho DỰ ÁN PARAGON [Dự án: THÁP A]-Tủng văn chuyển, 89C-129.00",
  },
  // Add more rows as needed
];
export default function ExportTable() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl sx={{ width: "100%" }} size="small">
          <InputLabel id="partner-type-label">Nhập từ kho</InputLabel>
          <Select
            sx={{ width: "100%" }}
            labelId="partner-type-label"
            id="partner-type-select"
            //   value={orderDelivery?.warehouseID}
            label="Nhập từ kho"
            //   onChange={(event) => {
            //     const updatedOrderDelivery = { ...orderDelivery };
            //     updatedOrderDelivery.warehouseID = Number(event.target.value);
            //     setOrderDelivery(updatedOrderDelivery);
            //   }}
          >
            {Object.keys(warehouseID).map((key) => (
              <MenuItem key={key} value={key}>
                {getWarehouseIDName(key)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item md={6} xs={12}>
        <DatePicker
          sx={{ width: "100%" }}
          label="Từ ngày"
          //   value={dayjs(orderDelivery?.paymentDate)}
          //   onChange={(newValue) => {
          //     const updatedOrderDelivery = { ...orderDelivery };
          //     updatedOrderDelivery.paymentDate = newValue.format("YYYY-MM-DD");
          //     setOrderDelivery(updatedOrderDelivery);
          //   }}
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <DatePicker
          sx={{ width: "100%" }}
          label="Đến ngày"
          //   value={dayjs(orderDelivery?.paymentDate)}
          //   onChange={(newValue) => {
          //     const updatedOrderDelivery = { ...orderDelivery };
          //     updatedOrderDelivery.paymentDate = newValue.format("YYYY-MM-DD");
          //     setOrderDelivery(updatedOrderDelivery);
          //   }}
        />
      </Grid>
      <Grid item xs={12}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={1}
          rowsPerPageOptions={[5]}
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false,
              },
            },
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
        />
      </Grid>
    </Grid>
  );
}
