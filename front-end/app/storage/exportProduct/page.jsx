"use client";
import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import ExportTable from "./ExportTable";
import DetailExportTable from "./DetailExportTable";
export default function ExportProduct() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Danh sách xuất kho</Typography>
      </Grid>
      <Grid item xs={4}>
        <ExportTable />
      </Grid>
      <Grid item xs={8}>
        <DetailExportTable />
      </Grid>
    </Grid>
  );
}
