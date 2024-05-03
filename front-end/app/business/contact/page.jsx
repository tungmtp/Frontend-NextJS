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
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
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
import { FormControl, IconButton } from "@mui/material";
export default function Contact() {
  const [contactRelation, setContactRelation] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [partnerData, setPartnerData] = useState([]);
  const [selectedDataGrid, setSelectedDataGrid] = useState(null);
  const [selectedContactRelation, setSelectedContactRelation] = useState(null);
  const [selectedRelData, setSelectedRelData] = useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openAddContactRelationDialog, setOpenAddContactRelationDialog] =
    React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openFixDialog, setOpenFixDialog] = React.useState(false);
  useEffect(() => {
    const getContactRelation = async () => {
      try {
        const result2 = await getData("/business-service/contact");
        const result3 = await getData("/business-service/partner");

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
    console.log('rendering again "  ');
  }, []);

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
              const getContactRelation = async () => {
                try {
                  const result = await getData(
                    `/business-service/contactRelation/byContactID/${params.row.id}`
                  );
                  const changeFieldName = result.map((item) => {
                    const partnerName = partnerData.find(
                      (partner) => partner.id === item.relId
                    ).nameStr; // Tạo trường label từ trường nameStr
                    return {
                      ...item,
                      label: partnerName,
                    };
                  });

                  setContactRelation(changeFieldName);
                } catch (err) {
                  console.error("Error fetching data:", err);
                }
              };
              getContactRelation();
              setSelectedContactRelation(null);
              setSelectedRelData(null);
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
    let selectedDateFrom = "";
    let selectedDateTo = "";

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
              const relTitle = formJson.relTitle;

              const addContact = {
                partnersID: PartnerID,
                nameStr: nameStr,
                handPhone: handPhone,
                email: email,
                title: title,
              };
              console.log(addContact);

              const addContactRelation = {
                contactId: "",
                relId: selectedPartnerId,
                relTable: "Partner",
                relData: JSON.stringify({
                  from: selectedDateFrom,
                  to: selectedDateTo,
                  title: relTitle,
                }),
              };

              const postContact = async () => {
                try {
                  const result = await postData(
                    "/business-service/contact",
                    addContact
                  );
                  const addContact2 = result;
                  setContactData((prevState) => [...prevState, addContact2]);
                  addContactRelation.contactId = result.id;
                  const result2 = await postData(
                    "/business-service/contactRelation",
                    addContactRelation
                  );
                } catch (err) {
                  console.error("Error fetching data:", err);
                }
              };
              postContact();
              console.log(addContactRelation);
              handleClose(event);
            },
          }}
        >
          <DialogTitle>Thêm liên hệ mới</DialogTitle>
          <DialogContent sx={{ display: "flex", flexWrap: "wrap" }}>
            <TextField
              required
              name="nameStr"
              variant="outlined"
              label="Tên liên hệ"
              sx={{ margin: 2 }}
            />
            <TextField
              required
              name="handPhone"
              variant="outlined"
              label="Số điện thoại"
              sx={{ margin: 2 }}
            />
            <TextField
              required
              name="email"
              variant="outlined"
              label="Email"
              sx={{ margin: 2 }}
            />
            <TextField
              required
              name="title"
              variant="outlined"
              label="Chức vụ"
              sx={{ margin: 2 }}
            />
            <Autocomplete
              aria-required
              name="relId"
              options={partnerData}
              sx={{ margin: 2, width: "225px" }}
              renderInput={(params) => (
                <TextField {...params} label="Đối tác liên kết" />
              )}
              onChange={(event, value) => {
                selectedPartnerId = value.id;
              }}
            />
            <TextField
              name="relTitle"
              variant="outlined"
              label="Chức vụ"
              sx={{ margin: 2 }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="dateEffected"
                label="Từ ngày"
                sx={{ margin: 2, width: "225px" }}
                onChange={(newValue) => {
                  selectedDateFrom = newValue.format("YYYY-MM-DD");
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="dateEffected"
                label="Đến ngày"
                sx={{ margin: 2, width: "225px" }}
                onChange={(newValue) => {
                  selectedDateTo = newValue.format("YYYY-MM-DD");
                }}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
  console.log(selectedContactRelation);
  const handleOpenAddContactRelation = (event) => {
    event.preventDefault();
    setOpenAddContactRelationDialog(true);
  };
  const handleCloseAddContactRelation = (event) => {
    event.preventDefault();
    setOpenAddContactRelationDialog(false);
  };
  function FormAddContactRelationDialog(open) {
    let selectedPartnerId = "";
    let selectedDateFrom = "";
    let selectedDateTo = "";

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
              const relTitle = formJson.relTitle;

              const addContactRelation = {
                contactId: selectedDataGrid.id,
                relId: selectedPartnerId,
                relTable: "Partner",
                relData: JSON.stringify({
                  from: selectedDateFrom,
                  to: selectedDateTo,
                  title: relTitle,
                }),
              };

              const postContactRelation = async () => {
                try {
                  const result = await postData(
                    "/business-service/contactRelation",
                    addContactRelation
                  );
                  const addContactRelation2 = result;
                  addContactRelation2.label = partnerData.find(
                    (partner) => partner.id === addContactRelation2.relId
                  ).nameStr; // Tạo trường label từ trường nameStr
                  setContactRelation((prevState) => [
                    ...prevState,
                    addContactRelation2,
                  ]);
                } catch (err) {
                  console.error("Error fetching data:", err);
                }
              };
              postContactRelation();
              console.log(addContactRelation);
              handleCloseAddContactRelation(event);
            },
          }}
        >
          <DialogTitle>
            Thêm liên kết đối tác cho: {selectedDataGrid.nameStr}
          </DialogTitle>
          <DialogContent sx={{ display: "flex", flexWrap: "wrap" }}>
            <Autocomplete
              aria-required
              name="relId"
              options={partnerData}
              sx={{ margin: 2, width: "225px" }}
              renderInput={(params) => (
                <TextField {...params} label="Đối tác liên kết" />
              )}
              onChange={(event, value) => {
                selectedPartnerId = value.id;
              }}
            />
            <TextField
              name="relTitle"
              variant="outlined"
              label="Chức vụ"
              sx={{ margin: 2 }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="dateEffected"
                label="Từ ngày"
                sx={{ margin: 2, width: "225px" }}
                onChange={(newValue) => {
                  selectedDateFrom = newValue.format("YYYY-MM-DD");
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="dateEffected"
                label="Đến ngày"
                sx={{ margin: 2, width: "225px" }}
                onChange={(newValue) => {
                  selectedDateTo = newValue.format("YYYY-MM-DD");
                }}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddContactRelation}>Cancel</Button>
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

              delete selectedContactRelation.label;
              selectedContactRelation.relData = JSON.stringify(selectedRelData);
              const respone2 = putData(
                "/business-service/contactRelation",
                selectedContactRelation.id,
                selectedContactRelation
              );
              const updatedContactRelation = contactRelation.map((item) => {
                if (item.id === selectedContactRelation.id) {
                  return selectedContactRelation;
                }
                return item;
              });
              setContactRelation(updatedContactRelation);
              handleCloseFix();
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
  console.log(selectedRelData);
  return (
    <Paper
      elevation={6}
      sx={{
        paddingTop: 1,
        paddingLeft: 1,
        height: "84vh",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Button
          size="small"
          color="primary"
          aria-label="add"
          onClick={handleOpenAdd}
          variant="contained"
          sx={{ marginY: "8px", width: "110px" }}
        >
          <AddIcon /> Add New
        </Button>
        <FormAddDialog open={openAddDialog} />
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
            <Box
              sx={{
                display: "flex",
                marginY: 2,
                marginX: 5,
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Autocomplete
                fullWidth
                options={contactRelation}
                renderInput={(params) => (
                  <TextField {...params} label="Các đối tác đã liên kết" />
                )}
                value={
                  contactRelation.length > 0 && selectedContactRelation !== null
                    ? selectedContactRelation
                    : ""
                }
                onChange={(event, value) => {
                  if (value) {
                    setSelectedContactRelation(value);
                    setSelectedRelData(JSON.parse(value.relData));
                  }
                }}
              />
              {selectedContactRelation !== null && (
                <IconButton
                  aria-label="delete"
                  sx={{}}
                  onClick={() => {
                    const respone = deleteData(
                      "/business-service/contactRelation",
                      selectedContactRelation.id
                    );
                    console.log(respone);
                    const updatedData = contactRelation.filter(
                      (item) => item.id !== selectedContactRelation.id
                    );
                    setContactRelation(updatedData);
                    setSelectedContactRelation(null);
                    setSelectedRelData(null);
                  }}
                >
                  <DeleteIcon color="warning" />
                </IconButton>
              )}

              <IconButton
                size="small"
                color="primary"
                aria-label="add"
                onClick={handleOpenAddContactRelation}
                sx={{ height: "100%" }}
              >
                <AddCircleIcon />
              </IconButton>

              <FormAddContactRelationDialog
                open={openAddContactRelationDialog}
              />
            </Box>
            <FormControl size="small">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {selectedRelData && (
                  <DatePicker
                    label="Từ ngày"
                    value={dayjs(selectedRelData?.from)}
                    onChange={(newValue) => {
                      const updatedSelectedRelData = { ...selectedRelData };
                      console.log(newValue);
                      updatedSelectedRelData.from =
                        newValue.format("YYYY-MM-DD");
                      setSelectedRelData(updatedSelectedRelData);
                    }}
                    sx={{ marginX: 5 }}
                  />
                )}
              </LocalizationProvider>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {selectedRelData && (
                <DatePicker
                  label="Đến ngày"
                  value={dayjs(selectedRelData.to)}
                  onChange={(newValue) => {
                    const updatedSelectedRelData = { ...selectedRelData };
                    console.log(newValue);
                    updatedSelectedRelData.to = newValue.format("YYYY-MM-DD");
                    setSelectedRelData(updatedSelectedRelData);
                  }}
                  sx={{ marginTop: 2, marginX: 5 }}
                />
              )}
            </LocalizationProvider>
            {selectedRelData && (
              <TextField
                id="email"
                variant="outlined"
                label="Chức vụ"
                sx={{ marginY: 2, marginX: 5 }}
                value={selectedRelData?.title}
                onChange={(event) => {
                  const updatedSelectedRelData = { ...selectedRelData };
                  updatedSelectedRelData.title = event.target.value;

                  setSelectedRelData(updatedSelectedRelData);
                }}
              />
            )}
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
                  setSelectedContactRelation(null);
                  setSelectedRelData(null);
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
    </Paper>
  );
}
