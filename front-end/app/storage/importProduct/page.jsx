"use client";
import { Box, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import ImportTable from "./ImportTable";
import DetailImportTable from "./DetailImportTable";

export default function ImportProduct() {
  const [stockInDetail, setStockInDetail] = useState(null);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Danh sách nhập kho</Typography>
      </Grid>
      <Grid item xs={4}>
        <ImportTable setStockInDetail={setStockInDetail} />
      </Grid>
      <Grid item xs={8}>
        {stockInDetail ? (
          <DetailImportTable stockInDetail={stockInDetail} />
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
}
