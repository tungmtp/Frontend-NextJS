"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { getData } from "@/hook/Hook";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Link from "next/link";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
// const columns = [
//   { field: "stt", headerName: "STT", width: 70 },
//   { field: "khachHang", headerName: "Khách hàng", width: 300 },
//   { field: "diaChiGiaoHang", headerName: "Địa chỉ giao hàng", width: 400 },
//   { field: "sanPham", headerName: "Sản phẩm", width: 500 },
//   { field: "comm", headerName: "Comm", width: 150 },
// ];

const warehouseID = {
  0: "none",
  1: "Kho văn phòng",
  2: "Kho Nhà máy Việt Á",
  3: "Kho Sài gòn",
  4: "Giao thẳng từ nhà cung cấp",
  10: "Kho CPC",
};
const getWarehouseIDName = (selectedWarehouseID) => {
  return warehouseID[selectedWarehouseID];
};
export default function OrderDelivery() {
  const { enqueueSnackbar } = useSnackbar();
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DD");
  const [selectedOrderDelivery, setSelectedOrderDelivery] = React.useState();
  const [deliveryDate, setDeliveryDate] = React.useState(currentDate);
  const [eventSourceData, setEventSourceData] = React.useState(null);
  // const [orderDeliveryDetailList, setOrderDeliveryDetailList] = React.useState(
  //   []
  // );
  // console.log(selectedOrderDelivery);

  const searchParams = useSearchParams();
  let orderID = searchParams.get("id");
  // console.log("selectedOrderDelivery: ", selectedOrderDelivery);

  React.useEffect(() => {
    const getOrderDelivery = async () => {
      try {
        const response = await getData(
          `/business-service/orderDeliverySql/${deliveryDate}`
        );
        setSelectedOrderDelivery(response);
      } catch (error) {
        console.log(error);
      }
    };
    getOrderDelivery();
    const handleNewDataFromEventSource = (event) => {
      const dataFromEventSource = event.detail;
      console.log("Received new data from eventSource: ", dataFromEventSource);
      console.log(dataFromEventSource.headers.UserName[0]);
      setEventSourceData(dataFromEventSource);
    };
    window.addEventListener("newDataEvent", handleNewDataFromEventSource);

    return () => {
      window.removeEventListener("newDataEvent", handleNewDataFromEventSource);
    };
  }, [deliveryDate]);
  return (
    <Grid container spacing={4}>
      <Grid item xs={4}>
        <Typography variant="h5" gutterBottom>
          Lịch giao hàng
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <DatePicker
          sx={{ width: "100%" }}
          label="Ngày giao"
          value={dayjs(deliveryDate)}
          onChange={(newValue) => {
            const newDate = newValue.format("YYYY-MM-DD");
            setDeliveryDate(newDate);
          }}
        />
      </Grid>
      <Grid item xs={4}>
        {/* <FormControl sx={{ width: "100%" }} size="small">
          <InputLabel id="partner-type-label">Xuất từ kho</InputLabel>
          <Select
            sx={{ width: "100%" }}
            labelId="partner-type-label"
            id="partner-type-select"
            //   value={orderDelivery?.warehouseID}
            label="Xuất từ kho"
            //   onChange={(event) => {
            //     const updatedOrderDelivery = { ...orderDelivery };
            //     updatedOrderDelivery.warehouseID = Number(event.target.value);
            //     setOrderDelivery(updatedOrderDelivery);
            //   }}
          >
            {Object.keys(warehouseID).map((key) => (
              <MenuItem key={key} value={key}>
                {getWarehouseIDName(key)}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "#c0c077" }}>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="right">Khách hàng</TableCell>
                <TableCell align="right">Địa chỉ giao hàng</TableCell>
                <TableCell align="left">Sản phẩm</TableCell>
                <TableCell align="left">Comm</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedOrderDelivery?.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={
                    eventSourceData != null && row.id == eventSourceData.body
                      ? {
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor: "#f89595",
                        }
                      : {
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor: "#ffffc3",
                        }
                  }
                >
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="right">{row.partnerName}</TableCell>
                  <TableCell align="right">{row.deliveryAddress}</TableCell>
                  <TableCell align="left">
                    {row.deliveryDetail?.map((item) => {
                      return (
                        <Box sx={{ mb: 1 }} key={item.id}>
                          <span style={{ fontWeight: "bold", marginRight: 8 }}>
                            {item.productName}
                          </span>
                          <span
                            style={{
                              fontStyle: "italic",
                              color: "red",
                              fontWeight: "bold",
                              marginRight: 8,
                            }}
                          >
                            {item.quantity} {item.MeasName}
                          </span>
                          <span> Loại: {item.quality}</span>
                        </Box>
                      );
                    })}
                  </TableCell>
                  <TableCell align="left">
                    {eventSourceData != null &&
                    eventSourceData.body == row.id ? (
                      <Link
                        href={{}}
                        onClick={() => {
                          NotifySnackbar(
                            enqueueSnackbar,
                            `${eventSourceData.headers.UserName[0]} đang sửa mục này!!`,
                            "warning"
                          );
                        }}
                      >
                        In process
                      </Link>
                    ) : (
                      <Link
                        href={{
                          pathname: "/storage/exportProduct/addExportProduct",
                          query: {
                            id: row.id,
                          },
                        }}
                      >
                        Do it
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
