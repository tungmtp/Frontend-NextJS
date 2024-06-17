"use client";
import { Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import ImportAnotherStorageTable from "./ImportAnotherStorageTable";
import StockInAnotherStorageDetail from "./StockInAnotherStorageDetail";

export default function ImportAnotherStorage() {
  const [stockInDetail, setStockInDetail] = useState([]);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Nhận hàng chuyển đến từ kho khác</Typography>
      </Grid>
      <Grid item xs={4}>
        <ImportAnotherStorageTable
          stockInDetail={stockInDetail}
          setStockInDetail={setStockInDetail}
        />
      </Grid>
      <Grid item xs={8}>
        {stockInDetail?.length && stockInDetail?.length > 0 ? (
          <StockInAnotherStorageDetail
            stockInDetail={stockInDetail}
            setStockInDetail={setStockInDetail}
          />
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
}
