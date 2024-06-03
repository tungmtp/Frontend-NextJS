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
import { useRouter, useSearchParams } from "next/navigation";
import { PostDataMessage, getData, postData } from "@/hook/Hook";
import Cookies from "js-cookie";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
import { purpose, warehouseID } from "@/components/selectOptions";
import AddDetailExportTable from "./AddDetailExportTable";
const username = Cookies.get("username");

export default function AddExportProduct() {
  const searchParams = useSearchParams();
  let orderDeliveryID = searchParams.get("id");
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DDTHH:mm:ss");
  const [selectedOrderDelivery, setSelectedOrderDelivery] = React.useState([]);
  const [stockout, setStockout] = React.useState({
    slipDate: currentDate,
    comment: "",
    relatedTable: "OrderDelivery",
    relatedID: orderDeliveryID,
    createdBy: username,
    createdOn: currentDate,
    purpose: "",
    paymentDate: currentDate,
    noidung: "",
    warehouseID: 0,
  });
  const [stockoutDetail, setStockoutDetail] = React.useState();
  // console.log("selectedOrderDelivery: ", selectedOrderDelivery);
  // console.log(
  //   "selectedOrderDeliveryDetail: ",
  //   selectedOrderDelivery[0]?.deliveryDetail
  // );
  // console.log("stockout: ", stockout);
  // console.log("stockoutDetail: ", stockoutDetail);
  React.useEffect(() => {
    PostDataMessage(
      "/business-service/orders/sendMessage/orderDeliveryID",
      orderDeliveryID
    );
    const getOrderDetailData = async () => {
      try {
        const result = await getData(
          `/business-service/orderDeliverySql/byId/${orderDeliveryID}`
        );
        const updateStockout = { ...stockout };
        updateStockout.comment = result[0].deliveryAddress;
        updateStockout.purpose = result[0].purpose;
        updateStockout.paymentDate = result[0].paymentDate;
        updateStockout.slipDate = result[0].deliveryDate;
        updateStockout.warehouseID = result[0].warehouseID;
        setSelectedOrderDelivery(result);
        setStockout(updateStockout);
      } catch (err) {
        console.error("Error fetching order detail data:", err);
      }
    };
    getOrderDetailData();
  }, []);
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h5">
          Xuất hàng cho {selectedOrderDelivery[0]?.partnerName} đơn hàng số:
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DatePicker
          sx={{ width: "100%" }}
          label="Ngày giao"
          value={dayjs(stockout?.slipDate)}
          onChange={(newValue) => {
            const updatedStockout = { ...stockout };
            updatedStockout.slipDate = newValue.format("YYYY-MM-DD");
            setStockout(updatedStockout);
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DatePicker
          sx={{ width: "100%" }}
          label="Ngày hứa thanh toán"
          value={dayjs(stockout?.paymentDate)}
          onChange={(newValue) => {
            const updatedStockout = { ...stockout };
            updatedStockout.paymentDate = newValue.format("YYYY-MM-DD");
            setStockout(updatedStockout);
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <FormControl sx={{ width: "100%" }} size="small">
          <InputLabel id="partner-type-label">Mục đích giao</InputLabel>
          <Select
            disabled
            sx={{ width: "100%" }}
            labelId="partner-type-label"
            id="partner-type-select"
            value={stockout?.purpose}
            label="Mục đích giao"
            // onChange={(event) => {
            //   const updatedOrderDelivery = { ...orderDelivery };
            //   updatedOrderDelivery.purpose = Number(event.target.value);
            //   setOrderDelivery(updatedOrderDelivery);
            // }}
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
          <InputLabel id="partner-type-label">Xuất từ kho</InputLabel>
          <Select
            disabled
            sx={{ width: "100%" }}
            labelId="partner-type-label"
            id="partner-type-select"
            label="Xuất từ kho"
            value={stockout?.warehouseID}
            // onChange={(event) => {
            //   const updatedOrderDelivery = { ...orderDelivery };
            //   updatedOrderDelivery.warehouseID = Number(event.target.value);
            //   setOrderDelivery(updatedOrderDelivery);
            // }}
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
          value={stockout.noidung}
          onChange={(event) => {
            const updatedStockout = { ...stockout };
            updatedStockout.noidung = event.target.value;
            setStockout(updatedStockout);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          multiline
          name="deliveryAddress"
          variant="outlined"
          label="Địa chỉ giao hàng"
          sx={{ width: "100%" }}
          value={stockout.comment}
          placeholder="Nhập địa chỉ giao hàng"
          onChange={(event) => {
            const updatedStockout = { ...stockout };
            updatedStockout.comment = event.target.value;
            setStockout(updatedStockout);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <AddDetailExportTable
          deliveryDetail={selectedOrderDelivery?.[0]?.deliveryDetail}
          stockout={stockout}
        />
      </Grid>
    </Grid>
  );
}
