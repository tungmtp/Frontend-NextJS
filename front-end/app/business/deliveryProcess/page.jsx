"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";

const columns = [
  { field: "stt", headerName: "STT", width: 70 },
  { field: "khachHang", headerName: "Khách hàng", width: 300 },
  { field: "diaChiGiaoHang", headerName: "Địa chỉ giao hàng", width: 400 },
  { field: "sanPham", headerName: "Sản phẩm", width: 500 },
  { field: "comm", headerName: "Comm", width: 150 },
];

const rows = [
  {
    id: 1,
    stt: 1,
    khachHang: "TUNG LAM VIETONE",
    diaChiGiaoHang: "GH TẠI KHO NM Nhân hàng A Hữu Người bảo lệnh A Ngọc",
    sanPham:
      "PS2-9-EX.TD-X5.V6.204.AL3.3D.U.NEWSKY(1223*130): 6 Tấm PS 1223*130*12mm Loại: 1 php.anh:08/01/2024 10:49:06 ",
    comm: "",
  },
];

const DeliveryProcess = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Lịch giao hàng của đơn hàng số: 16126
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
      />
    </Box>
  );
};

export default DeliveryProcess;
