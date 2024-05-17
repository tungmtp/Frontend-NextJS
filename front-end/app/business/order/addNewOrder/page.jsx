"use client";
import {
  selectCategoryProducts,
  setSelectedCategory,
  setSelectedProduct,
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

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { deleteData, getData, postData, putData } from "@/hook/Hook";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { format } from "date-fns";
import Autocomplete from "@mui/material/Autocomplete";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import OrderDetail from "@/components/orderDetail/OrderDetail";
import SelectNewsky from "@/components/select/SelectNewsky";
const calcType = {
  1: "Cung cấp vật tư",
  2: "Thi công lắp đặt",
};

const getcalcTypeName = (selectedcalcType) => {
  return calcType[selectedcalcType];
};

export default function AddNewOrder(props) {
  const [contactData, setContactData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DD");

  const [selectedOrder, setSelectedOrder] = useState({
    orderType: 0,
    orderDate: currentDate,
    endDate: currentDate,
    comment: "",
    partnersID: "",
    //Phần project chưa làm
    projectID: "",
    contactID: "",
    staffControl: "",
    complete: false,
    createdBy: "",
    createdOn: currentDate,
    calcType: 1,
    lotNo: "",
    projectitemID: "",
    editBy: "",
  });

  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [orderDetail, setOrderDetail] = React.useState([]);
  const style = { marginTop: 2, width: "301px", marginLeft: 5 };
  // console.log(orderDetail);
  console.log("selectedOrder: ", selectedOrder);
  console.log("orderDetail: ", orderDetail);

  // console.log(contactData);

  useEffect(() => {
    const getClassPriceData = async () => {
      try {
        const result = await getData("/product-service/classPrice");

        const result3 = await getData("/business-service/contact");
        const result4 = await getData("/employee-service/employee");
        // const changeFieldName = result.map((item) => {
        //   const classesName = result2.find(
        //     (classes) => classes.id === item.classId
        //   ).nameStr; // Tạo trường label từ trường nameStr
        //   return {
        //     ...item,
        //     label: classesName,
        //   };
        // });
        // setEmployeesData(changeFieldName);

        // Đổi tên trường nameStr thành label để phù hợp dữ liệu đầu vào autocomplete

        const changeFieldName3 = result3.map((item) => {
          return {
            ...item,
            label: item.nameStr, // Tạo trường label từ trường nameStr
          };
        });

        setContactData(changeFieldName3);
        const changeFieldName4 = result4.map((item) => {
          return {
            ...item,
            label: `${item.firstName} ${item.lastName}`, // Tạo trường label từ trường segmentName
          };
        });

        setEmployeeData(changeFieldName4);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getClassPriceData();

    console.log("rendering again");
  }, []);
  console.log(employeeData);
  console.log(
    employeeData.find((employee) => employee.label === "Emily Johnson")
  );
  const getorderDetail = (list) => {
    if (list.length > 0) {
      setOrderDetail(list);
    }
  };
  const handleOpenConfirm = (event) => {
    setOpenConfirm(true);
    // setAddCategory({ isChildOf: selectedSingleNode });
  };
  const handleCloseConfirm = (event) => {
    event.preventDefault();
    setOpenConfirm(false);
  };
  function FormConfirmDialog(open) {
    // const getClassesName = classesData.find(
    //   (classes) => classes.id === selectedOrder.classId
    // );

    return (
      <React.Fragment>
        <Dialog
          open={open.open}
          onClose={handleCloseConfirm}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();

              const posOrder = async () => {
                try {
                  const respone = await postData(
                    "/business-service/orders",
                    selectedOrder
                  );
                  console.log(respone);

                  orderDetail.orderID = respone.id;

                  const postOrderDetail = async () => {
                    try {
                      const result = await postData(
                        "/business-service/orderDetail",
                        orderDetail
                      );
                    } catch (err) {
                      console.error("Error fetching data:", err);
                    }
                  };
                  postOrderDetail();
                  console.log(orderDetail);
                } catch (err) {
                  console.error("Error fetching data:", err);
                }
              };

              posOrder();

              handleCloseConfirm(event);
            },
          }}
        >
          <DialogTitle>
            Thêm đơn hàng{" "}
            <span style={{ fontWeight: "bold" }}>{selectedOrder.nameStr}</span>
          </DialogTitle>
          <DialogContent>Bạn chắc chắn muốn thêm đơn hàng này?</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirm}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }

  return (
    <Paper
      elevation={6}
      sx={{
        width: "100%",
        height: "100%",
        overflow: "auto",
      }}
    >
      <Typography
        sx={{
          fontSize: "18px",
          color: "#1976d2",
          fontWeight: "BOLD",
          margin: "8px",
        }}
      >
        Thêm đơn hàng mới
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          overflow: "auto",
        }}
        // onSubmit={handleOpenConfirm}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <FormControl size="small">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Ngày order"
                value={dayjs(selectedOrder?.orderDate)}
                onChange={(newValue) => {
                  const updatedSelectedOrder = { ...selectedOrder };
                  console.log(newValue);
                  updatedSelectedOrder.orderDate =
                    newValue.format("YYYY-MM-DD");
                  setSelectedOrder(updatedSelectedOrder);
                }}
                sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
              />
            </LocalizationProvider>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Ngày giao hàng lần đầu"
              value={dayjs(selectedOrder?.endDate)}
              onChange={(newValue) => {
                const updatedSelectedOrder = { ...selectedOrder };
                console.log(newValue);
                updatedSelectedOrder.endDate = newValue.format("YYYY-MM-DD");
                setSelectedOrder(updatedSelectedOrder);
              }}
              sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
            />
          </LocalizationProvider>
          <Autocomplete
            size="small"
            disablePortal
            id=""
            options={employeeData}
            sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
            renderInput={(params) => (
              <TextField {...params} label="Nhân viên thực hiện" />
            )}
            value={
              employeeData.length > 0 &&
              employeeData.find(
                (employee) => employee.label === selectedOrder.staffControl
              )
                ? employeeData.find(
                    (employee) => employee.label === selectedOrder.staffControl
                  )
                : null
            }
            onChange={(event, value) => {
              if (value) {
                const updatedSelectedOrder = { ...selectedOrder };
                updatedSelectedOrder.staffControl = value.label;
                setSelectedOrder(updatedSelectedOrder);
              }
            }}
            //   onChange={handleOnChange}
          />
          {/* <Autocomplete
            size="small"
            disablePortal
            id=""
            options={partnerData}
            sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
            renderInput={(params) => <TextField {...params} label="Đối tác" />}
            value={
              partnerData.length > 0 &&
              partnerData.find(
                (partner) => partner.id === selectedOrder.partnersID
              )
                ? partnerData.find(
                    (partner) => partner.id === selectedOrder.partnersID
                  )
                : null
            }
            onChange={(event, value) => {
              if (value) {
                const updatedSelectedOrder = { ...selectedOrder };
                updatedSelectedOrder.partnersID = value.id;
                setSelectedOrder(updatedSelectedOrder);
              }
            }}
            //   onChange={handleOnChange}
          /> */}

          <SelectNewsky
            lblinput="Đối tác"
            emitParent={(id) => {
              const updatedSelectedOrder = { ...selectedOrder };
              updatedSelectedOrder.partnersID = id;
              setSelectedOrder(updatedSelectedOrder);
            }}
            byNameStr="/business-service/partner/byNameStr"
            firstCall="/business-service/partner/firstCall"
            currentItemLink="/business-service/partner/oneForSelect"
            style={style}
          />

          <Autocomplete
            disablePortal
            id=""
            size="small"
            options={["None", ...contactData]}
            sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
            renderInput={(params) => (
              <TextField {...params} label="Người liên hệ" />
            )}
            value={
              contactData.length > 0 &&
              contactData.find(
                (contact) => contact.id === selectedOrder.contactID
              )
                ? contactData.find(
                    (contact) => contact.id === selectedOrder.contactID
                  )
                : null
            }
            onChange={(event, value) => {
              if (value && value != "None") {
                const updatedSelectedOrder = { ...selectedOrder };
                updatedSelectedOrder.contactID = value.id;
                setSelectedOrder(updatedSelectedOrder);
              } else {
                const updatedSelectedOrder = { ...selectedOrder };
                updatedSelectedOrder.contactID = "";
                setSelectedOrder(updatedSelectedOrder);
              }
            }}
            //   onChange={handleOnChange}
          />

          <FormControl
            sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
            size="small"
          >
            <InputLabel id="partner-type-label">Cách tính</InputLabel>
            <Select
              sx={{ width: "300px" }}
              labelId="partner-type-label"
              id="partner-type-select"
              value={selectedOrder?.calcType}
              label="Cách tính"
              onChange={(event) => {
                const updatedSelectedOrder = { ...selectedOrder };
                updatedSelectedOrder.calcType = Number(event.target.value);
                setSelectedOrder(updatedSelectedOrder);
              }}
            >
              {Object.keys(calcType).map((key) => (
                <MenuItem key={key} value={key}>
                  {getcalcTypeName(key)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id=""
            label="Dự án"
            size="small"
            sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
            value={selectedOrder?.comment}
            onChange={(event) => {
              const updatedSelectedOrder = { ...selectedOrder };
              updatedSelectedOrder.comment = event.target.value;
              console.log(event.target.value);
              setSelectedOrder(updatedSelectedOrder);
            }}
          />
          {/* <ProductAttribute
          title={"attName"}
          serviceURL={"/product-service/ProductAttribute"}
          status={"add"}
          getorderDetail={getorderDetail}
        /> */}
        </Box>
        <Box
          sx={{
            marginTop: "50px",
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              color: "Black",
              fontWeight: "BOLD",
              margin: "8px",
              width: "92%",
            }}
          >
            Chi tiết đơn hàng
          </Typography>
          <OrderDetail setOrderDetail={setOrderDetail} />
        </Box>
      </Box>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: 6,
          width: "100%",
          position: "sticky",
          bottom: 0,
          height: "80px",
          background: "rgb(239,239,239,0.8)",
        }}
      >
        <Button
          variant="contained"
          sx={{ margin: 2 }}
          onClick={props.handleCloseAddproduct}
        >
          <Link
            href={"/business/order"}
            style={{ color: "white", textDecoration: "none" }}
          >
            {" "}
            Cancel
          </Link>
        </Button>
        <Button
          type="submit"
          color="warning"
          variant="contained"
          sx={{ margin: 2 }}
          onClick={handleOpenConfirm}
        >
          Save
        </Button>
        <FormConfirmDialog open={openConfirm} />
      </div>
    </Paper>
  );
}
