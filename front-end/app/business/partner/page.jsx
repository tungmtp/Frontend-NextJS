"use client";
import Paper from "@mui/material/Paper";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkOutlineTwoToneIcon from "@mui/icons-material/WorkOutlineTwoTone";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { deleteData, getData, postData, putData } from "@/hook/Hook";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ContactList from "@/components/partner/ContactList";
const partnerType = {
  1: "Khách hàng",
  2: "Nhà cung cấp",
  3: "Giao dịch nội bộ",
  4: "Cả mua và bán",
};

const getPartnerTypeName = (selectedPartnerType) => {
  return partnerType[selectedPartnerType];
};

export default function Partner() {
  const [partnerData, setPartnerData] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedDataGrid, setSelectedDataGrid] = useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openFixDialog, setOpenFixDialog] = React.useState(false);
  console.log(selectedContact);
  useEffect(() => {
    const getPartnerData = async () => {
      try {
        const result = await getData("/business-service/partner");
        const resultWithIndex = result.map((row, index) => ({
          ...row,
          index: index + 1,
        }));
        setPartnerData(resultWithIndex);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getPartnerData();
    console.log("rendering again");
  }, []);
  const handleRowClick = (params) => {
    setSelectedDataGrid(params.row);
    setSelectedContact(null);
  };

  const columns = [
    { field: "index", headerName: "STT", width: 10 },
    { field: "id", headerName: "id", width: 1 },
    {
      field: "nameStr",
      headerName: "Tên đối tác",
      width: 500,

      renderCell: (params) => {
        return (
          <Box
            key={params.row.id}
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              cursor: "pointer",
              ":hover": " underline",
            }}
            // onClick={() => {
            //   setSelectedDataGrid(params.row);
            // }}
          >
            {params.row.nameStr} <br /> {params.row.address}
          </Box>
        );
      },
    },
    {
      field: "action",
      headerName: "Liên hệ",
      width: 75,
      renderCell: (params) => {
        return (
          <div>
            <Link underline="hover" key={params.row.id} href="">
              <IconButton
                color="primary"
                aria-label="add an alarm"
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  setSelectedContact(params.row.id);
                  setSelectedDataGrid(null);
                }}
              >
                <PhoneIcon />
              </IconButton>
            </Link>
          </div>
        );
      },
    },
    {
      field: "action2",
      headerName: "Dự án",
      width: 75,
      renderCell: (params) => {
        return (
          <div>
            <IconButton color="primary" aria-label="add an alarm">
              <WorkOutlineTwoToneIcon />
            </IconButton>
          </div>
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
    const [partnerTypeValue, setPartnerTypeValue] = useState("");
    const handlePartnerTypeChange = (event) => {
      setPartnerTypeValue(event.target.value);
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
              const nameStr = formJson.nameStr;
              const address = formJson.address;
              const vatid = formJson.vatid;
              const warehouseAddress = formJson.warehouseAddress;
              const detail = formJson.detail;

              const addPartner = {
                nameStr: nameStr,
                address: address,
                vatid: vatid,
                warehouseAddress: warehouseAddress,
                detail: detail,
                partnerType: Number(partnerTypeValue),
              };
              console.log(addPartner);
              const postPartner = async () => {
                try {
                  const result = await postData(
                    "/business-service/partner",
                    addPartner
                  );
                  //        const addClass = {
                  //     nameStr: result.nameStr,
                  //     classType: result.classType,

                  //   };
                  const addPartner2 = result;

                  console.log(addPartner2);
                  // const updatedMeasurementData = measurementData;
                  // updatedMeasurementData.push(addMeasurement2);

                  // setMeasurementData(updatedMeasurementData);
                  setPartnerData((prevState) => [...prevState, addPartner2]);
                } catch (err) {
                  console.error("Error fetching data:", err);
                }
              };
              postPartner();

              handleClose(event);
              //window.location.reload(false);
            },
          }}
        >
          <DialogTitle>Thêm Đối tác</DialogTitle>
          <DialogContent>
            <FormControl size="small" sx={{ margin: 2, width: "219px" }}>
              <InputLabel id="partner-type-label">Loại đối tác</InputLabel>
              <Select
                required
                labelId="partner-type-label"
                id="partner-type-select"
                label="Loại đối tác"
                value={partnerTypeValue}
                onChange={handlePartnerTypeChange}
              >
                {Object.keys(partnerType).map((key) => (
                  <MenuItem key={key} value={key}>
                    {getPartnerTypeName(key)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="nameStr"
              variant="outlined"
              label="Tên đối tác"
              required
              sx={{ margin: 2 }}
            />
            <TextField
              name="address"
              variant="outlined"
              label="Địa chỉ VAT"
              sx={{ margin: 2 }}
            />
            <TextField
              name="vatid"
              variant="outlined"
              label="Mã VAT"
              sx={{ margin: 2 }}
            />
            <TextField
              name="warehouseAddress"
              variant="outlined"
              label="Địa chỉ giao dịch/kho"
              sx={{ margin: 2 }}
            />
            <TextField
              name="detail"
              variant="outlined"
              label="Thêm thông tin"
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
              const respone = deleteData(
                "/business-service/partner",
                selectedDataGrid.id
              );
              console.log(respone);
              const updatedData = partnerData.filter(
                (item) => item.id !== selectedDataGrid.id
              );
              setPartnerData(updatedData);
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
    return (
      <React.Fragment>
        <Dialog
          open={open.open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const respone = putData(
                "/business-service/partner",
                selectedDataGrid.id,
                selectedDataGrid
              );
              console.log(respone);
              const updatedData = partnerData.map((item) => {
                if (item.id === selectedDataGrid.id) {
                  return selectedDataGrid;
                }
                return item;
              });
              setPartnerData(updatedData);
              setSelectedDataGrid(null);
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
  return (
    <Box
      elevation={6}
      sx={{
        paddingTop: 1,
        paddingLeft: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
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
        <div style={{ height: "73vh", flexGrow: 2 }}>
          <DataGrid
            onRowClick={handleRowClick}
            rows={partnerData}
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
      </div>
      <Box
        elevation={1}
        sx={{
          paddingX: 4,
          py: 2,
          flexGrow: 3,
        }}
      >
        {selectedContact ? (
          <ContactList selectedContact={selectedContact} />
        ) : selectedDataGrid ? (
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              paddingY: 2,
              maxWidth: "447px",
              flexGrow: 1,
            }}
          >
            <FormControl sx={{ marginTop: 4, marginX: 5 }}>
              <InputLabel id="partner-type-label">Loại đối tác</InputLabel>
              <Select
                labelId="partner-type-label"
                id="partner-type-select"
                value={selectedDataGrid?.partnerType}
                label="Loại đối tác"
                onChange={(event) => {
                  const updatedSelectedDataGrid = { ...selectedDataGrid };
                  updatedSelectedDataGrid.partnerType = Number(
                    event.target.value
                  );
                  setSelectedDataGrid(updatedSelectedDataGrid);
                }}
              >
                {Object.keys(partnerType).map((key) => (
                  <MenuItem key={key} value={key}>
                    {getPartnerTypeName(key)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id="nameStr"
              variant="outlined"
              label="Tên đối tác"
              required
              value={selectedDataGrid?.nameStr}
              onChange={(event) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.nameStr = event.target.value;
                setSelectedDataGrid(updatedSelectedDataGrid);
              }}
              sx={{ marginTop: 2, marginX: 5 }}
            />
            <TextField
              multiline
              id="nameStr"
              variant="outlined"
              label="Địa chỉ VAT"
              required
              value={selectedDataGrid?.address}
              onChange={(event) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.address = event.target.value;
                setSelectedDataGrid(updatedSelectedDataGrid);
              }}
              sx={{ marginTop: 2, marginX: 5, textWrap: "wrap" }}
            />
            <TextField
              id="nameStr"
              variant="outlined"
              label="Mã VAT"
              required
              value={selectedDataGrid?.vatid}
              onChange={(event) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.vatid = event.target.value;
                setSelectedDataGrid(updatedSelectedDataGrid);
              }}
              sx={{ marginTop: 2, marginX: 5 }}
            />
            <TextField
              id="nameStr"
              variant="outlined"
              label="Địa chỉ giao dịch/kho"
              required
              value={selectedDataGrid?.warehouseAddress}
              onChange={(event) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.warehouseAddress = event.target.value;
                setSelectedDataGrid(updatedSelectedDataGrid);
              }}
              sx={{ marginTop: 2, marginX: 5 }}
            />
            <TextField
              id="classType"
              variant="outlined"
              label="Thêm thông tin"
              sx={{ marginY: 2, marginX: 5 }}
              value={selectedDataGrid?.detail}
              onChange={(event) => {
                const updatedSelectedDataGrid = { ...selectedDataGrid };
                updatedSelectedDataGrid.detail = event.target.value;

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
      </Box>
    </Box>
  );
}
