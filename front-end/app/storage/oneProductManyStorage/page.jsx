"use client";
import SelectNewsky from "@/components/select/SelectNewsky";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import { filterWarehouseID } from "@/components/selectOptions";
export default function OneProductManyStorage() {
  console.log(filterWarehouseID);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Tồn 01 SP ở tất cả các kho</Typography>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <DatePicker
          sx={{ width: "100%" }}
          label="Xem tồn khi ngày"
          // value={dayjs(filterConditional?.startDate)}
          // onChange={(newValue) => {
          //   const updatedFilterConditional = { ...filterConditional };
          //   updatedFilterConditional.startDate = newValue.format("YYYY-MM-DD");
          //   setFilterConditional(updatedFilterConditional);
          // }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <SelectNewsky
          lblinput="Sản phẩm"
          // emitParent={(id) => {
          //   // console.log("Selected Product: ", id);
          //   // const updatedStockinDetail = {
          //   //   ...stockinDetail, // Copy existing attributes
          //   //   productID: id, // Set or update the ProductID attribute
          //   // };
          //   // setStockinDetail(updatedStockinDetail);
          //   memoizedFetchMeasurementByProductID(id);
          // }}
          // byNameStr="/product-service/product/byNameStr/mayBeSell"
          // firstCall="/product-service/product/firstCall/mayBeSell"
          // currentItemLink="/product-service/product/oneForSelect"
        />
      </Grid>

      <Grid item xs={12} md={6} lg={2}>
        <Button variant="contained"> Submit</Button>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">STT</TableCell>
                <TableCell align="left">Loại 1</TableCell>
                <TableCell align="left">Quy đổi</TableCell>
                <TableCell align="left">Loại 2</TableCell>
                <TableCell align="left">Quy đổi</TableCell>
                <TableCell align="left">Tổng</TableCell>
                <TableCell align="left">Quy đổi</TableCell>
              </TableRow>
            </TableHead>
            {/* <TableBody>
              {props.stockOutDetail[0]?.StockOutDetail?.map((row, index) => (
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
            </TableBody> */}
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
