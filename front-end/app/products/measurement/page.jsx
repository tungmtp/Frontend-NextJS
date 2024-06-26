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
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
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

export default function Measurement() {
  const { enqueueSnackbar } = useSnackbar();
  const [measurementData, setMeasurementData] = useState([]);
  const [selectedButtonGroup, setSelectedButtonGroup] = useState(1);
  const [selectedDataGrid, setSelectedDataGrid] = useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openFixDialog, setOpenFixDialog] = React.useState(false);

  const filteredMeasurement = selectedButtonGroup
    ? measurementData.filter(
        (measurement) => measurement.measCatId === selectedButtonGroup
      )
    : measurementData;
  const getRootMeas = selectedButtonGroup
    ? measurementData.filter(
        (measurement) =>
          measurement.isRoot === true &&
          measurement.measCatId === selectedButtonGroup
      )
    : null;
  const calculateRateInRoot = (item) => {
    if (item) {
      switch (selectedButtonGroup) {
        case 1:
          {
            return (
              (item.length * item.width * item.upc) /
              (getRootMeas[0].length * getRootMeas[0].width)
            );
          }
          break;
        case 2:
          {
            return (item.length * item.upc) / getRootMeas[0].length;
          }
          break;
        case 3:
          {
            return item.rateInRoot;
          }
          break;
        case 4:
          {
            return 0;
          }
          break;
        case 5:
          {
            return item.rateInRoot;
          }
          break;
      }
    }
  };
  console.log(calculateRateInRoot(selectedDataGrid));
  console.log(selectedDataGrid);
  // console.log(measurementData);
  useEffect(() => {
    const getMeasurementData = async () => {
      try {
        const result = await getData("/product-service/Measurement");
        const resultWithIndex = result.map((row, index) => ({
          ...row,
          index: index + 1,
        }));
        setMeasurementData(resultWithIndex);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getMeasurementData();
    console.log("rendering again");
  }, [selectedButtonGroup]);

  // console.log(measurementData);
  const columns = [
    { field: "index", headerName: "STT", width: 1 },
    { field: "id", headerName: "id", width: 1 },
    { field: "measCatId", headerName: "measCatId", width: 5 },

    {
      field: "measName",
      headerName: "Đơn vị tính",
      flex: 7,

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
            {params.row.measName}
          </Link>
        );
      },
    },
    { field: "rateInRoot", headerName: "Tỷ lệ", flex: 2 },

    { field: "length", headerName: "Chiều dài", flex: 2 },

    { field: "width", headerName: "Chiều rộng", flex: 2 },
    { field: "height", headerName: "Chiều cao", flex: 2 },
    {
      field: "measure",
      headerName: "Kích thước",
      flex: 4,
      valueGetter: (value, row) => {
        switch (selectedButtonGroup) {
          case 1:
            {
              return `${value.row?.length} x ${value.row?.width}`;
            }
            break;
          case 2:
            {
              return `${value.row?.length}`;
            }
            break;
          case 3:
            {
              return "";
            }
            break;
          case 4:
            {
              return "";
            }
            break;
          case 5:
            {
              return `${value.row?.length} X ${value.row?.width} X ${value.row?.height}`;
            }
            break;
        }
        // if (selectedButtonGroup === 1) {
        //   return row.length;
        // } if
        // return row.width;
      },
    },
  ];
  const handleButtonClick = (value) => {
    setSelectedDataGrid(null);
    setSelectedButtonGroup(value);
  };

  const handleOpenAdd = (event) => {
    event.preventDefault();
    setOpenAddDialog(true);
  };
  const handleClose = (event) => {
    event.preventDefault();
    setOpenAddDialog(false);
  };
  function FormAddDialog(open) {
    const [rateInRoot, setRateInRoot] = useState("");

    const calculateRateInRootChange = (event) => {
      event.preventDefault();

      const length = document.querySelector('input[name="length"]').value;
      const width = document.querySelector('input[name="width"]').value;
      const height = document.querySelector('input[name="height"]').value;
      const upc = document.querySelector('input[name="upc"]').value;
      switch (selectedButtonGroup) {
        case 1:
          {
            return setRateInRoot(
              (length * width * upc) /
                (getRootMeas[0].length * getRootMeas[0].width)
            );
          }
          break;
        case 2:
          {
            return setRateInRoot((length * upc) / getRootMeas[0].length);
          }
          break;
        case 3:
          {
            return 0;
          }
          break;
        case 4:
          {
            return 0;
          }
          break;
        case 5:
          {
            return setRateInRoot(
              (length * width * height * upc) /
                (getRootMeas[0].length *
                  getRootMeas[0].width *
                  getRootMeas[0].height)
            );
          }
          break;
      }
    };
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
              const measName = formJson.measName;
              const length = formJson.length;
              const width = formJson.width;
              const height = formJson.height;
              // const rateInRoot = formJson.rateInRoot;
              const upc = formJson.upc;
              const isRoot = formJson.isRoot ? true : false;

              const addMeasurement = {
                measCatId: selectedButtonGroup,
                measName: measName,
                length: Number(length),
                width: Number(width),
                height: Number(height),
                rateInRoot: Number(rateInRoot),
                upc: Number(upc),
                isRoot: isRoot,
              };

              const postMeasurement = async () => {
                try {
                  const result = await postData(
                    "/product-service/Measurement",
                    addMeasurement
                  );
                  // const addMeasurement2 = {
                  //   length: result.length,
                  //   measName: result.measName,
                  //   measCatId: result.measCatId,
                  //   width: result.width,
                  //   height: result.height,
                  //   rateInRoot: result.rateInRoot,
                  //   isRoot: result.isRoot,
                  //   id: result.id,
                  //   upc: result.upc,
                  //   index: 78,
                  // };
                  const addMeasurement2 = result;

                  console.log(addMeasurement2);
                  // const updatedMeasurementData = measurementData;
                  // updatedMeasurementData.push(addMeasurement2);

                  // setMeasurementData(updatedMeasurementData);
                  setMeasurementData((prevState) => [
                    ...prevState,
                    addMeasurement2,
                  ]);
                  NotifySnackbar(
                    enqueueSnackbar,
                    "Thêm thành công!!",
                    "success"
                  );
                } catch (err) {
                  console.error("Error fetching data:", err);
                  NotifySnackbar(enqueueSnackbar, "Có lỗi xảy ra!!", "error");
                }
              };
              postMeasurement();

              handleClose(event);
              //window.location.reload(false);
            },
          }}
        >
          <DialogTitle>
            Thêm đơn vị tính: {getMeasCateName(selectedButtonGroup)}
          </DialogTitle>
          <DialogContent>
            <TextField
              name="measName"
              variant="outlined"
              label="Đơn vị tính"
              required
              sx={{ margin: 2 }}
            />
            <TextField
              name="length"
              variant="outlined"
              label="Chiều dài (mm)"
              sx={{ margin: 2 }}
              onChange={calculateRateInRootChange}
            />
            <TextField
              name="width"
              variant="outlined"
              label="Chiều rộng (mm)"
              sx={{ margin: 2 }}
              onChange={calculateRateInRootChange}
            />
            <TextField
              name="height"
              variant="outlined"
              label="Chiều cao (mm)"
              sx={{ margin: 2 }}
              onChange={calculateRateInRootChange}
            />
            {selectedButtonGroup !== 4 && (
              <TextField
                name="rateInRoot"
                variant="outlined"
                label="Tỉ lệ so với đơn vị gốc"
                helperText="Mục này tự động tính"
                value={rateInRoot}
                onChange={(event) => setRateInRoot(event.target.value)}
                sx={{ margin: 2 }}
              />
            )}
            <TextField
              name="upc"
              variant="outlined"
              label="Đóng gói"
              sx={{ margin: 2 }}
              onChange={calculateRateInRootChange}
            />
            <FormControlLabel
              control={<Checkbox name="isRoot" />}
              label="Là đơn vị gốc "
              sx={{ marginTop: 2, marginX: 4 }}
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
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              try {
                const respone = deleteData(
                  "/product-service/Measurement",
                  selectedDataGrid.id
                );
                console.log(respone);
                const updatedMeasurementData = measurementData.filter(
                  (item) => item.id !== selectedDataGrid.id
                );
                setMeasurementData(updatedMeasurementData);
                setSelectedDataGrid(null);
                handleCloseDelete();
                NotifySnackbar(enqueueSnackbar, "Xóa thành công!!", "success");
              } catch (e) {
                console.log(e);
                NotifySnackbar(enqueueSnackbar, "Có lỗi xảy ra!!", "error");
              }
            },
          }}
        >
          <DialogTitle>Xóa {selectedDataGrid.measName}</DialogTitle>
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
  const handleCloseFix = () => {
    setOpenFixDialog(false);
  };
  function FormFixDialog(open) {
    return (
      <React.Fragment>
        <Dialog
          open={open.open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              try {
                const respone = putData(
                  "/product-service/Measurement",
                  selectedDataGrid.id,
                  selectedDataGrid
                );
                console.log(respone);
                const updatedMeasurementData = measurementData.map((item) => {
                  if (item.id === selectedDataGrid.id) {
                    return selectedDataGrid;
                  }
                  return item;
                });
                setMeasurementData(updatedMeasurementData);
                setSelectedDataGrid(null);
                handleCloseFix();
                NotifySnackbar(enqueueSnackbar, "Lưu thành công!!", "success");
              } catch (error) {
                console.log(error);
                NotifySnackbar(enqueueSnackbar, "Có lỗi xảy ra!!", "error");
              }
            },
          }}
        >
          <DialogTitle>
            Sửa:{" "}
            <span style={{ fontWeight: "bold" }}>
              {selectedDataGrid.measName}
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
    // <Box elevation={6} sx={{ paddingTop: 1, paddingLeft: 1, height: "84vh" }}>
    <Grid container spacing={1}>
      {/* <div
      // style={{
      //   display: "flex",
      //   flexDirection: "row",
      // }}
      > */}
      {/* <div style={{ height: "73vh", flexGrow: 2 }}> */}
      <Grid item xs={12}>
        <ButtonGroup
          variant="outlined"
          aria-label="Basic button group"
          // sx={{ marginY: 2, marginLeft: 4, marginRight: 1 }}
        >
          <Button
            onClick={() => handleButtonClick(1)}
            variant={selectedButtonGroup === 1 ? "contained" : "outlined"}
          >
            Diện tích
          </Button>
          <Button
            onClick={() => handleButtonClick(2)}
            variant={selectedButtonGroup === 2 ? "contained" : "outlined"}
          >
            Chiều dài
          </Button>
          <Button
            onClick={() => handleButtonClick(3)}
            variant={selectedButtonGroup === 3 ? "contained" : "outlined"}
          >
            Khối lượng
          </Button>
          <Button
            onClick={() => handleButtonClick(4)}
            variant={selectedButtonGroup === 4 ? "contained" : "outlined"}
          >
            Đơn lẻ (unit)
          </Button>
          <Button
            onClick={() => handleButtonClick(5)}
            variant={selectedButtonGroup === 5 ? "contained" : "outlined"}
          >
            Thể tích
          </Button>
        </ButtonGroup>
        <Fab
          size="small"
          color="primary"
          aria-label="add"
          onClick={handleOpenAdd}
          sx={{ marginLeft: 1 }}
        >
          <AddIcon />
        </Fab>
      </Grid>
      <FormAddDialog open={openAddDialog} />
      <Grid item sx={6} md={8}>
        <DataGrid
          rows={filteredMeasurement}
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
                measCatId: false,
                width: false,
                height: false,
                length: false,
              },
            },
          }}
          sx={{ height: "79vh" }}
        />
      </Grid>

      {/* <Box
      // elevation={1}
      // sx={{
      //   paddingX: 4,
      //   py: 2,
      //   flexGrow: 3,
      // }}
      > */}
      <Grid item sx={6} md={4}>
        {selectedDataGrid ? (
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",

              maxWidth: "447px",
              flexGrow: 1,
            }}
          >
            <TextField
              id="measName"
              variant="outlined"
              label="Đơn vị tính"
              required
              value={selectedDataGrid?.measName}
              onChange={(event) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.measName = event.target.value;
                setSelectedDataGrid(updatedSelectedDataGrid);
              }}
              sx={{ marginTop: 4, marginX: 5 }}
            />
            <TextField
              id="standard-basic"
              variant="outlined"
              type="number"
              label="Chiều dài (mm)"
              sx={{ marginTop: 2, marginX: 5 }}
              value={selectedDataGrid?.length}
              onChange={(event) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.length = Number(event.target.value);

                setSelectedDataGrid(updatedSelectedDataGrid);
              }}
            />
            <TextField
              id="standard-basic"
              variant="outlined"
              type="number"
              label="Chiều rộng (mm)"
              value={selectedDataGrid?.width || ""}
              onChange={(event) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.width = Number(event.target.value);
                setSelectedDataGrid(updatedSelectedDataGrid);
              }}
              sx={{ marginTop: 2, marginX: 5 }}
            />
            <TextField
              id="standard-basic"
              variant="outlined"
              type="number"
              label="Chiều cao (mm)"
              value={selectedDataGrid?.height}
              onChange={(event) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.height = Number(event.target.value);
                setSelectedDataGrid(updatedSelectedDataGrid);
              }}
              sx={{ marginTop: 2, marginX: 5 }}
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Là đơn vị gốc "
              sx={{ marginTop: 2, marginX: 5 }}
              checked={selectedDataGrid?.isRoot}
              onClick={(event) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.isRoot = !selectedDataGrid?.isRoot;
                setSelectedDataGrid(updatedSelectedDataGrid);
              }}
            />

            {selectedButtonGroup !== 4 && (
              <TextField
                id="standard-basic"
                variant="outlined"
                type="number"
                label="Tỉ lệ so với đơn vị gốc"
                sx={{ marginY: 2, marginX: 5 }}
                value={calculateRateInRoot(selectedDataGrid)}
                onChange={(event) => {
                  const updatedSelectedDataGrid = { ...selectedDataGrid };
                  updatedSelectedDataGrid.rateInRoot = Number(
                    event.target.value
                  );
                  setSelectedDataGrid(updatedSelectedDataGrid);
                }}
              />
            )}
            <TextField
              id="standard-basic"
              variant="outlined"
              type="number"
              label="Đóng gói"
              sx={{ marginY: 2, marginX: 5 }}
              value={selectedDataGrid?.upc}
              onChange={(event) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.upc = Number(event.target.value);
                setSelectedDataGrid(updatedSelectedDataGrid);
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
          <></>
        )}
      </Grid>

      {/* </div> */}
    </Grid>
  );
}
