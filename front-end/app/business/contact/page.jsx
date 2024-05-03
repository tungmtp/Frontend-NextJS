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

export default function Contact() {
  const [contactRelation, setContactRelation] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [partnerData, setPartnerData] = useState([]);
  const [selectedDataGrid, setSelectedDataGrid] = useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openFixDialog, setOpenFixDialog] = React.useState(false);
  useEffect(() => {
    const getContactRelation = async () => {
      try {
        const result = await getData("/business-service/contactRelation");
        const result2 = await getData("/business-service/contact");
        const result3 = await getData("/business-service/partner");

        const resultWithIndex = result.map((row, index) => ({
          ...row,
          index: index + 1,
        }));
        setContactRelation(resultWithIndex);

        // Đổi tên trường nameStr thành label để phù hợp dữ liệu đầu vào autocomplete
        const changeFieldName = result2.map((item, index) => {
          return {
            ...item,
            index: index + 1,
            label: item.nameStr, // Tạo trường label từ trường nameStr
          };
        });
        setContactData(changeFieldName);

        const changeFieldName3 = result3.map((item) => {
          return {
            ...item,
            label: item.nameStr, // Tạo trường label từ trường nameStr
          };
        });

        setPartnerData(changeFieldName3);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getContactRelation();
    console.log("rendering again");
  }, []);

  console.log(selectedDataGrid);
  const columns = [
    { field: "index", headerName: "STT", width: 10 },
    { field: "id", headerName: "id", width: 1 },

    {
      field: "nameStr",
      headerName: "Tên liên hệ",
      width: 200,

      renderCell: (params) => {
        // const contactName = contactData.find(
        //   (item) => item.id === params.row.contactId
        // )?.label;

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
            {params.row.nameStr}
          </Link>
        );
      },
    },
    {
      field: "handPhone",
      headerName: "Số điện thoại",
      width: 200,

      renderCell: (params) => {
        // const handPhone = contactData.find(
        //   (item) => item.id === params.row.contactId
        // )?.handPhone;

        return (
          <Link
            underline="hover"
            key={params.row.id}
            color="inherit"
            variant="body2"
            onClick={() => {
              setSelectedDataGrid(params.row);
            }}
          >
            {params.row.handPhone}
          </Link>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "12",
      headerName: "Đối tác",
      width: 100,

      renderCell: (params) => {
        const partnerName = partnerData.find(
          (item) => item.id === params.row.partnersID
        )?.nameStr;

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
            {partnerName}
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
    let selectedPartnerId = "";

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

              const PartnerID = selectedPartnerId;
              const nameStr = formJson.nameStr;
              const handPhone = formJson.handPhone;
              const email = formJson.email;
              const title = formJson.title;

              const addContact = {
                partnersID: PartnerID,
                nameStr: nameStr,
                handPhone: handPhone,
                email: email,
                title: title,
              };
              console.log(addContact);

              const postContact = async () => {
                try {
                  const result = await postData(
                    "/business-service/contact",
                    addContact
                  );
                  const addContact2 = result;
                  setContactData((prevState) => [...prevState, addContact2]);
                } catch (err) {
                  console.error("Error fetching data:", err);
                }
              };
              postContact();
              handleClose(event);
            },
          }}
        >
          <DialogTitle>Thêm giá hạch toán</DialogTitle>
          <DialogContent sx={{ display: "flex", flexWrap: "wrap" }}>
            <Autocomplete
              name="classId"
              options={partnerData}
              sx={{ margin: 2, width: "477px" }}
              renderInput={(params) => (
                <TextField {...params} label="Đối tác" />
              )}
              onChange={(event, value) => {
                selectedPartnerId = value.id;
              }}
              //   onChange={handleOnChange}
            />
            <TextField
              name="nameStr"
              variant="outlined"
              label="Tên liên hệ"
              sx={{ margin: 2 }}
            />
            <TextField
              name="handPhone"
              variant="outlined"
              label="Số điện thoại"
              sx={{ margin: 2 }}
            />
            <TextField
              name="email"
              variant="outlined"
              label="Email"
              sx={{ margin: 2 }}
            />
            <TextField
              name="title"
              variant="outlined"
              label="Chức vụ"
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
    // const getClassesName = contactData.find(
    //   (classes) => classes.id === selectedDataGrid.classId
    // );
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
                "/business-service/contact",
                selectedDataGrid.id
              );
              console.log(respone);
              const updatedData = contactData.filter(
                (item) => item.id !== selectedDataGrid.id
              );
              setContactData(updatedData);
              setSelectedDataGrid(null);
              handleCloseDelete();
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
  const handleOpenFix = (event) => {
    setOpenFixDialog(true);
    // setAddCategory({ isChildOf: selectedSingleNode });
  };
  const handleCloseFix = () => {
    setOpenFixDialog(false);
  };
  function FormFixDialog(open) {
    // const getClassesName = contactData.find(
    //   (classes) => classes.id === selectedDataGrid.classId
    // );
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
                "/business-service/contact",
                selectedDataGrid.id,
                selectedDataGrid
              );
              console.log(respone);
              const updatedData = contactData.map((item) => {
                if (item.id === selectedDataGrid.id) {
                  return selectedDataGrid;
                }
                return item;
              });
              setContactData(updatedData);
              setSelectedDataGrid(null);
              handleCloseFix();
              alert("Lưu thành công");
            },
          }}
        >
          <DialogTitle>
            Sửa:{" "}
            <span style={{ fontWeight: "bold" }}>
              {selectedDataGrid.nameStr}
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
            rows={contactData}
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
                id="nameStr"
                variant="outlined"
                label="Tên liên hệ"
                sx={{ marginTop: 2, marginX: 5 }}
                value={selectedDataGrid?.nameStr}
                onChange={(event) => {
                  const updatedSelectedDataGrid = { ...selectedDataGrid };
                  updatedSelectedDataGrid.nameStr = event.target.value;

                  setSelectedDataGrid(updatedSelectedDataGrid);
                }}
              />
              <TextField
                id="handPhone"
                variant="outlined"
                label="Số điện thoại"
                sx={{ marginTop: 2, marginX: 5 }}
                value={selectedDataGrid?.handPhone}
                onChange={(event) => {
                  const updatedSelectedDataGrid = { ...selectedDataGrid };
                  updatedSelectedDataGrid.handPhone = event.target.value;

                  setSelectedDataGrid(updatedSelectedDataGrid);
                }}
              />
              <TextField
                id="email"
                variant="outlined"
                label="Email"
                sx={{ marginTop: 2, marginX: 5 }}
                value={selectedDataGrid?.email}
                onChange={(event) => {
                  const updatedSelectedDataGrid = { ...selectedDataGrid };
                  updatedSelectedDataGrid.email = event.target.value;

                  setSelectedDataGrid(updatedSelectedDataGrid);
                }}
              />
              <Autocomplete
                options={partnerData}
                sx={{ marginY: 2, marginX: 5 }}
                renderInput={(params) => (
                  <TextField {...params} label="Đối tác" />
                )}
                value={partnerData.find(
                  (partner) => partner.id === selectedDataGrid?.partnersID
                )}
                onChange={(event, value) => {
                  if (value) {
                    const updatedSelectedDataGrid = { ...selectedDataGrid };
                    updatedSelectedDataGrid.partnersID = value?.id;
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
