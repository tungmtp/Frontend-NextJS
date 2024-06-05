"use client";
import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import ImportTable from "./ImportTable";
import DetailImportTable from "./DetailImportTable";

export default function ImportProduct() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Danh sách nhập kho</Typography>
      </Grid>
      <Grid item xs={4}>
        <ImportTable />
      </Grid>
      <Grid item xs={8}>
        <DetailImportTable />
      </Grid>
    </Grid>
  );
}
