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
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";
import { filterWarehouseID } from "@/components/selectOptions";
import SelectTreeView from "@/components/select/SelectTreeView";
import { getData } from "@/hook/Hook";
import dayjs from "dayjs";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
import SelectAttributeTreeView from "@/components/select/SelectAttributeTreeView";
export default function StockByAttribute() {
  const { enqueueSnackbar } = useSnackbar();
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DD");
  const dateMinus = dayjs(date).subtract(7, "day").format("YYYY-MM-DD");
  const [data, setdata] = useState(null);
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [toDate, setToDate] = useState(currentDate);
  const [wareHouseID, setWareHouseID] = useState(2);
  const [quality, setQuality] = useState(1);
  const handleFilter = async () => {
    if (selectedAttribute === "" || toDate === "" || quality === "") {
      NotifySnackbar(
        enqueueSnackbar,
        `Vui lòng nhập đủ các trường!!`,
        "warning"
      );
    } else {
      const result = await getData(
        `/product-service/product/allProductByAttrAtAllWarehouse/${selectedAttribute}/${toDate}`
      );
      setdata(result);
    }
  };
  console.log(data);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Tồn các sản phẩm theo thuộc tính</Typography>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <SelectAttributeTreeView setSelectedAttribute={setSelectedAttribute} />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DatePicker
          sx={{ width: "100%" }}
          label="Ngày cuối"
          value={dayjs(toDate)}
          onChange={(newValue) => {
            const newToDate = newValue.format("YYYY-MM-DD");
            if (dayjs(newToDate).isAfter(dayjs(fromDate))) {
              setToDate(newToDate);
            } else {
              setToDate("");
              NotifySnackbar(
                enqueueSnackbar,
                '"Ngày cuối" phải sau "Ngày đầu"',
                "error"
              );
            }
          }}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        <TextField
          variant="outlined"
          label="Chất lượng"
          sx={{ width: "100%" }}
          value={quality}
          onChange={(event) => {
            setQuality(event.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={1}>
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
                <TableCell align="left">Sản phẩm</TableCell>
                <TableCell align="left">ĐVT</TableCell>
                <TableCell align="left">Tồn ĐK</TableCell>
                <TableCell align="left">Nhập</TableCell>
                <TableCell align="left">Xuất</TableCell>
                <TableCell align="left">Tồn CK</TableCell>
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
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{row.ProductName}</TableCell>
                    <TableCell align="left">{row.MeasName}</TableCell>
                    <TableCell align="left">{row.tonDK}</TableCell>
                    <TableCell align="left">{row.Nhap}</TableCell>
                    <TableCell align="left">{row.Xuat}</TableCell>
                    <TableCell align="left">{row.tonCK}</TableCell>
                    <TableCell align="left">{row.QuyDoi}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
