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
import { filterWarehouseID } from "@/components/selectOptions";
import { getData } from "@/hook/Hook";
import dayjs from "dayjs";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
export default function OneProductOneStorage() {
  const { enqueueSnackbar } = useSnackbar();
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DD");
  const dateMinus = dayjs(date).subtract(7, "day").format("YYYY-MM-DD");
  const [data, setData] = useState(null);
  const [fromDate, setFromDate] = useState(dateMinus);
  const [toDate, setToDate] = useState(currentDate);
  const [wareHouseID, setWareHouseID] = useState(2);
  const [productID, setProductID] = useState("");
  const handleFilter = async () => {
    if (fromDate === "" || toDate === "" || productID === "") {
      NotifySnackbar(
        enqueueSnackbar,
        `Vui lòng nhập đủ các trường!!`,
        "warning"
      );
    } else {
      const result = await getData(
        `/product-service/product/getInOutOneProductAtOneWarehouse/${wareHouseID}/${fromDate}/${toDate}/${productID}`
      );
      setData(result);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Tồn 01 SP tại 01 kho</Typography>
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
      <Grid item xs={12} md={6} lg={6}>
        <SelectNewsky
          lblinput="Sản phẩm"
          emitParent={(id) => {
            setProductID(id);
          }}
          byNameStr="/product-service/product/byNameStr/mayBeSell"
          // firstCall="/product-service/product/firstCall/mayBeSell"
          // currentItemLink="/product-service/product/oneForSelect"
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
                <TableCell align="left">Ngày</TableCell>
                <TableCell align="left">Nội dung</TableCell>
                <TableCell align="left">Loại</TableCell>
                <TableCell align="left">ĐVT</TableCell>
                <TableCell align="left">Nhập</TableCell>
                <TableCell align="left">Xuất</TableCell>
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
                    <TableCell align="left">
                      {dayjs(row.ngayXN).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell align="left">{row.Noidung}</TableCell>
                    <TableCell align="left">{row.quality}</TableCell>
                    <TableCell align="left">{row.MeasName}</TableCell>
                    <TableCell align="left">{row.nhap}</TableCell>
                    <TableCell align="left">{row.xuat}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
