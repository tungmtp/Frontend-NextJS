"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { getData } from "@/hook/Hook";
import CustomNoRowsOverlay from "@/components/general/CustomNoRowsOverlay";
import OrderInfo from "@/components/order/OrderInfo";
import OrderDetailTable from "@/components/order/OrderDetailTable";
import CollectMoneyTable from "@/components/order/CollectMoneyTable";
import OrderPaymentTable from "@/components/order/OrderPaymentTable";
import { Grid } from "@mui/material";
import Cookies from "js-cookie";
import { format } from "date-fns";

// const today = new Date().toJSON();
const date = new Date();
const today = dayjs(date).format("YYYY-MM-DD");
const username = Cookies.get("username");
export default function Order() {
  const [ordersData, setOrdersData] = useState([]);
  const [orderDate, setOrderDate] = useState(today);
  const [partnerData, setPartnerData] = useState([]);
  const [selectedDataGrid, setSelectedDataGrid] = useState(null);
  const partnerName = partnerData?.find(
    (item) => item.id === selectedDataGrid?.partnersID
  )?.nameStr;
  // console.log(format(new Date(1719964800000), "yyyy-MM-dd") === orderDate);
  // console.log(orderDate);
  useEffect(() => {
    const getOrdersData = async () => {
      try {
        const result = await getData(
          `/business-service/orders/byOrderDate?orderDate=${orderDate}`
        );
        const result2 = await getData(`/business-service/partner`);

        const resultWithIndex = result.map((row, index) => ({
          ...row,
          index: index + 1,
        }));
        setOrdersData(resultWithIndex);
        const result2WithIndex = result2.map((row, index) => ({
          ...row,
          index: index + 1,
        }));
        setPartnerData(result2WithIndex);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getOrdersData();
    const handleNewDataFromEventSource = (event) => {
      const dataFromEventSource = event.detail;
      console.log("Received new data from eventSource: ", dataFromEventSource);
      if (
        dataFromEventSource.headers.RequestType[0] === "ADD_ORDER" &&
        dataFromEventSource.headers.UserName[0] !== username
      ) {
        const addOrder = dataFromEventSource.body;
        const newOrderDate = format(new Date(addOrder.orderDate), "yyyy-MM-dd");
        console.log("da do day");
        console.log(orderDate);
        if (newOrderDate === orderDate) {
          setOrdersData((prevState) => [
            ...prevState,
            {
              index: prevState.length + 1,
              id: addOrder.id,
              partnersID: addOrder.partnersID,
            },
          ]);
        }
        console.log("ADD ORDER: ", dataFromEventSource);
      }
    };
    window.addEventListener("newDataEvent", handleNewDataFromEventSource);
    return () => {
      window.removeEventListener("newDataEvent", handleNewDataFromEventSource);
    };
  }, [orderDate]);
  useEffect(() => {}, []);
  const columns = [
    { field: "index", headerName: "STT", width: 10 },
    { field: "id", headerName: "id", width: 1 },
    {
      field: "partnersID",
      headerName: "Đối tác",
      flex: 8,

      renderCell: (params) => {
        const partnerName = partnerData.find(
          (item) => item.id === params.row.partnersID
        )?.nameStr;
        return (
          <Link
            href={""}
            style={{ color: "black" }}
            key={params.row.id}
            color="inherit"
            variant="body1"
            onClick={() => {
              setSelectedDataGrid(params.row);
            }}
          >
            {partnerName}
          </Link>
        );
      },
    },
  ];

  //tạo 1 func để truyền vào dataGird vì hàm trong dataGird không nhận prop truyền vào
  const NoRowsOverlay = () => {
    return <CustomNoRowsOverlay title="Chưa có đơn hàng ngày hôm nay !!!" />;
  };
  return (
    <Grid container spacing={8}>
      <Grid item lg={3} xs={11.5}>
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              mb: 2,
              columnGap: 2,
            }}
          >
            <DatePicker
              label="Ngày Order"
              value={dayjs(orderDate)}
              onChange={(newValue) => {
                setOrderDate(newValue.format("YYYY-MM-DD"));
              }}
              sx={{ width: "100%" }}
            />

            <Fab
              size="small"
              color="primary"
              aria-label="add"
              sx={{ width: "48px" }}
              //   onClick={handleOpenAdd}
            >
              <Link
                href={"/business/order/addNewOrder"}
                style={{
                  color: "white",
                  width: "100%",
                  padding: 0,
                  display: "flex",
                  justifyContent: "space-around",
                  textDecoration: "none",
                }}
              >
                <AddIcon />
              </Link>
            </Fab>
          </Box>
          <DataGrid
            rows={ordersData}
            columns={columns}
            pageSize={1}
            slots={{
              noRowsOverlay: NoRowsOverlay,
            }}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false,
                },
              },
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            sx={{ height: "305px", minWidth: "305px" }}
          />
        </Box>
      </Grid>
      {/* <FormAddDialog open={openAddDialog} /> */}
      <Grid item xs={11.5} lg={9}>
        {selectedDataGrid ? (
          <>
            <OrderInfo
              selectedOder={selectedDataGrid}
              partnerData={partnerData}
            />
            <OrderDetailTable
              orderID={selectedDataGrid.id}
              partnerName={partnerName}
            />
            <CollectMoneyTable />
            <OrderPaymentTable />
          </>
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
}
