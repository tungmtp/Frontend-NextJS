"use client";
import Paper from "@mui/material/Paper";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { deleteData, getData, postData, putData } from "@/hook/Hook";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";

const username = Cookies.get("username");
export default function Segment() {
  const [segmentData, setSegmentData] = useState([]);
  // const [classesData, setClassesData] = useState([]);
  // const [measurementData, setMeasurementData] = useState([]);
  const [selectedDataGrid, setSelectedDataGrid] = useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openFixDialog, setOpenFixDialog] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [arrayLength, setArrayLength] = React.useState(0);

  useEffect(() => {
    let arrayLenghtFirstRender;
    const getSegmentData = async () => {
      try {
        const result = await getData("/produce-service/segment");
        const resultWithIndex = result.map((row, index) => ({
          ...row,
          index: index + 1,
        }));
        setSegmentData(resultWithIndex);
        setArrayLength(result.length);
        arrayLenghtFirstRender = resultWithIndex.length;
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getSegmentData();

    const handleNewDataFromEventSource = (event) => {
      const dataFromEventSource = event.detail;
      console.log("Received new data from eventSource: ", dataFromEventSource);

      if (dataFromEventSource.headers.RequestType[0] != undefined) {
        if (
          dataFromEventSource.headers.RequestType[0] == "ADD_SEGMENT" &&
          username !== dataFromEventSource.headers.UserName[0]
        ) {
          const addSegment = dataFromEventSource.body;
          addSegment.index = arrayLenghtFirstRender + 1;
          arrayLenghtFirstRender += 1;

          setSegmentData((prevState) => [...prevState, addSegment]);
        } else if (
          dataFromEventSource.headers.RequestType[0] == "UPDATE_SEGMENT" &&
          username !== dataFromEventSource.headers.UserName[0]
        ) {
          const updateSegment = dataFromEventSource.body;
          setSegmentData((prevState) =>
            prevState.map((item) => {
              if (item.id === updateSegment.id) {
                updateSegment.index = item.index;
                return updateSegment;
              }
              return item;
            })
          );

          setSelectedDataGrid((prevState) => {
            if (prevState?.id === updateSegment.id) {
              return updateSegment;
            }
          });
        } else if (
          dataFromEventSource.headers.RequestType[0] == "DELETE_SEGMENT" &&
          username !== dataFromEventSource.headers.UserName[0]
        ) {
          const deleteSegmentId = dataFromEventSource.body;
          setSegmentData((prevState) =>
            prevState.filter((item) => item.id !== deleteSegmentId)
          );
          setSelectedDataGrid((prevState) => {
            if (prevState?.id === deleteSegmentId) {
              return null;
            }
          });
        }
      }
    };

    window.addEventListener("newDataEvent", handleNewDataFromEventSource);

    return () => {
      window.removeEventListener("newDataEvent", handleNewDataFromEventSource);
    };
  }, []);
  const handleRowClick = (params) => {
    setSelectedDataGrid(params.row);
  };
  const columns = [
    { field: "index", headerName: "STT", width: 10 },
    { field: "id", headerName: "id", width: 300 },

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
            // onClick={() => {
            //   setSelectedDataGrid(params.row);
            // }}
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
    // let selectedClassId = "";
    // let selectedDefaultMeas = "";
    // let selectedDateEffected = "";
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

              const postSegment = async () => {
                try {
                  const result = await postData(
                    "/produce-service/segment",
                    addData
                  );
                  const addData2 = result;
                  addData2.index = arrayLength + 1;
                  setArrayLength(arrayLength + 1);
                  setSegmentData((prevState) => [...prevState, addData2]);
                  NotifySnackbar(
                    enqueueSnackbar,
                    "thêm sản phẩm thành công",
                    "success"
                  );
                } catch (err) {
                  NotifySnackbar(
                    enqueueSnackbar,
                    "Lỗi mạng! Vui lòng kiểm tra đường truyền",
                    "error"
                  );
                  console.error("Error fetching data:", err);
                }
              };
              postSegment();
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
              const deleteSegment = async () => {
                try {
                  const respone = await deleteData(
                    "/produce-service/segment",
                    selectedDataGrid.id
                  );
                  const updatedData = segmentData.filter(
                    (item) => item.id !== selectedDataGrid.id
                  );
                  setSegmentData(updatedData);
                  setSelectedDataGrid(null);
                  handleCloseDelete();
                  NotifySnackbar(enqueueSnackbar, "Xóa thành công", "success");
                } catch (err) {
                  NotifySnackbar(
                    enqueueSnackbar,
                    "Lỗi mạng! Vui lòng kiểm tra đường truyền",
                    "error"
                  );
                  console.error("Error fetching data:", err);
                }
              };
              deleteSegment();
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

  // ** FIX DIALOG**

  // const handleOpenFix = (event) => {
  //   setOpenFixDialog(true);
  //   // setAddCategory({ isChildOf: selectedSingleNode });
  // };
  // const handleCloseFix = (event) => {
  //   event.preventDefault();
  //   setOpenFixDialog(false);
  // };
  // function FormFixDialog(open) {
  //   return (
  //     <React.Fragment>
  //       <Dialog
  //         open={open.open}
  //         onClose={handleCloseFix}
  //         PaperProps={{
  //           component: "form",
  //           onSubmit: (event) => {
  //             event.preventDefault();

  //             const respone = putData(
  //               "/produce-service/segment",
  //               selectedDataGrid.id,
  //               selectedDataGrid
  //             );

  //             const updatedData = segmentData.map((item) => {
  //               if (item.id === selectedDataGrid.id) {
  //                 return selectedDataGrid;
  //               }
  //               return item;
  //             });
  //             setSegmentData(updatedData);

  //             handleCloseFix(event);
  //             alert("Lưu thành công");
  //           },
  //         }}
  //       >
  //         <DialogTitle>
  //           Sửa:{" "}
  //           <span style={{ fontWeight: "bold" }}>
  //             {selectedDataGrid.segmentName}
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
  const fixSubmit = (event) => {
    event.preventDefault();
    const putSegment = async () => {
      try {
        const respone = await putData(
          "/produce-service/segment",
          selectedDataGrid.id,
          selectedDataGrid
        );

        const updatedData = segmentData.map((item) => {
          if (item.id === selectedDataGrid.id) {
            return selectedDataGrid;
          }
          return item;
        });
        setSegmentData(updatedData);
        NotifySnackbar(enqueueSnackbar, "Sửa thành công", "success");
      } catch (err) {
        NotifySnackbar(
          enqueueSnackbar,
          "Lỗi mạng! Vui lòng kiểm tra đường truyền",
          "error"
        );
        console.error("Error fetching data:", err);
      }
    };
    putSegment();
  };

  return (
    <Box elevation={6} sx={{ paddingTop: 1, paddingLeft: 1, height: "84vh" }}>
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
            onRowClick={handleRowClick}
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
                <Button variant="contained" onClick={fixSubmit}>
                  Save
                </Button>
                {/* <FormFixDialog open={openFixDialog} /> */}
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
    </Box>
  );
}
