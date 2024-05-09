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
import SelectProduct from "@/components/select/SelectProduct";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import OrderDetail from "@/components/orderDetail/OrderDetail";
const calcType = {
  1: "Cung cấp vật tư",
  2: "Thi công lắp đặt",
};

const getcalcTypeName = (selectedcalcType) => {
  return calcType[selectedcalcType];
};

export default function AddNewOrder(props) {
  const [employeesData, setEmployeesData] = useState([]);
  const [partnerData, setPartnerData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

  const [selectedDataGrid, setSelectedDataGrid] = useState({
    orderType: 0,
    orderDate: currentDate,
    endDate: currentDate,
    comment: "",
    partnersID: "",
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
  const [productRelationList, setProductRelationList] = React.useState([]);

  // console.log(productRelationList);
  console.log(selectedDataGrid);
  // console.log(contactData);

  useEffect(() => {
    const getClassPriceData = async () => {
      try {
        const result = await getData("/product-service/classPrice");
        const result2 = await getData("/business-service/partner");
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
        const changeFieldName2 = result2.map((item) => {
          return {
            ...item,
            label: item.nameStr, // Tạo trường label từ trường nameStr
          };
        });

        setPartnerData(changeFieldName2);

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
            label: `${item.firstName} ${item.lastName} `, // Tạo trường label từ trường segmentName
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

  const getProductRelationList = (list) => {
    if (list.length > 0) {
      setProductRelationList(list);
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
    //   (classes) => classes.id === selectedDataGrid.classId
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

              const postProduct = async () => {
                try {
                  const respone = await postData(
                    "/product-service/product",
                    selectedDataGrid
                  );
                  console.log(respone);
                  productRelationList.map((productRelation) => {
                    productRelation.productId = respone.id;
                    delete productRelation.id;
                    const postAttribute = async () => {
                      try {
                        const result = await postData(
                          "/product-service/productRelation",
                          productRelation
                        );
                      } catch (err) {
                        console.error("Error fetching data:", err);
                      }
                    };
                    postAttribute();
                    console.log(productRelation);
                  });
                } catch (err) {
                  console.error("Error fetching data:", err);
                }
              };

              postProduct();

              handleCloseConfirm(event);
              alert("Thêm thành công");
              props.handleCloseAddproduct();
            },
          }}
        >
          <DialogTitle>
            Thêm:{" "}
            <span style={{ fontWeight: "bold" }}>
              {selectedDataGrid.nameStr}
            </span>
          </DialogTitle>
          <DialogContent>Bạn chắc chắn muốn thêm sản phẩm này?</DialogContent>
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
                value={dayjs(selectedDataGrid?.orderDate)}
                onChange={(newValue) => {
                  const updatedSelectedDataGrid = { ...selectedDataGrid };
                  console.log(newValue);
                  updatedSelectedDataGrid.orderDate = newValue.format(
                    "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
                  );
                  setSelectedDataGrid(updatedSelectedDataGrid);
                }}
                sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
              />
            </LocalizationProvider>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Ngày giao hàng lần đầu"
              value={dayjs(selectedDataGrid?.endDate)}
              onChange={(newValue) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                console.log(newValue);
                updatedSelectedDataGrid.endDate = newValue.format(
                  "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
                );
                setSelectedDataGrid(updatedSelectedDataGrid);
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
                (employee) => employee.id === selectedDataGrid.staffControl
              )
                ? employeeData.find(
                    (employee) => employee.id === selectedDataGrid.staffControl
                  )
                : null
            }
            onChange={(event, value) => {
              if (value) {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.staffControl = value.id;
                setSelectedDataGrid(updatedSelectedDataGrid);
              }
            }}
            //   onChange={handleOnChange}
          />
          <Autocomplete
            size="small"
            disablePortal
            id=""
            options={partnerData}
            sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
            renderInput={(params) => <TextField {...params} label="Đối tác" />}
            value={
              partnerData.length > 0 &&
              partnerData.find(
                (partner) => partner.id === selectedDataGrid.partnersID
              )
                ? partnerData.find(
                    (partner) => partner.id === selectedDataGrid.partnersID
                  )
                : null
            }
            onChange={(event, value) => {
              if (value) {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.partnersID = value.id;
                setSelectedDataGrid(updatedSelectedDataGrid);
              }
            }}
            //   onChange={handleOnChange}
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
                (contact) => contact.id === selectedDataGrid.contactID
              )
                ? contactData.find(
                    (contact) => contact.id === selectedDataGrid.contactID
                  )
                : null
            }
            onChange={(event, value) => {
              if (value && value != "None") {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.contactID = value.id;
                setSelectedDataGrid(updatedSelectedDataGrid);
              } else {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.contactID = "";
                setSelectedDataGrid(updatedSelectedDataGrid);
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
              value={selectedDataGrid?.calcType}
              label="Cách tính"
              onChange={(event) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.calcType = Number(event.target.value);
                setSelectedDataGrid(updatedSelectedDataGrid);
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
            value={selectedDataGrid?.comment}
            onChange={(event) => {
              const updatedSelectedDataGrid = { ...selectedDataGrid };
              updatedSelectedDataGrid.comment = event.target.value;
              console.log(event.target.value);
              setSelectedDataGrid(updatedSelectedDataGrid);
            }}
          />
          {/* <ProductAttribute
          title={"attName"}
          serviceURL={"/product-service/ProductAttribute"}
          status={"add"}
          getProductRelationList={getProductRelationList}
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
          <OrderDetail />
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
