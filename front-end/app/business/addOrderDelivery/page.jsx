"use client";
import * as React from "react";
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
import { format } from "date-fns";
import { Typography } from "@mui/material";
import Link from "next/link";

const initialRows = [
  {
    id: 1,
    stt: 1,
    sanPham:
      "DG2-8-EX.TD-X8.V6G0.2781-7.AL3.3V.S.ARC.NEWSKY-JANHOME-(NSAQ1233)",
    dvTcl: "hộp 12T 1223*148*12mm Loại 1",
    slXuat: 30,
    tonKho: 0.0,
    slQuyDoi: 65.16,
    giaBan: 210000,
    vat: 0,
    thanhTien: 13683902,
  },
  {
    id: 2,
    stt: 2,
    sanPham: "DG2-8-EX.TD-X8.V6G0.307.AL3.3V.S.ARC.NEWSKY-JANHOME-(NSAQ1234)",
    dvTcl: "hộp 12T 1223*148*12mm Loại 1",
    slXuat: 30,
    tonKho: 0.0,
    slQuyDoi: 65.16,
    giaBan: 210000,
    vat: 0,
    thanhTien: 13683902,
  },
  // Add more rows as needed
];

const AddOrderDelivery = () => {
  const [rows, setRows] = React.useState(initialRows);
  console.log(rows);
  const [rowModesModel, setRowModesModel] = React.useState({});
  //   console.log(dayjs(rows[0].ngayGiao).format("YYYY-MM-DD"));
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const columns = [
    { field: "stt", headerName: "STT", width: 70, editable: true },
    { field: "sanPham", headerName: "Sản phẩm", width: 400, editable: true },
    { field: "dvTcl", headerName: "ĐVT/CL", width: 150, editable: true },
    {
      field: "slXuat",
      headerName: "SL xuất",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "tonKho",
      headerName: "Tồn kho",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "slQuyDoi",
      headerName: "SL quy đổi",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "giaBan",
      headerName: "Giá bán/ĐV gốc",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "vat",
      headerName: "VAT",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "thanhTien",
      headerName: "Thành tiền",
      type: "number",
      width: 150,
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

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Yêu cầu giao hàng cho JANHOME đơn hàng số: 16280
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        // slots={{
        //   toolbar: EditToolbar,
        // }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
      <Box mt={2} display="flex" justifyContent="flex-start">
        <Button variant="contained" color="primary" sx={{ mr: 2 }}>
          Save
        </Button>
        <Link href="/business/order">
          <Button variant="outlined">Cancel</Button>
        </Link>
      </Box>
    </Box>
  );
};

export default AddOrderDelivery;
