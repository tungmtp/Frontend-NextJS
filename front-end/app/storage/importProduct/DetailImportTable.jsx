import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";
import { purposeStockIn, warehouseID } from "@/components/selectOptions";
import AddStockInDetailDialog from "./AddStockInDetailDialog";
export default function DetailImportTable(props) {
  const [open, setOpenAddProduct] = useState(false);
  const handleOpen = () => {
    setOpenAddProduct(true);
  };
  const handleClose = () => {
    setOpenAddProduct(false);
  };

  console.log("stockInDetail: ", props.stockInDetail);
  return (
    <Grid container rowSpacing={2} columnSpacing={5}>
      <Grid item xs={12}>
        <Typography variant="h5" color={"#a94442"}>
          Đơn hàng số: {props.stockInDetail[0]?.id}
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        Ngày: {dayjs(props.stockInDetail[0]?.slipDate).format("DD/MM/YYYY")}
      </Grid>
      <Grid item xs={12} md={6}>
        Type: {purposeStockIn[props.stockInDetail[0]?.purpose]}
      </Grid>
      <Grid item xs={12} md={6}>
        {warehouseID[props.stockInDetail[0]?.warehouseID]}
        <span
          style={{
            color: "#c7254e",
            backgroundColor: "#f9f2f4",
            borderRadius: "4px",
          }}
        >
          Created by: {props.stockInDetail[0]?.createdBy} on{" "}
          {dayjs(props.stockInDetail[0]?.createdOn).format(
            "DD/MM/YYYY HH:MM:ss"
          )}{" "}
        </span>
      </Grid>
      <Grid item xs={12} md={6}>
        KHÁCH LẺ
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" onClick={handleOpen}>
          Add
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="left">Sản phẩm</TableCell>
                <TableCell align="left">ĐVT</TableCell>
                <TableCell align="left">Chất lượng</TableCell>
                <TableCell align="left">Số lượng xuất</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.stockInDetail[0]?.StockInDetail?.map((row, index) => (
                <TableRow
                  hover
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="left">{row.nameStr}</TableCell>
                  <TableCell align="left">{row.MeasName}</TableCell>
                  <TableCell align="left">{row.quality}</TableCell>
                  <TableCell align="left">{row.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <AddStockInDetailDialog
        open={open}
        handleClose={handleClose}
        stockin={props.stockInDetail[0] && props.stockInDetail[0]}
      />
    </Grid>
  );
}
