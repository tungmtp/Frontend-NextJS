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
export default function ManyProductOneStorage() {
  const { enqueueSnackbar } = useSnackbar();
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DD");
  const dateMinus = dayjs(date).subtract(7, "day").format("YYYY-MM-DD");
  const [data, setdata] = useState(null);
  const [fromDate, setFromDate] = useState(dateMinus);
  const [toDate, setToDate] = useState(currentDate);
  const [wareHouseID, setWareHouseID] = useState(2);
  const [quality, setQuality] = useState(1);
  const handleFilter = async () => {
    if (fromDate === "" || toDate === "" || quality === "") {
      NotifySnackbar(
        enqueueSnackbar,
        `Vui lòng nhập đủ các trường!!`,
        "warning"
      );
    } else {
      const result = await getData(
        `/product-service/product/allProductInOneWarehouse/${wareHouseID}/${fromDate}/${toDate}/${quality}`
      );
      setdata(result);
    }
  };
  console.log(quality);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Tồn các sản phẩm trong một kho</Typography>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <DatePicker
          sx={{ width: "100%" }}
          label="Ngày đầu"
          value={dayjs(fromDate)}
          onChange={(newValue) => {
            const newFromDate = newValue.format("YYYY-MM-DD");
            if (dayjs(newFromDate).isBefore(dayjs(toDate))) {
              setFromDate(newFromDate);
            } else {
              setFromDate("");
              NotifySnackbar(
                enqueueSnackbar,
                '"Ngày đầu" phải trước "Ngày cuối"',
                "error"
              );
            }
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
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
      {/* <Grid item xs={12} md={6} lg={4}>
        <SelectTreeView />
      </Grid> */}

      <Grid item xs={12} md={6} lg={6}>
        <FormControl sx={{ width: "100%" }} size="small">
          <InputLabel id="partner-type-label">Kiểm tra tại kho</InputLabel>
          <Select
            sx={{ width: "100%" }}
            labelId="partner-type-label"
            id="partner-type-select"
            label="Kiểm tra tại kho"
            value={wareHouseID}
            onChange={(event) => {
              setWareHouseID(Number(event.target.value));
            }}
          >
            {Object.keys(filterWarehouseID).map((key) => (
              <MenuItem key={key} value={key}>
                {filterWarehouseID[key]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6} lg={5}>
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
                    <TableCell align="left">{row.NameStr}</TableCell>
                    <TableCell align="left">{row.MeasName}</TableCell>
                    <TableCell align="left">{row.tonDK}</TableCell>
                    <TableCell align="left">{row.mNhap}</TableCell>
                    <TableCell align="left">{row.mXuat}</TableCell>
                    <TableCell align="left">{row.tonCK}</TableCell>
                    <TableCell align="left">{row.quydoi}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
