"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import { format } from "date-fns";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { DatePicker } from "@mui/x-date-pickers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PostDataMessage, getData, postData, putData } from "@/hook/Hook";
import Cookies from "js-cookie";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
import { purpose, warehouseID } from "@/components/selectOptions";
import AddDetailImport from "./AddDetailImport";

const username = Cookies.get("username");

export default function AddNewImport() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  let orderDeliveryID = searchParams.get("id");
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DDTHH:mm:ss");
  const [stockin, setStockin] = React.useState({
    slipDate: currentDate,
    comment: "",
    // relatedTable: "OrderDelivery",
    // relatedID: orderDeliveryID,
    createdBy: username,
    createdOn: currentDate,
    purpose: "",
    paymentDate: currentDate,
    noidung: "",
    warehouseID: 1,
    receiveFrom: 1,
  });
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h5">Đơn nhập hàng mới:</Typography>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DatePicker
          sx={{ width: "100%" }}
          label="Ngày giao"
          value={dayjs(stockin?.slipDate)}
          onChange={(newValue) => {
            const updatedStockin = { ...stockin };
            updatedStockin.slipDate = newValue.format("YYYY-MM-DD");
            setStockin(updatedStockin);
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DatePicker
          sx={{ width: "100%" }}
          label="Ngày hứa thanh toán"
          value={dayjs(stockin?.paymentDate)}
          onChange={(newValue) => {
            const updatedStockin = { ...stockin };
            updatedStockin.paymentDate = newValue.format("YYYY-MM-DD");
            setStockin(updatedStockin);
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <FormControl sx={{ width: "100%" }} size="small">
          <InputLabel id="partner-type-label">Mục đích nhập</InputLabel>
          <Select
            sx={{ width: "100%" }}
            labelId="partner-type-label"
            id="partner-type-select"
            value={stockin?.purpose}
            label="Mục đích nhập"
            onChange={(event) => {
              const updatedStockin = { ...stockin };
              updatedStockin.purpose = Number(event.target.value);
              setStockin(updatedStockin);
            }}
          >
            {Object.keys(purpose).map((key) => (
              <MenuItem key={key} value={key}>
                {purpose[key]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <FormControl sx={{ width: "100%" }} size="small">
          <InputLabel id="partner-type-label">nhập vào kho</InputLabel>
          <Select
            sx={{ width: "100%" }}
            labelId="partner-type-label"
            id="partner-type-select"
            label="Xuất từ kho"
            value={stockin?.warehouseID}
            onChange={(event) => {
              const updatedStockin = { ...stockin };
              updatedStockin.warehouseID = Number(event.target.value);
              setStockin(updatedStockin);
            }}
          >
            {Object.keys(warehouseID).map((key) => (
              <MenuItem key={key} value={key}>
                {warehouseID[key]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <TextField
          multiline
          name="deliveryAddress"
          variant="outlined"
          label="Nội dung"
          sx={{ width: "100%" }}
          value={stockin.noidung}
          onChange={(event) => {
            const updatedStockin = { ...stockin };
            updatedStockin.noidung = event.target.value;
            setStockin(updatedStockin);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          multiline
          name="deliveryAddress"
          variant="outlined"
          label="Địa chỉ nhận hàng"
          sx={{ width: "100%" }}
          value={stockin.comment}
          placeholder="Nhập địa chỉ nhận hàng"
          onChange={(event) => {
            const updatedStockin = { ...stockin };
            updatedStockin.comment = event.target.value;
            setStockin(updatedStockin);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <AddDetailImport stockin={stockin} />
      </Grid>
    </Grid>
  );
}
