"use client";

import Paper from "@mui/material/Paper";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { getData, postData } from "@/hook/Hook";
import Autocomplete from "@mui/material/Autocomplete";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import OrderDetail from "@/components/orderDetail/OrderDetail";
import SelectNewsky from "@/components/select/SelectNewsky";
import { useRouter } from "next/navigation";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import "dayjs/locale/en-gb";
const username = Cookies.get("username");
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
    createdBy: username,
    createdOn: currentDate,
    calcType: 1,
    projectitemID: "",
    editBy: "",
  });

  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [orderDetail, setOrderDetail] = React.useState([]);
  const style = { marginTop: 2, width: "301px", marginLeft: 5 };
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  // console.log("selectedOrder: ", selectedOrder);
  // console.log("orderDetail: ", orderDetail);

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
  }, []);

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
                  NotifySnackbar(
                    enqueueSnackbar,
                    "Thêm đơn hàng thành công",
                    "success"
                  );
                  router.push("/business/order");
                } catch (err) {
                  console.error("Error fetching data:", err);
                  NotifySnackbar(
                    enqueueSnackbar,
                    "Lỗi mạng! Vui lòng kiểm tra đường truyền",
                    "error"
                  );
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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography
          sx={{
            fontSize: "18px",
            color: "#1976d2",
            fontWeight: "BOLD",
          }}
        >
          Thêm đơn hàng mới
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <FormControl fullWidth>
          <DatePicker
            label="Ngày order"
            value={dayjs(selectedOrder?.orderDate)}
            onChange={(newValue) => {
              const updatedSelectedOrder = { ...selectedOrder };
              updatedSelectedOrder.orderDate = newValue.format("YYYY-MM-DD");
              setSelectedOrder(updatedSelectedOrder);
            }}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <FormControl fullWidth>
          <DatePicker
            label="Ngày giao hàng lần đầu"
            value={dayjs(selectedOrder?.endDate)}
            onChange={(newValue) => {
              const updatedSelectedOrder = { ...selectedOrder };
              updatedSelectedOrder.endDate = newValue.format("YYYY-MM-DD");
              setSelectedOrder(updatedSelectedOrder);
            }}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Autocomplete
          size="small"
          disablePortal
          id=""
          options={employeeData}
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
      </Grid>
      {/* <Autocomplete
            size="small"
            disablePortal
            id=""
            options={partnerData}
           
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
      <Grid item xs={12} md={6} lg={3}>
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
          // style={style}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Autocomplete
          disablePortal
          id=""
          size="small"
          options={["None", ...contactData]}
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
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <FormControl fullWidth>
          <InputLabel id="partner-type-label">Cách tính</InputLabel>
          <Select
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
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <TextField
          fullWidth
          id=""
          label="Dự án"
          size="small"
          value={selectedOrder?.comment}
          onChange={(event) => {
            const updatedSelectedOrder = { ...selectedOrder };
            updatedSelectedOrder.comment = event.target.value;
            setSelectedOrder(updatedSelectedOrder);
          }}
        />
      </Grid>
      {/* <ProductAttribute
          title={"attName"}
          serviceURL={"/product-service/ProductAttribute"}
          status={"add"}
          getorderDetail={getorderDetail}
          </Grid>
        /> */}

      <Grid item xs={12}>
        <OrderDetail setOrderDetail={setOrderDetail} />
      </Grid>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
          width: "100%",
          position: "sticky",
          bottom: 0,
          height: "80px",
          // background: "rgb(239,239,239,0.8)",
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
    </Grid>
  );
}
