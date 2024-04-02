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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function Segment() {
  const [segmentData, setSegmentData] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [measurementData, setMeasurementData] = useState([]);
  const [selectedDataGrid, setSelectedDataGrid] = useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openFixDialog, setOpenFixDialog] = React.useState(false);

  useEffect(() => {
    const getSegmentData = async () => {
      try {
        const result = await getData("/produce-service/segment");
        const resultWithIndex = result.map((row, index) => ({
          ...row,
          index: index + 1,
        }));
        setSegmentData(resultWithIndex);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getSegmentData();
    console.log("rendering again");
  }, []);

  console.log(selectedDataGrid);
  const columns = [
    { field: "index", headerName: "STT", width: 10 },
    { field: "id", headerName: "id", width: 1 },

    {
      field: "segmentName",
      headerName: "Tên công đoạn",
      width: 300,

      renderCell: (params) => {
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
            {params.row.segmentName}
          </Link>
        );
      },
    },
    {
      field: "productGroup",
      headerName: "Nhóm",
      width: 180,
    },
    { field: "orderLevel", headerName: "Thứ tự", width: 100 },
    { field: "subCATID", headerName: "Máy sử dụng", width: 100 },
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
              const segmentName = formJson.segmentName;
              const productGroup = formJson.productGroup;
              const orderLevel = formJson.orderLevel;
              const subCATID = "";

              const addData = {
                segmentName: segmentName,
                productGroup: productGroup,
                orderLevel: orderLevel,
                subCATID: subCATID,
              };
              console.log(addData);

              const postSegment = async () => {
                try {
                  const result = await postData(
                    "/produce-service/segment",
                    addData
                  );
                  const addData2 = result;
                  setSegmentData((prevState) => [...prevState, addData2]);
                } catch (err) {
                  console.error("Error fetching data:", err);
                }
              };
              postSegment();

              alert("Thêm thành công !!!");
              handleClose(event);
            },
          }}
        >
          <DialogTitle>Thêm công đoạn</DialogTitle>
          <DialogContent>
            <TextField
              name="segmentName"
              variant="outlined"
              label="Tên công đoạn"
              sx={{ margin: 2, width: "86%" }}
            />
            <TextField
              name="productGroup"
              variant="outlined"
              label="Nhóm"
              sx={{ margin: 2 }}
            />
            <TextField
              name="orderLevel"
              variant="outlined"
              label="Thứ tự"
              sx={{ margin: 2 }}
            />
            <TextField
              name="subCATID"
              variant="outlined"
              label="Máy sử dụng"
              sx={{ margin: 2, width: "86%" }}
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
                "/produce-service/segment",
                selectedDataGrid.id
              );
              console.log(respone);
              const updatedData = segmentData.filter(
                (item) => item.id !== selectedDataGrid.id
              );
              setSegmentData(updatedData);
              setSelectedDataGrid(null);
              handleCloseDelete();
              alert("Xóa thành công");
            },
          }}
        >
          <DialogTitle>
            Xóa:{" "}
            <span style={{ fontWeight: "bold" }}>
              {" "}
              {selectedDataGrid.segmentName}
            </span>
          </DialogTitle>
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
                "/produce-service/segment",
                selectedDataGrid.id,
                selectedDataGrid
              );
              console.log(respone);
              const updatedData = segmentData.map((item) => {
                if (item.id === selectedDataGrid.id) {
                  return selectedDataGrid;
                }
                return item;
              });
              setSegmentData(updatedData);

              handleCloseFix(event);
              alert("Lưu thành công");
            },
          }}
        >
          <DialogTitle>
            Sửa:{" "}
            <span style={{ fontWeight: "bold" }}>
              {selectedDataGrid.segmentName}
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
            rows={segmentData}
            columns={columns}
            pageSize={1}
            disableRowSelectionOnClick
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
              <TextField
                id="segmentName"
                variant="outlined"
                label="Tên công đoạn"
                sx={{ marginTop: 2, marginX: 5 }}
                value={selectedDataGrid?.segmentName}
                onChange={(event) => {
                  const updatedSelectedDataGrid = { ...selectedDataGrid };
                  updatedSelectedDataGrid.segmentName = event.target.value;
                  setSelectedDataGrid(updatedSelectedDataGrid);
                }}
              />
              <TextField
                id="productGroup"
                variant="outlined"
                label="Nhóm"
                sx={{ marginTop: 2, marginX: 5 }}
                value={selectedDataGrid?.productGroup}
                onChange={(event) => {
                  const updatedSelectedDataGrid = { ...selectedDataGrid };
                  updatedSelectedDataGrid.productGroup = event.target.value;
                  setSelectedDataGrid(updatedSelectedDataGrid);
                }}
              />
              <TextField
                id="orderLevel"
                variant="outlined"
                label="Thứ tự"
                type="number"
                sx={{ marginTop: 2, marginX: 5 }}
                value={selectedDataGrid?.orderLevel}
                onChange={(event) => {
                  const updatedSelectedDataGrid = { ...selectedDataGrid };
                  updatedSelectedDataGrid.orderLevel = Number(
                    event.target.value
                  );
                  setSelectedDataGrid(updatedSelectedDataGrid);
                }}
              />
              <TextField
                disabled
                id="subCATID"
                variant="outlined"
                label="Máy sử dụng"
                sx={{ marginY: 2, marginX: 5 }}
                value=""
                onChange={(event) => {
                  const updatedSelectedDataGrid = { ...selectedDataGrid };
                  updatedSelectedDataGrid.subCATID = event.target.value;
                  setSelectedDataGrid(updatedSelectedDataGrid);
                }}
              />
              {/* <Autocomplete
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
              /> */}

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
