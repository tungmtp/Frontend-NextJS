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

export default function Classes() {
  const [classesData, setClassesData] = useState([]);
  const [selectedDataGrid, setSelectedDataGrid] = useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  // const [openFixDialog, setOpenFixDialog] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [arrayLength, setArrayLength] = React.useState(0);
  useEffect(() => {
    const getClassesData = async () => {
      try {
        const result = await getData("/product-service/classes");
        const resultWithIndex = result.map((row, index) => ({
          ...row,
          index: index + 1,
        }));
        setClassesData(resultWithIndex);
        setArrayLength(result.length);
      } catch (err) {
        NotifySnackbar(
          enqueueSnackbar,
          "Lỗi mạng! Vui lòng kiểm tra đường truyền",
          "error"
        );
        console.error("Error fetching data:", err);
      }
    };
    getClassesData();
  }, []);
  const handleRowClick = (params) => {
    setSelectedDataGrid(params.row);
  };
  const columns = [
    { field: "index", headerName: "STT", width: 10 },
    { field: "id", headerName: "id", width: 1 },
    {
      field: "nameStr",
      headerName: "Tên Class",
      width: 350,

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
            {params.row.nameStr}
          </Link>
        );
      },
    },
    { field: "classType", headerName: "Loại Class", width: 150 },
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
              const nameStr = formJson.nameStr;
              const classType = formJson.classType;

              const addClass = {
                nameStr: nameStr,
                classType: classType,
              };

              const postClasses = async () => {
                try {
                  const result = await postData(
                    "/product-service/classess",
                    addClass
                  );
                  const addClass2 = result;
                  addClass2.index = arrayLength + 1;
                  setArrayLength(arrayLength + 1);
                  setClassesData((prevState) => [...prevState, addClass2]);
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
              postClasses();

              handleClose(event);
              //window.location.reload(false);
            },
          }}
        >
          <DialogTitle>Thêm Class</DialogTitle>
          <DialogContent>
            <TextField
              name="nameStr"
              variant="outlined"
              label="Tên Class"
              required
              sx={{ margin: 2 }}
            />
            <TextField
              name="classType"
              variant="outlined"
              label="Loại Class"
              sx={{ margin: 2 }}
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
              const deleteClasses = async () => {
                try {
                  const respone = await deleteData(
                    "/product-service/classes",
                    selectedDataGrid.id
                  );

                  const updatedData = classesData.filter(
                    (item) => item.id !== selectedDataGrid.id
                  );
                  setClassesData(updatedData);
                  setSelectedDataGrid(null);
                  handleCloseDelete();

                  NotifySnackbar(
                    enqueueSnackbar,
                    "Xóa class thành công",
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
              deleteClasses();
            },
          }}
        >
          <DialogTitle>Xóa {selectedDataGrid.nameStr}</DialogTitle>
          <DialogContent>Bạn chắc chắn muốn xóa thư mục này?</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }

  // **confirm Dialog**

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
  //             const updatedData = classesData.map((item) => {
  //               if (item.id === selectedDataGrid.id) {
  //                 return selectedDataGrid;
  //               }
  //               return item;
  //             });
  //             setClassesData(updatedData);
  //             setSelectedDataGrid(null);
  //             handleCloseFix();
  //             NotifySnackbar(enqueueSnackbar, "Lưu thành công", "success");
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
  const fixSubmit = (event) => {
    event.preventDefault();
    const respone = putData(
      "/product-service/classes",
      selectedDataGrid.id,
      selectedDataGrid
    );
    const updatedData = classesData.map((item) => {
      if (item.id === selectedDataGrid.id) {
        return selectedDataGrid;
      }
      return item;
    });
    setClassesData(updatedData);
    NotifySnackbar(enqueueSnackbar, "Lưu thành công", "success");
  };
  return (
    <Paper
      elevation={6}
      sx={{
        paddingTop: 1,
        paddingLeft: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Button
        size="small"
        color="primary"
        aria-label="add"
        onClick={handleOpenAdd}
        variant="contained"
        sx={{ marginY: "8px", width: "120px" }}
      >
        <AddIcon /> Add New
      </Button>
      <FormAddDialog open={openAddDialog} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "73vh",
        }}
      >
        <div style={{ height: "100%", flexGrow: 2 }}>
          <DataGrid
            onRowClick={handleRowClick}
            rows={classesData}
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
            flexGrow: 1,
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
                flexGrow: 2,
              }}
            >
              <TextField
                id="nameStr"
                variant="outlined"
                label="Tên Class"
                required
                value={selectedDataGrid?.nameStr}
                onChange={(event) => {
                  const updatedSelectedDataGrid = { ...selectedDataGrid };
                  updatedSelectedDataGrid.nameStr = event.target.value;
                  setSelectedDataGrid(updatedSelectedDataGrid);
                }}
                sx={{ marginTop: 4, marginX: 5 }}
              />
              <TextField
                id="classType"
                variant="outlined"
                label="Loại Class"
                sx={{ marginY: 2, marginX: 5 }}
                value={selectedDataGrid?.classType || ""}
                onChange={(event) => {
                  const updatedSelectedDataGrid = { ...selectedDataGrid };
                  updatedSelectedDataGrid.classType = event.target.value;

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
            <></>
          )}
        </Box>
      </div>
    </Paper>
  );
}
