"use client";
import React, { useEffect, useState } from "react";
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
import { format, set } from "date-fns";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { DatePicker } from "@mui/x-date-pickers";
import { useRouter, useSearchParams } from "next/navigation";
import { asyncFetch, getData, postData } from "@/hook/Hook";
import Cookies from "js-cookie";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
import { purpose, warehouseID } from "@/components/selectOptions";
import PhysicalStock from "@/components/physicalStock/PhysicalStock";
import OrderDeliveryList from "./OrderDeliveryList";
const username = Cookies.get("username");
// const purpose = {
//   1: "Bán hàng",
//   2: "Bảo hành",
//   3: "Cấp mẫu miễn phí",
//   4: "Trả lại nhà cung cấp",
//   5: "Xuất chuyển kho",
// };
// const warehouseID = {
//   1: "Kho văn phòng",
//   2: "Kho Nhà máy Việt Á",
//   3: "Kho Sài gòn",
//   10: "Kho CPC",
// };
const measureCategory = {
  1: "m2",
  2: "md",
  3: "kg",
  4: "",
  5: "Lít",
};
const getPurposeName = (selectedPurpose) => {
  return purpose[selectedPurpose];
};
const getWarehouseIDName = (selectedWarehouseID) => {
  return warehouseID[selectedWarehouseID];
};
const AddOrderDelivery = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  let orderID = searchParams.get("id");
  let orderName = searchParams.get("name");
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DD");
  const [scheduleDate, setScheduleDate] = React.useState(currentDate);
  const [onClick, setOnClick] = React.useState(false);
  const [showList, setShowList] = React.useState(false);
  const [orderDelivery, setOrderDelivery] = React.useState({
    orderID: orderID,
    deliveryDate: currentDate,
    deliveryAddress: "",
    warehouseID: 2,
    createdBy: username,
    cancel: false,
    completed: false,
    purpose: 1,
    paymentDate: currentDate,
  });
  const [reqDate, setReqDate] = useState(currentDate);
  const [listDate, setListDate] = useState([]);
  useEffect(() => {
    if (orderID) {
      asyncFetch(
        "GET",
        `/produce-service/ordersProduce/orderRequestDistinctDate/${orderID}`
      )
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          setListDate(data);
        })
        .catch((err) => console.error(err));
    }
  }, [orderID]);

  //   console.log(dayjs(rows[0].ngayGiao).format("YYYY-MM-DD"));
  // console.log("orderDelivery:  ", orderDelivery);
  // console.log("Delivery Detail:  ", rows);
  // console.log("listDate:  ", listDate);
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const calculateQualityRate = (itemQuanlity, rateInRoot) => {
    if (rateInRoot == 0) {
      return itemQuanlity.toFixed(2);
    } else {
      return (rateInRoot * itemQuanlity).toFixed(2);
    }
  };
  // React.useEffect(() => {
  //   const getOrderDetailsBySchedule = async () => {
  //     try {
  //       const result = await getData(
  //         `/business-service/orderDetail/BySchedule/${scheduleDate}/${orderID}`
  //       );

  //       const resultWithIndex = result?.map((item, index) => {
  //         return {
  //           orderDeliveryID: "",
  //           orderDetailID: item.Id,
  //           orderProduceID: item.scheduleID,
  //           productID: item.productID,
  //           id: item.scheduleID,
  //           quality: item.quality,
  //           quantity: item.scheduleQty,
  //           measID: item.measID,
  //           price: item.price,
  //           vat: 0,
  //           index: index + 1,
  //           nameStr: item.productName,
  //           measName: item.MeasName,
  //           measCatId: item.MeasCatId,
  //           rateInRoot: item.RateInRoot,
  //           scheduleDate: item.scheduleDate,
  //         };
  //       });
  //       console.log("Mới nè", resultWithIndex);
  //       setRows(resultWithIndex);
  //       setOnClick(false);
  //     } catch (err) {
  //       console.error("Error fetching data:", err);
  //     }
  //   };
  //   getOrderDetailsBySchedule();
  // }, [scheduleDate]);

  const getOrderDetailsBySchedule = async () => {
    try {
      const result = await getData(
        `/business-service/orderDetail/BySchedule/${reqDate}/${orderID}`
      );
      // console.log("result: ", result);
      if (result) {
        const resultWithIndex = result?.map((item, index) => {
          return {
            orderDeliveryID: "",
            orderDetailID: item.Id,
            orderProduceID: item.scheduleID,
            productID: item.productID,
            id: item.scheduleID,
            quality: item.quality,
            quantity: item.scheduleQty - item.SumOfDelivery,
            measID: item.measID,
            price: item.price,
            vat: 0,
            index: index + 1,
            nameStr: item.productName,
            measName: item.MeasName,
            measCatId: item.MeasCatId,
            rateInRoot: item.RateInRoot,
            scheduleDate: item.scheduleDate,
            quantityLeft: item.scheduleQty - item.SumOfDelivery,
          };
        });
        // console.log("Mới nè", resultWithIndex);
        setRows(resultWithIndex);
        let checkQuantity = false;
        resultWithIndex.map((item) => {
          if (item.quantityLeft > 0) {
            checkQuantity = true;
          }
        });

        if (checkQuantity === true) {
          setOnClick(true);
        } else {
          NotifySnackbar(
            enqueueSnackbar,
            `Đơn hàng đã xuất đủ lượng hàng!!`,
            "info"
          );
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // React.useEffect(() => {
  //   const getOrderDetailData = async () => {
  //     try {
  //       const result = await getData(
  //         `/business-service/orderDetail/byOrderID/${orderID}`
  //       );

  //       // Map through the results and fetch product names
  //       const resultWithIndex = await Promise.all(
  //         result.map(async (row, index) => {
  //           try {
  //             const productResult = await getData(
  //               `/product-service/product/oneForSelect/mayBeSell/${row.productID}`
  //             );
  //             return {
  //               orderDeliveryID: "",
  //               orderDetailID: row.id,
  //               productID: row.productID,
  //               id: row.id,
  //               quality: row.quality,
  //               quantity: row.quantity,
  //               measID: row.measID,
  //               price: row.price,
  //               vat: 0,
  //               index: index + 1,
  //               nameStr: productResult[0].nameStr,
  //               measName: productResult[0].measName,
  //               measCatId: productResult[0].measCatId,
  //               rateInRoot: productResult[0].rateInRoot,
  //             };
  //           } catch (err) {
  //             console.error("Error fetching product data:", err);
  //             return {
  //               orderDeliveryID: "",
  //               orderDetailID: row.id,
  //               productID: row.productID,
  //               id: row.id,
  //               quality: row.quality,
  //               quantity: row.quantity,
  //               measID: row.measID,
  //               price: row.price,
  //               vat: row.vat,
  //               index: index + 1,
  //               nameStr: "Unknown Product",
  //             };
  //           }
  //         })
  //       );

  //       setRows(resultWithIndex);
  //     } catch (err) {
  //       console.error("Error fetching order detail data:", err);
  //     }
  //   };

  //   getOrderDetailData();
  // }, []);

  const columns = [
    { field: "index", headerName: "STT", flex: 1 },
    { field: "nameStr", headerName: "Sản phẩm", flex: 8 },
    {
      field: "measName",
      headerName: "ĐVT/CL",
      flex: 4,
      renderCell: (param) => {
        return (
          <Box>
            {" "}
            {param.row.measName} <br></br> Loại {param.row.quality}{" "}
          </Box>
        );
      },
    },
    {
      field: "quantity",
      headerName: "SL xuất",
      type: "number",
      flex: 2,
      editable: true,
    },
    {
      field: "quantityLeft",
      headerName: "Số cần giao",
      type: "number",
      flex: 3,
    },
    // {
    //   field: "tonKho",
    //   headerName: "Tồn kho",
    //   type: "number",
    //   flex: 2,
    //   renderCell: (param) => {
    //     return (
    //       <PhysicalStock
    //         productID={param.row.productID}
    //         measID={param.row.measID}
    //         date={currentDate}
    //       />
    //     );
    //   },
    // },
    {
      field: "rateInRoot",
      headerName: "SL quy đổi",
      type: "number",
      flex: 3,
      valueGetter: (value, row) => {
        if (value.row.measCatId === 4) {
          return `${calculateQualityRate(
            value.row.quantity,
            value.row.rateInRoot
          )} ${value.row.measName}`;
        } else {
          return `${calculateQualityRate(
            value.row.quantity,
            value.row.rateInRoot
          )} ${measureCategory[value.row.measCatId]}`;
        }
      },
    },
    {
      field: "vat",
      headerName: "VAT",
      flex: 3,
      type: "number",
      editable: true,
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };
  // const handleSaveClick = (id) => () => {
  //   const rowToSave = rows.find((row) => row.id === id);

  //   // if (rowToSave.quantity > 15) {
  //   //   alert("Quantity cannot bee greater than stock.");
  //   //   return;
  //   // }
  //   setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  // };
  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  // const processRowUpdate = (newRow) => {
  //   const updatedRow = { ...newRow, isNew: false };
  //   setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
  //   return updatedRow;
  // };

  /** Check không cho vượt số lượng còn lại phải giao  */
  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };

    if (newRow.quantity <= 0) {
      NotifySnackbar(enqueueSnackbar, "SL xuất phải lớn hơn 0!!!", "error");
      throw new Error("Quantity cannot be less than 0.");
    }
    if (newRow.quantity > newRow.quantityLeft) {
      NotifySnackbar(
        enqueueSnackbar,
        "SL xuất đã vượt quá số lượng cần giao!!!",
        "error"
      );
      throw new Error("Quantity cannot be greater than stock.");
    }

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const isAnyRowInEditMode = Object.values(rowModesModel).some(
    (row) => row.mode === GridRowModes.Edit
  );

  const handleRowClick = (reqDate) => {
    setShowList(true);
    setOnClick(false);
    setReqDate(reqDate);
    asyncFetch(
      "GET",
      `/business-service/orderDeliverySql/getDeliveryByReqDateOfOrder/${orderID}/${reqDate}`
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
      })
      .catch((err) => console.error(err));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const deliveryAddress = formJson.deliveryAddress;
    let checkQuantity = false;
    rows.map((row) => {
      if (row.quantity <= 0) {
        checkQuantity = true;
      }
    });
    if (isAnyRowInEditMode) {
      NotifySnackbar(
        enqueueSnackbar,
        "Vui lòng lưu lại các trường trong bảng!!",
        "warning"
      );
    } else if (checkQuantity) {
      NotifySnackbar(
        enqueueSnackbar,
        "Số lượng xuất phải lớn hơn 0!!!",
        "error"
      );
    } else {
      //update the deliveryAddress because using onchane and setUsestate is too slow
      const updatedOrderDelivery = { ...orderDelivery };
      updatedOrderDelivery.deliveryAddress = deliveryAddress;
      // console.log(updatedOrderDelivery);
      const postOrderDelivery = async () => {
        try {
          const result = await postData(
            "/business-service/orderDelivery",
            updatedOrderDelivery
          );
          // console.log(result.id);
          rows.map((row) => {
            delete row.nameStr;
            delete row.id;
            delete row.index;
            delete row.measName;
            row.orderDeliveryID = result.id;
            const result2 = postData(
              "/business-service/orderDeliveryDetail",
              row
            );
          });
          NotifySnackbar(enqueueSnackbar, "Thêm thành công", "success");
          // router.push("/business/order");
          setOnClick(false);
        } catch (err) {
          console.error("Error post ordersProduce :", err);
          NotifySnackbar(enqueueSnackbar, "Có lỗi xảy ra!!", "error");
        }
      };
      postOrderDelivery();
    }
  };
  return (
    <Grid container justifyContent="center" spacing={{ xs: 2, md: 3 }}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Yêu cầu giao hàng cho{" "}
          <span style={{ color: "#1976d2", fontWeight: "bold" }}>
            {orderName}
          </span>{" "}
          đơn hàng số:{" "}
          <span style={{ color: "#1976d2", fontWeight: "bold" }}>
            {orderID}
          </span>
        </Typography>
      </Grid>
      <Grid item xs={12} md={3}>
        <Grid container justifyContent="center">
          {/* <Grid item xs={12}>
            <DatePicker
              sx={{ width: "100%" }}
              label="Ngày dự kiến giao"
              value={dayjs(scheduleDate)}
              onChange={(newValue) => {
                const newScheduleDate = newValue.format("YYYY-MM-DD");
                setScheduleDate(newScheduleDate);
              }}
            />
          </Grid> */}
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">STT</TableCell>
                    <TableCell align="left">Đơn cung ứng ngày</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listDate &&
                    listDate.map((row, index) => (
                      <TableRow
                        hover={!row.status}
                        key={index}
                        sx={
                          row.status
                            ? { backgroundColor: "#c0c0c0" }
                            : {
                                cursor: "pointer",
                              }
                        }
                        onClick={() => handleRowClick(row.ReqDate)}
                      >
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="left">
                          {dayjs(row.ReqDate).format("DD/MM/YYYY")}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>

      {onClick ? (
        <Grid item xs={12} md={9}>
          <Grid
            container
            justifyContent="center"
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 1, sm: 8, md: 12 }}
            component={"form"}
            onSubmit={handleSubmit}
          >
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Lịch giao hàng theo đơn cung ứng ngày{" "}
                {dayjs(reqDate).format("DD/MM/YYYY")}
              </Typography>
            </Grid>
            <Grid item xs={1} sm={4} md={3}>
              <DatePicker
                sx={{ width: "100%" }}
                label="Ngày giao"
                value={dayjs(orderDelivery?.deliveryDate)}
                onChange={(newValue) => {
                  const updatedOrderDelivery = { ...orderDelivery };
                  updatedOrderDelivery.deliveryDate =
                    newValue.format("YYYY-MM-DD");
                  setOrderDelivery(updatedOrderDelivery);
                }}
              />
            </Grid>
            <Grid item xs={1} sm={4} md={3}>
              <DatePicker
                sx={{ width: "100%" }}
                label="Ngày hứa thanh toán"
                value={dayjs(orderDelivery?.paymentDate)}
                onChange={(newValue) => {
                  const updatedOrderDelivery = { ...orderDelivery };
                  updatedOrderDelivery.paymentDate =
                    newValue.format("YYYY-MM-DD");
                  setOrderDelivery(updatedOrderDelivery);
                }}
              />
            </Grid>
            <Grid item xs={1} sm={4} md={3}>
              <FormControl sx={{ width: "100%" }} size="small">
                <InputLabel id="partner-type-label">Mục đích giao</InputLabel>
                <Select
                  sx={{ width: "100%" }}
                  labelId="partner-type-label"
                  id="partner-type-select"
                  value={orderDelivery?.purpose}
                  label="Mục đích giao"
                  onChange={(event) => {
                    const updatedOrderDelivery = { ...orderDelivery };
                    updatedOrderDelivery.purpose = Number(event.target.value);
                    setOrderDelivery(updatedOrderDelivery);
                  }}
                >
                  {Object.keys(purpose).map((key) => (
                    <MenuItem key={key} value={key}>
                      {getPurposeName(key)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={1} sm={4} md={3}>
              <FormControl sx={{ width: "100%" }} size="small">
                <InputLabel id="partner-type-label">Xuất từ kho</InputLabel>
                <Select
                  sx={{ width: "100%" }}
                  labelId="partner-type-label"
                  id="partner-type-select"
                  value={orderDelivery?.warehouseID}
                  label="Xuất từ kho"
                  onChange={(event) => {
                    const updatedOrderDelivery = { ...orderDelivery };
                    updatedOrderDelivery.warehouseID = Number(
                      event.target.value
                    );
                    setOrderDelivery(updatedOrderDelivery);
                  }}
                >
                  {Object.keys(warehouseID).map((key) => (
                    <MenuItem key={key} value={key}>
                      {getWarehouseIDName(key)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={1} sm={8} md={12}>
              <TextField
                multiline
                name="deliveryAddress"
                variant="outlined"
                label="Địa chỉ gia hàng"
                sx={{ width: "100%" }}
                // value={orderDelivery?.deliveryAddress}
                // onChange={(event) => {
                //   const updatedOrderDelivery = { ...orderDelivery };
                //   updatedOrderDelivery.deliveryAddress = event.target.value;
                //   setOrderDelivery(updatedOrderDelivery);
                // }}
              />
            </Grid>
            <Grid item xs={1} sm={7} md={11.5}>
              <DataGrid
                sx={{
                  "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
                    py: "4px",
                  },
                  "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
                    py: "8px",
                  },
                  "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
                    py: "11px",
                  },
                }}
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                getRowHeight={() => "auto"}
                autoHeight
                // slots={{
                //   toolbar: EditToolbar,
                // }}
                slotProps={{
                  toolbar: { setRows, setRowModesModel },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box mt={2} display="flex" justifyContent="flex-start">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mr: 2 }}
                  type="submit"
                >
                  Save
                </Button>
                <Link href="">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setOnClick(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      ) : showList ? (
        <Grid item xs={12} md={9}>
          <OrderDeliveryList reqDate={reqDate} orderID={orderID} />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={getOrderDetailsBySchedule}
          >
            Add new
          </Button>
        </Grid>
      ) : (
        <Grid item xs={12} md={9}>
          {" "}
        </Grid>
      )}
    </Grid>
  );
};

export default AddOrderDelivery;
