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
import Link from "@mui/material/Link";
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function ClassPrice() {
  const [classPriceData, setClassPriceData] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [measurementData, setMeasurementData] = useState([]);
  const [selectedDataGrid, setSelectedDataGrid] = useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openFixDialog, setOpenFixDialog] = React.useState(false);
  useEffect(() => {
    const getClassPriceData = async () => {
      try {
        const result = await getData("/product-service/classPrice");
        const result2 = await getData("/product-service/classes");
        const result3 = await getData("/product-service/Measurement");

        const resultWithIndex = result.map((row, index) => ({
          ...row,
          index: index + 1,
        }));
        setClassPriceData(resultWithIndex);

        // Đổi tên trường nameStr thành label để phù hợp dữ liệu đầu vào autocomplete
        const changeFieldName = result2.map((item) => {
          return {
            ...item,
            label: item.nameStr, // Tạo trường label từ trường nameStr
          };
        });
        setClassesData(changeFieldName);

        const changeFieldName3 = result3.map((item) => {
          return {
            ...item,
            label: item.measName, // Tạo trường label từ trường measName
          };
        });

        setMeasurementData(changeFieldName3);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getClassPriceData();
    console.log("rendering again");
  }, []);
  console.log(classesData);
  console.log(selectedDataGrid);
  const columns = [
    { field: "index", headerName: "STT", width: 10 },
    { field: "id", headerName: "id", width: 1 },

    {
      field: "classId",
      headerName: "Tên Class",
      width: 260,

      renderCell: (params) => {
        const className = classesData.find(
          (item) => item.id === params.row.classId
        )?.label;

        return (
          <Link
            underline="hover"
            key={params.row.id}
            color="inherit"
            variant="body1"
            onClick={() => {
              setSelectedDataGrid(params.row);
            }}
          >
            {className}
          </Link>
        );
      },
    },
    {
      field: "dateEffected",
      headerName: "Ngày áp dụng",
      width: 140,

      renderCell: (params) => {
        const formattedDate = format(
          new Date(params.row.dateEffected),
          "MM-dd-yyyy"
        );
        return (
          <Link
            underline="hover"
            key={params.row.id}
            color="inherit"
            variant="body1"
            onClick={() => {
              setSelectedDataGrid(params.row);
            }}
          >
            {formattedDate}
          </Link>
        );
      },
    },
    { field: "price", headerName: "Giá thành", width: 100 },

    {
      field: "defaultMeas",
      headerName: "Đơn vị mặc định",
      width: 200,

      renderCell: (params) => {
        const measName = measurementData.find(
          (item) => item.id === params.row.defaultMeas
        )?.label;

        return (
          <Link
            underline="hover"
            key={params.row.id}
            color="inherit"
            variant="body1"
            onClick={() => {
              setSelectedDataGrid(params.row);
            }}
          >
            {measName}
          </Link>
        );
      },
    },
  ];

  const handleOpenAdd = (event) => {
    event.preventDefault();
    setOpenAddDialog(true);
  };
  const handleClose = (event) => {
    event.preventDefault();
    setOpenAddDialog(false);
  };
  function FormAddDialog(open) {
    let selectedClassId = "";
    let selectedDefaultMeas = "";
    let selectedDateEffected = "";
    return (
      <React.Fragment>
        <Dialog
          open={open.open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());

              const dateEffected = selectedDateEffected;
              const classId = selectedClassId;
              const DefaultMeas = selectedDefaultMeas;
              const price = formJson.price;

              const addClassPrice = {
                classId: classId,
                defaultMeas: DefaultMeas,
                dateEffected: dateEffected,
                price: Number(price),
              };
              console.log(addClassPrice);

              const postMeasurement = async () => {
                try {
                  const result = await postData(
                    "/product-service/classPrice",
                    addClassPrice
                  );
                  const addClassPrice2 = result;
                  setClassPriceData((prevState) => [
                    ...prevState,
                    addClassPrice2,
                  ]);
                } catch (err) {
                  console.error("Error fetching data:", err);
                }
              };
              postMeasurement();

              handleClose(event);
            },
          }}
        >
          <DialogTitle>Thêm giá hạch toán</DialogTitle>
          <DialogContent>
            <Autocomplete
              disablePortal
              name="classId"
              options={classesData}
              sx={{ margin: 2 }}
              renderInput={(params) => (
                <TextField {...params} label="Tên Class" />
              )}
              onChange={(event, value) => {
                selectedClassId = value.id;
              }}
              //   onChange={handleOnChange}
            />
            <Autocomplete
              disablePortal
              name="defaultMeas"
              options={measurementData}
              sx={{ margin: 2 }}
              renderInput={(params) => (
                <TextField {...params} label="Đơn vị mặc định" />
              )}
              onChange={(event, value) => {
                selectedDefaultMeas = value.id;
              }}
            />

            <DatePicker
              name="dateEffected"
              label="Ngày áp dụng"
              sx={{ margin: 2 }}
              onChange={(newValue) => {
                selectedDateEffected = newValue.format(
                  "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
                );
              }}
            />

            <TextField
              name="price"
              variant="outlined"
              label="Giá thành"
              sx={{ margin: 2, marginBottom: 22 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
  const handleOpenDelete = (event) => {
    setOpenDeleteDialog(true);
    // setAddCategory({ isChildOf: selectedSingleNode });
  };
  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
  };
  function FormDeleteDialog(open) {
    const getClassesName = classesData.find(
      (classes) => classes.id === selectedDataGrid.classId
    );
    return (
      <React.Fragment>
        <Dialog
          open={open.open}
          onClose={handleCloseDelete}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const respone = deleteData(
                "/product-service/classPrice",
                selectedDataGrid.id
              );
              console.log(respone);
              const updatedData = classPriceData.filter(
                (item) => item.id !== selectedDataGrid.id
              );
              setClassPriceData(updatedData);
              setSelectedDataGrid(null);
              handleCloseDelete();
              alert("Xóa thành công");
            },
          }}
        >
          <DialogTitle>Xóa {getClassesName?.nameStr}</DialogTitle>
          <DialogContent>Bạn chắc chắn muốn xóa thư mục này?</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
  const handleOpenFix = (event) => {
    setOpenFixDialog(true);
    // setAddCategory({ isChildOf: selectedSingleNode });
  };
  const handleCloseFix = (event) => {
    event.preventDefault();
    setOpenFixDialog(false);
  };
  function FormFixDialog(open) {
    const getClassesName = classesData.find(
      (classes) => classes.id === selectedDataGrid.classId
    );

    return (
      <React.Fragment>
        <Dialog
          open={open.open}
          onClose={handleCloseFix}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const respone = putData(
                "/product-service/classPrice",
                selectedDataGrid.id,
                selectedDataGrid
              );
              console.log(respone);
              const updatedData = classPriceData.map((item) => {
                if (item.id === selectedDataGrid.id) {
                  return selectedDataGrid;
                }
                return item;
              });
              setClassPriceData(updatedData);

              handleCloseFix(event);
              alert("Lưu thành công");
            },
          }}
        >
          <DialogTitle>
            Sửa:{" "}
            <span style={{ fontWeight: "bold" }}>
              {getClassesName?.nameStr}
            </span>
          </DialogTitle>
          <DialogContent>Bạn chắc chắn muốn lưu mục này?</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFix}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
  return (
    <Paper elevation={6} sx={{ paddingTop: 1, paddingLeft: 1, height: "84vh" }}>
      <Button
        size="small"
        color="primary"
        aria-label="add"
        onClick={handleOpenAdd}
        variant="contained"
        sx={{ marginY: "8px" }}
      >
        <AddIcon /> Add New
      </Button>
      <FormAddDialog open={openAddDialog} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div style={{ height: "73vh", flexGrow: 2 }}>
          <DataGrid
            rows={classPriceData}
            columns={columns}
            pageSize={1}
            slots={{
              toolbar: GridToolbar,
            }}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false,
                },
              },
            }}
          />
        </div>
        <Box
          elevation={1}
          sx={{
            paddingX: 4,
            py: 2,
            flexGrow: 3,
          }}
        >
          {selectedDataGrid ? (
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                paddingY: "8px",
                maxWidth: "447px",
                flexGrow: 1,
              }}
            >
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={classesData}
                sx={{ marginTop: 4, marginX: 5 }}
                renderInput={(params) => (
                  <TextField {...params} label="Tên Class" />
                )}
                value={classesData.find(
                  (classes) => classes.id === selectedDataGrid.classId
                )}
                onChange={(event, value) => {
                  if (value) {
                    const updatedSelectedDataGrid = { ...selectedDataGrid };
                    updatedSelectedDataGrid.classId = value.id;
                    console.log(value);
                    setSelectedDataGrid(updatedSelectedDataGrid);
                  }
                }}
                //   onChange={handleOnChange}
              />

              <DatePicker
                label="Ngày áp dụng"
                value={dayjs(selectedDataGrid?.dateEffected)}
                onChange={(newValue) => {
                  const updatedSelectedDataGrid = { ...selectedDataGrid };
                  console.log(newValue);
                  updatedSelectedDataGrid.dateEffected = newValue.format(
                    "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
                  );
                  setSelectedDataGrid(updatedSelectedDataGrid);
                }}
                sx={{ marginTop: 2, marginX: 5 }}
              />

              <TextField
                id="price"
                variant="outlined"
                label="Giá thành"
                type="number"
                sx={{ marginTop: 2, marginX: 5 }}
                value={selectedDataGrid?.price}
                onChange={(event) => {
                  const updatedSelectedDataGrid = { ...selectedDataGrid };
                  updatedSelectedDataGrid.price = Number(event.target.value);

                  setSelectedDataGrid(updatedSelectedDataGrid);
                }}
              />
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={measurementData}
                sx={{ marginY: 2, marginX: 5 }}
                renderInput={(params) => (
                  <TextField {...params} label="Đơn vị mặc định" />
                )}
                value={measurementData.find(
                  (measurement) =>
                    measurement.id === selectedDataGrid?.defaultMeas
                )}
                onChange={(event, value) => {
                  if (value) {
                    const updatedSelectedDataGrid = { ...selectedDataGrid };
                    updatedSelectedDataGrid.defaultMeas = value?.id;
                    console.log(value);
                    setSelectedDataGrid(updatedSelectedDataGrid);
                  }
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingBottom: 6,
                }}
              >
                <Button
                  variant="contained"
                  sx={{ marginX: 2 }}
                  onClick={() => {
                    setSelectedDataGrid(null);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleOpenFix}>
                  Save
                </Button>
                <FormFixDialog open={openFixDialog} />
                <Button
                  color="error"
                  variant="contained"
                  sx={{ marginX: 2 }}
                  onClick={handleOpenDelete}
                >
                  Delete
                </Button>
                <FormDeleteDialog open={openDeleteDialog} />
              </div>
            </Paper>
          ) : (
            <div style={{ flexGrow: 2 }}></div>
          )}
        </Box>
      </div>
    </Paper>
  );
}
