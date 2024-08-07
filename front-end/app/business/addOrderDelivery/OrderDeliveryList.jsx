"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
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
import { PostDataMessage, deleteData, getData, putData } from "@/hook/Hook";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Link from "next/link";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
const username = Cookies.get("username");
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
export default function OrderDeliveryList(props) {
  const { enqueueSnackbar } = useSnackbar();
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DD");
  const [selectedOrderDelivery, setSelectedOrderDelivery] = React.useState([]);
  const [deliveryDate, setDeliveryDate] = React.useState(currentDate);
  const [eventList, setEventList] = React.useState([]);
  const [eventSourceData, setEventSourceData] = React.useState([]);
  // const [orderDeliveryDetailList, setOrderDeliveryDetailList] = React.useState(
  //   []
  // );

  const searchParams = useSearchParams();
  let orderID = searchParams.get("id");
  // console.log("selectedOrderDelivery: ", selectedOrderDelivery);

  React.useEffect(() => {
    const getOrderDelivery = async () => {
      try {
        const response = await getData(
          `/business-service/orderDeliverySql/getDeliveryByReqDateOfOrder/${props.orderID}/${props.reqDate}`
        );
        const eventListResult = await getData(
          "/common-module/eventList/ORDER DELIVERY DO IT"
        );
        // console.log(eventListResult);
        setEventList(eventListResult);
        setSelectedOrderDelivery(response);
      } catch (error) {
        console.log(error);
      }
    };
    getOrderDelivery();
    const handleNewDataFromEventSource = (event) => {
      const dataFromEventSource = event.detail;
      console.log("Received new data from eventSource: ", dataFromEventSource);
      if (
        dataFromEventSource.headers.RequestType[0] === "DELETE_ORDER_DELIVERY"
        // && dataFromEventSource.headers.UserName[0] !== username
      ) {
        setSelectedOrderDelivery((prevState) =>
          prevState.filter(
            (item) =>
              item.id.toUpperCase() !== dataFromEventSource.body.toUpperCase()
          )
        );
      }
      if (
        dataFromEventSource.body.eventName === "ORDER DELIVERY DO IT" &&
        dataFromEventSource.headers.RequestType[0] === "ADD_EVENT"
      ) {
        setEventList((prevEventList) => [
          ...prevEventList,
          dataFromEventSource.body,
        ]);
        console.log("ADD EVENT: ", dataFromEventSource);
      }
      if (
        dataFromEventSource.headers.RequestType[0] === "DELETE_EVENT" &&
        dataFromEventSource.headers.UserName[0] !== "SERVER"
      ) {
        setEventList((prevEventList) =>
          prevEventList.filter(
            (event) => event.eventId !== dataFromEventSource.body[0]?.eventId
          )
        );

        console.log("DELETE EVENT: ", dataFromEventSource);
      }
      if (
        dataFromEventSource.headers.RequestType[0] === "DELETE_EVENT" &&
        dataFromEventSource.headers.UserName[0] === "SERVER"
      ) {
        setEventList((prevEventList) =>
          prevEventList.filter(
            (event) => event.eventId !== dataFromEventSource.body.eventId
          )
        );

        console.log("DELETE EVENT: ", dataFromEventSource);
      }
      if (
        dataFromEventSource.headers.RequestType[0] ===
        "SENDMESSAGE_orderDelivery"
      ) {
        setEventSourceData(dataFromEventSource);

        if (dataFromEventSource.headers.Status[0] === "success") {
          setSelectedOrderDelivery((prevState) =>
            prevState?.map((item) => {
              if (item.id === dataFromEventSource.body) {
                item.inProcess = false;
                item.completed = true;
                return item;
              }
              return item;
            })
          );
        } else if (dataFromEventSource.headers.Status[0] === "cancel") {
          setSelectedOrderDelivery((prevState) =>
            prevState?.map((item) => {
              if (item.id === dataFromEventSource.body) {
                item.inProcess = false;
                item.completed = false;
                item.cancel = true;
                return item;
              }
              return item;
            })
          );
        } else if (dataFromEventSource.headers.Status[0] === "normal") {
          setSelectedOrderDelivery((prevState) =>
            prevState?.map((item) => {
              if (item.id === dataFromEventSource.body) {
                item.inProcess = false;
                item.completed = false;
                item.cancel = false;
                return item;
              }
              return item;
            })
          );
        }
      }
    };
    window.addEventListener("newDataEvent", handleNewDataFromEventSource);

    return () => {
      window.removeEventListener("newDataEvent", handleNewDataFromEventSource);
    };
  }, [props.reqDate, props.orderID]);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Lịch giao hàng theo đơn cung ứng ngày{" "}
          {dayjs(props.reqDate).format("DD/MM/YYYY")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead
              sx={{
                backgroundColor: "#c0c077",
              }}
            >
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="left">Khách hàng</TableCell>
                <TableCell align="left">
                  Ngày giao và địa chỉ giao hàng
                </TableCell>
                <TableCell align="left">Sản phẩm</TableCell>
                <TableCell align="left">Comm</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedOrderDelivery?.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={
                    // row.inProcess === true
                    //   ? {
                    //       "&:last-child td, &:last-child th": { border: 0 },
                    //       backgroundColor: "#f89595",
                    //     }
                    eventList.some((item) => item.eventId === row.id)
                      ? {
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor: "#f89595",
                        }
                      : row.completed === true
                      ? {
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor: "#96be98",
                        }
                      : row.cancel === true
                      ? {
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor: "#c1c1c1",
                        }
                      : {
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor: "#ffffc3",
                        }
                  }
                >
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="left">{row.partnerName}</TableCell>
                  <TableCell align="left">
                    <span style={{ fontWeight: "bold" }}>
                      {dayjs(row.deliveryDate).format("DD/MM/YYYY")}
                    </span>{" "}
                    <br />
                    {row.deliveryAddress}
                  </TableCell>
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
                    {eventList.some((item) => item.eventId === row.id) ? (
                      <Link
                        href={{}}
                        onClick={() => {
                          NotifySnackbar(
                            enqueueSnackbar,
                            `Đơn hàng này đang được thực hiện!!`,
                            "warning"
                          );
                        }}
                      >
                        In process
                      </Link>
                    ) : row.cancel ? (
                      <>
                        <Link
                          href={""}
                          onClick={() => {
                            event.preventDefault();
                            putData("/business-service/orderDelivery", row.id, {
                              cancel: false,
                            });
                            PostDataMessage(
                              "/business-service/orderDelivery/sendMessage/orderDeliveryID/normal",
                              row.id
                            );
                          }}
                        >
                          Reactivate
                        </Link>
                      </>
                    ) : row.completed === true ? (
                      <></>
                    ) : (
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        {/* <Link
                          href={{
                            pathname: "/storage/exportProduct/addExportProduct",
                            query: {
                              id: row.id,
                            },
                          }}
                          target="_blank"
                        >
                          Do it
                        </Link> */}
                        {/* <a
                          href={{
                            pathname: "/storage/exportProduct/addExportProduct",
                            query: {
                              id: row.id,
                            },
                          }}
                          target="_blank"
                        >
                          Do it
                        </a> */}
                        <Link
                          href={""}
                          onClick={() => {
                            event.preventDefault();
                            putData("/business-service/orderDelivery", row.id, {
                              cancel: true,
                            });
                            PostDataMessage(
                              "/business-service/orderDelivery/sendMessage/orderDeliveryID/cancel",
                              row.id
                            );
                          }}
                        >
                          cancel
                        </Link>
                        <Link
                          href={""}
                          onClick={() => {
                            event.preventDefault();
                            if (
                              confirm("Bạn muốn xóa đơn giao hàng này?") == true
                            ) {
                              deleteData(
                                `/business-service/orderDelivery`,
                                row.id
                              );
                              const updateSelectedOrderDelivery =
                                selectedOrderDelivery.filter(
                                  (item) => item.id !== row.id
                                );
                              setSelectedOrderDelivery(
                                updateSelectedOrderDelivery
                              );
                            }
                          }}
                        >
                          Delete
                        </Link>
                      </Box>
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
