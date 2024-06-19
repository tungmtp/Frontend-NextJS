"use client";
import { Box, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import ExportTable from "./ExportTable";
import DetailExportTable from "./DetailExportTable";
export default function ExportProduct() {
  const [stockOutDetail, setStockOutDetail] = useState([]);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Danh sách xuất kho</Typography>
      </Grid>
      <Grid item xs={4}>
        <ExportTable setStockOutDetail={setStockOutDetail} />
      </Grid>
      <Grid item xs={8}>
        {stockOutDetail?.length && stockOutDetail?.length > 0 ? (
          <DetailExportTable stockOutDetail={stockOutDetail} />
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
}
