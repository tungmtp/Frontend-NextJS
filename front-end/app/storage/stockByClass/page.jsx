"use client";
import SelectNewsky from "@/components/select/SelectNewsky";
import {
  Autocomplete,
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
import React, { useEffect, useState } from "react";
import { filterWarehouseID } from "@/components/selectOptions";
import SelectTreeView from "@/components/select/SelectTreeView";
import { getData } from "@/hook/Hook";
import dayjs from "dayjs";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
import SelectAttributeTreeView from "@/components/select/SelectAttributeTreeView";
export default function StockByClass() {
  const { enqueueSnackbar } = useSnackbar();
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DD");
  const dateMinus = dayjs(date).subtract(7, "day").format("YYYY-MM-DD");
  const [data, setdata] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  const [lastDate, setLastDate] = useState(currentDate);
  const [wareHouseID, setWareHouseID] = useState(2);
  const [quality, setQuality] = useState(1);

  useEffect(() => {
    const getClasses = async () => {
      const reponse = await getData("/product-service/classes");
      setClasses(reponse);
    };
    getClasses();
  }, []);
  const handleFilter = async () => {
    if (
      selectedClass === "" ||
      selectedClass === null ||
      lastDate === "" ||
      quality === ""
    ) {
      NotifySnackbar(
        enqueueSnackbar,
        `Vui lòng nhập đủ các trường!!`,
        "warning"
      );
    } else {
      const result = await getData(
        `/product-service/product/allProductByClassAtAllWarehouse/${selectedClass.id}/${lastDate}`
      );
      setdata(result);
      console.log("data: ", result);
    }
  };
  console.log(selectedClass);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Tồn các sản phẩm theo Class</Typography>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Autocomplete
          fullWidth
          getOptionLabel={(option) => option?.nameStr}
          options={classes || []}
          renderInput={(params) => <TextField {...params} label="Class" />}
          onChange={(event, value) => {
            setSelectedClass(value);
          }}
          value={selectedClass || null}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DatePicker
          sx={{ width: "100%" }}
          label="Ngày cuối"
          value={dayjs(lastDate)}
          onChange={(newValue) => {
            const newLastDate = newValue.format("YYYY-MM-DD");

            setLastDate(newLastDate);
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
