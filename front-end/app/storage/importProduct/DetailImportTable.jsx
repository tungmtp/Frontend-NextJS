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
import React, { useEffect, useState } from "react";
import { purposeStockIn, warehouseID } from "@/components/selectOptions";
import AddStockInDetailDialog from "./AddStockInDetailDialog";
import { getData } from "@/hook/Hook";
export default function DetailImportTable(props) {
  const [open, setOpenAddProduct] = useState(false);
  const [stockIn, setStockIn] = useState([]);
  const [addStockInDetail, setAddStockInDetail] = useState();
  const handleOpen = () => {
    setOpenAddProduct(true);
  };
  const handleClose = () => {
    setOpenAddProduct(false);
  };

  const getStockInDetail = async () => {
    const result = await getData(
      `/product-service/stockIn/byStockInID/${props.stockInDetail}`
    );
    setStockIn(result);
  };
  useEffect(() => {
    getStockInDetail();
  }, [props.stockInDetail, addStockInDetail]);

  // useEffect(() => {
  //   setStockIn((prevState) => ({
  //     ...prevState,
  //     StockInDetail: [...(prevState[0]?.StockInDetail || []), addStockInDetail],
  //   }));
  // }, [addStockInDetail]);
  console.log("stockInDetail: ", stockIn);
  console.log("addStockInDetail: ", addStockInDetail);

  return (
    <Grid container rowSpacing={2} columnSpacing={5}>
      <Grid item xs={12}>
        <Typography variant="h5" color={"#a94442"}>
          Đơn hàng số: {stockIn[0]?.id}
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        Ngày: {dayjs(stockIn[0]?.slipDate).format("DD/MM/YYYY")}
      </Grid>
      <Grid item xs={12} md={6}>
        Type: {purposeStockIn[stockIn[0]?.purpose]}
      </Grid>
      <Grid item xs={12} md={6}>
        {warehouseID[stockIn[0]?.warehouseID]}
        <span
          style={{
            color: "#c7254e",
            backgroundColor: "#f9f2f4",
            borderRadius: "4px",
          }}
        >
          Created by: {stockIn[0]?.createdBy} on{" "}
          {dayjs(stockIn[0]?.createdOn).format("DD/MM/YYYY HH:MM:ss")}{" "}
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
                <TableCell align="left">Số lượng nhập</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockIn[0]?.StockInDetail?.map((row, index) => (
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
        stockin={stockIn[0] && stockIn[0]}
        setAddStockInDetail={setAddStockInDetail}
      />
    </Grid>
  );
}
