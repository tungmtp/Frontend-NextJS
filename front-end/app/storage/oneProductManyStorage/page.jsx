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
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";
import { getData } from "@/hook/Hook";
import dayjs from "dayjs";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
export default function OneProductManyStorage() {
  const { enqueueSnackbar } = useSnackbar();
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DD");
  const [data, setData] = useState(null);
  const [lastDate, setLastDate] = useState(currentDate);
  const [productID, setProductID] = useState("");
  const handleFilter = async () => {
    if (lastDate === "" || productID === "") {
      NotifySnackbar(
        enqueueSnackbar,
        `Vui lòng nhập đủ các trường!!`,
        "warning"
      );
    } else {
      const result = await getData(
        `/product-service/product/oneProductAtAllWarehouse/${productID}/${lastDate}`
      );
      setData(result);
    }
  };
  console.log(data);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Tồn 01 SP ở tất cả các kho</Typography>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <DatePicker
          sx={{ width: "100%" }}
          label="Xem tồn kho ngày"
          value={dayjs(lastDate)}
          onChange={(newValue) => {
            const newLastDate = newValue.format("YYYY-MM-DD");
            setLastDate(newLastDate);
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <SelectNewsky
          lblinput="Sản phẩm"
          emitParent={(id) => {
            setProductID(id);
          }}
          byNameStr="/product-service/product/byNameStr/mayBeSell"
        />
      </Grid>

      <Grid item xs={12} md={6} lg={2}>
        <Button variant="contained" onClick={handleFilter}>
          {" "}
          Filter
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">STT</TableCell>
                <TableCell align="left">Kho</TableCell>
                <TableCell align="left">Loại 1</TableCell>
                <TableCell align="left">Quy đổi</TableCell>
                <TableCell align="left">Loại 2</TableCell>
                <TableCell align="left">Quy đổi</TableCell>
                <TableCell align="left">Tổng</TableCell>
                <TableCell align="left">Quy đổi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data?.map((row, index) => (
                  <TableRow
                    hover
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell align="left">{row.warehouseName}</TableCell>
                    <TableCell align="left">{row.sumLoai1}</TableCell>
                    <TableCell align="left">{row.qdLoai1}</TableCell>
                    <TableCell align="left">{row.sumLoai2}</TableCell>
                    <TableCell align="left">{row.qdLoai2}</TableCell>
                    <TableCell align="left">{row.sumTong}</TableCell>
                    <TableCell align="left">{row.qdTong}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
