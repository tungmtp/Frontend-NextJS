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
import AddDetailExportTable from "../exportProduct/addExportProduct/AddDetailExportTable";
import ExportAnotherStorageTable from "./ExportAnotherStorageTable";
const username = Cookies.get("username");

export default function ExportAnotherStorage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  let orderDeliveryID = searchParams.get("id");
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DD");
  const [selectedOrderDelivery, setSelectedOrderDelivery] = React.useState([]);
  const [stockout, setStockout] = React.useState({
    slipDate: currentDate,
    comment: "",
    // relatedTable: "",
    // relatedID: "",
    createdBy: username,
    createdOn: currentDate,
    purpose: 6,
    // paymentDate: currentDate,
    noidung: "",
    warehouseID: "",
    shipTo: "",
  });
  const [stockoutDetail, setStockoutDetail] = React.useState();
  const [changePage, setChangePage] = React.useState(false);
  console.log("stockout: ", stockout);
  React.useEffect(() => {
    // const getOrderDetailData = async () => {
    //   try {
    //     const result = await getData(
    //       `/business-service/orderDeliverySql/byId/${orderDeliveryID}`
    //     );
    //     console.log("SelectedOrderDelivery: ", result);
    //     const updateStockout = { ...stockout };
    //     updateStockout.comment = result[0].deliveryAddress;
    //     updateStockout.purpose = result[0].purpose;
    //     updateStockout.paymentDate = result[0].paymentDate;
    //     updateStockout.slipDate = result[0].deliveryDate;
    //     updateStockout.warehouseID = result[0].warehouseID;
    //     setSelectedOrderDelivery(result);
    //     setStockout(updateStockout);
    //     setChangePage(true);
    //   } catch (err) {
    //     console.error("Error fetching order detail data:", err);
    //   }
    // };
    // getOrderDetailData();
    // return () => {
    //   // if (changePage) {
    //   alert("chuyen trang!!!");
    //   // }
    //   // putData("/business-service/orderDelivery", orderDeliveryID, {
    //   //   inProcess: false,
    //   // });
    // };
  }, []);

  return (
    <Grid container justifyContent="center" spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h5">Xuất chuyển hàng sang kho khác</Typography>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DatePicker
          sx={{ width: "100%" }}
          label="Ngày xuất kho"
          value={dayjs(stockout?.slipDate)}
          onChange={(newValue) => {
            const updatedStockout = { ...stockout };
            updatedStockout.slipDate = newValue.format("YYYY-MM-DD");
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
          <InputLabel id="partner-type-label">Kho xuất</InputLabel>
          <Select
            sx={{ width: "100%" }}
            labelId="partner-type-label"
            id="partner-type-select"
            label="Kho xuất"
            value={stockout?.warehouseID}
            onChange={(event) => {
              const updatedStockout = { ...stockout };
              updatedStockout.warehouseID = Number(event.target.value);
              setStockout(updatedStockout);
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
      <Grid item xs={12} md={6} lg={3}>
        <FormControl sx={{ width: "100%" }} size="small">
          <InputLabel id="partner-type-label">Kho nhận</InputLabel>
          <Select
            sx={{ width: "100%" }}
            labelId="partner-type-label"
            id="partner-type-select"
            label="Kho nhận"
            value={stockout?.shipTo}
            onChange={(event) => {
              const updatedStockout = { ...stockout };
              updatedStockout.shipTo = Number(event.target.value);
              setStockout(updatedStockout);
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
          label="Thông tin xuất hàng"
          sx={{ width: "100%" }}
          value={stockout.comment}
          placeholder="Hóa đơn VAT, biển số xe, tên người giao,..."
          onChange={(event) => {
            const updatedStockout = { ...stockout };
            updatedStockout.comment = event.target.value;
            setStockout(updatedStockout);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <ExportAnotherStorageTable
          deliveryDetail={selectedOrderDelivery?.[0]?.deliveryDetail}
          stockout={stockout}
          orderDeliveryID={orderDeliveryID}
        />
      </Grid>
    </Grid>
  );
}
