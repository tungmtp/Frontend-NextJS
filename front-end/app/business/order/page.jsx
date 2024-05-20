"use client";
import {
  selectCategoryProducts,
  setSelectedCategory,
} from "@/redux/categoryProductRedux";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import FolderOpenTwoToneIcon from "@mui/icons-material/FolderOpenTwoTone";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { deleteData, getData, postData, putData } from "@/hook/Hook";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CustomNoRowsOverlay from "@/components/general/CustomNoRowsOverlay";
import OrderInfo from "@/components/order/OrderInfo";
import OrderDetailTable from "@/components/order/OrderDetailTable";
import CollectMoneyTable from "@/components/order/CollectMoneyTable";
import OrderPaymentTable from "@/components/order/OrderPaymentTable";
const measureCategory = {
  1: "Diện tích",
  2: "Chiều dài",
  3: "Khối lượng",
  4: "Đơn lẻ (unit)",
  5: "Thể tích",
};

const getMeasCateName = (selectedButtonGroup) => {
  return measureCategory[selectedButtonGroup];
};
const rows = [
  {
    id: 16576556757,
    col1: "CL.C23.TRANG.08770-6.R7.2000  Phào trắng 10",
    col2: "Cây 2.0",
  },
];

const today = new Date().toJSON();

export default function Order() {
  const [ordersData, setOrdersData] = useState([]);
  const [orderDate, setOrderDate] = useState(today);
  const [partnerData, setPartnerData] = useState([]);

  const [selectedButtonGroup, setSelectedButtonGroup] = useState(1);
  const [selectedDataGrid, setSelectedDataGrid] = useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openFixDialog, setOpenFixDialog] = React.useState(false);
  const partnerName = partnerData?.find(
    (item) => item.id === selectedDataGrid?.partnersID
  )?.nameStr;
  console.log(partnerName);

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
  }, [orderDate]);

  const columns = [
    { field: "index", headerName: "STT", width: 10 },
    { field: "id", headerName: "id", width: 1 },
    {
      field: "partnersID",
      headerName: "Đối tác",
      width: 250,

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
  // const handleButtonClick = (value) => {
  //   setSelectedDataGrid(null);
  //   setSelectedButtonGroup(value);
  // };

  // const handleOpenAdd = (event) => {
  //   event.preventDefault();
  //   setOpenAddDialog(true);
  // };
  // const handleClose = (event) => {
  //   event.preventDefault();
  //   setOpenAddDialog(false);
  // };
  // function FormAddDialog(open) {
  //   return (
  //     <React.Fragment>
  //       <Dialog
  //         open={open.open}
  //         onClose={handleClose}
  //         PaperProps={{
  //           component: "form",
  //           onSubmit: (event) => {
  //             event.preventDefault();
  //             const formData = new FormData(event.currentTarget);
  //             const formJson = Object.fromEntries(formData.entries());
  //             const nameStr = formJson.nameStr;
  //             const classType = formJson.classType;

  //             const addClass = {
  //               nameStr: nameStr,
  //               classType: classType,
  //             };

  //             const postMeasurement = async () => {
  //               try {
  //                 const result = await postData(
  //                   "/product-service/classes",
  //                   addClass
  //                 );
  //                 //        const addClass = {
  //                 //     nameStr: result.nameStr,
  //                 //     classType: result.classType,

  //                 //   };
  //                 const addClass2 = result;

  //                 console.log(addClass2);
  //                 // const updatedMeasurementData = measurementData;
  //                 // updatedMeasurementData.push(addMeasurement2);

  //                 // setMeasurementData(updatedMeasurementData);
  //                 setOrdersData((prevState) => [...prevState, addClass2]);
  //               } catch (err) {
  //                 console.error("Error fetching data:", err);
  //               }
  //             };
  //             postMeasurement();

  //             handleClose(event);
  //             //window.location.reload(false);
  //           },
  //         }}
  //       >
  //         <DialogTitle>Thêm Class</DialogTitle>
  //         <DialogContent>
  //           <TextField
  //             name="nameStr"
  //             variant="outlined"
  //             label="Tên Class"
  //             required
  //             sx={{ margin: 2 }}
  //           />
  //           <TextField
  //             name="classType"
  //             variant="outlined"
  //             label="Loại Class"
  //             required
  //             sx={{ margin: 2 }}
  //           />
  //         </DialogContent>
  //         <DialogActions>
  //           <Button onClick={handleClose}>Cancel</Button>
  //           <Button type="submit">Save</Button>
  //         </DialogActions>
  //       </Dialog>
  //     </React.Fragment>
  //   );
  // }

  //**FormDeleteDialog
  // const handleOpenDelete = (event) => {
  //   setOpenDeleteDialog(true);
  //   // setAddCategory({ isChildOf: selectedSingleNode });
  // };
  // const handleCloseDelete = () => {
  //   setOpenDeleteDialog(false);
  // };
  // function FormDeleteDialog(open) {
  //   return (
  //     <React.Fragment>
  //       <Dialog
  //         open={open.open}
  //         onClose={handleClose}
  //         PaperProps={{
  //           component: "form",
  //           onSubmit: (event) => {
  //             event.preventDefault();
  //             const respone = deleteData(
  //               "/product-service/classes",
  //               selectedDataGrid.id
  //             );
  //             console.log(respone);
  //             const updatedData = ordersData.filter(
  //               (item) => item.id !== selectedDataGrid.id
  //             );
  //             setOrdersData(updatedData);
  //             setSelectedDataGrid(null);
  //             handleCloseDelete();
  //             alert("Xóa thành công");
  //           },
  //         }}
  //       >
  //         <DialogTitle>Xóa {selectedDataGrid.nameStr}</DialogTitle>
  //         <DialogContent>Bạn chắc chắn muốn xóa thư mục này?</DialogContent>
  //         <DialogActions>
  //           <Button onClick={handleCloseDelete}>Cancel</Button>
  //           <Button type="submit">Confirm</Button>
  //         </DialogActions>
  //       </Dialog>
  //     </React.Fragment>
  //   );
  // }

  //**FormFixDialog
  // const handleOpenFix = (event) => {
  //   setOpenFixDialog(true);
  //   // setAddCategory({ isChildOf: selectedSingleNode });
  // };
  // const handleCloseFix = () => {
  //   setOpenFixDialog(false);
  // };
  // function FormFixDialog(open) {
  //   return (
  //     <React.Fragment>
  //       <Dialog
  //         open={open.open}
  //         onClose={handleClose}
  //         PaperProps={{
  //           component: "form",
  //           onSubmit: (event) => {
  //             event.preventDefault();
  //             const respone = putData(
  //               "/product-service/classes",
  //               selectedDataGrid.id,
  //               selectedDataGrid
  //             );
  //             console.log(respone);
  //             const updatedData = ordersData.map((item) => {
  //               if (item.id === selectedDataGrid.id) {
  //                 return selectedDataGrid;
  //               }
  //               return item;
  //             });
  //             setOrdersData(updatedData);
  //             setSelectedDataGrid(null);
  //             handleCloseFix();
  //             alert("Lưu thành công");
  //           },
  //         }}
  //       >
  //         <DialogTitle>
  //           Sửa:{" "}
  //           <span style={{ fontWeight: "bold" }}>
  //             {selectedDataGrid.nameStr}
  //           </span>
  //         </DialogTitle>
  //         <DialogContent>Bạn chắc chắn muốn lưu mục này?</DialogContent>
  //         <DialogActions>
  //           <Button onClick={handleCloseFix}>Cancel</Button>
  //           <Button type="submit">Confirm</Button>
  //         </DialogActions>
  //       </Dialog>
  //     </React.Fragment>
  //   );
  // }

  //tạo 1 func để truyền vào dataGird vì hàm trong dataGird không nhận prop truyền vào
  const NoRowsOverlay = () => {
    return <CustomNoRowsOverlay title="Chưa có đơn hàng ngày hôm nay !!!" />;
  };
  return (
    <Box
      // elevation={6}
      sx={{
        paddingTop: 1,
        paddingLeft: 1,
        // height: "84vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", margin: "8px" }}>
        <DatePicker
          label="Ngày Order"
          value={dayjs(orderDate)}
          onChange={(newValue) => {
            setOrderDate(newValue.format("YYYY-MM-DD"));
          }}
          sx={{ width: "250px" }}
        />

        <Fab
          size="small"
          color="primary"
          aria-label="add"
          //   onClick={handleOpenAdd}
          sx={{ marginY: "8px", marginX: "24px" }}
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
      </div>
      {/* <FormAddDialog open={openAddDialog} /> */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "73vh",
        }}
      >
        <div style={{ height: "50%", width: "310px" }}>
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
          />
        </div>
        <Box
          elevation={1}
          sx={{
            paddingX: 4,

            flexGrow: 3,
          }}
        >
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
        </Box>
      </div>
    </Box>
  );
}
