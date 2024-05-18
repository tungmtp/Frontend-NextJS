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
import { format } from "date-fns";
import { Typography } from "@mui/material";
import Link from "next/link";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
const initialRows = [
  {
    id: 1,
    sanPham: "DG2-9-STD.TD-X8.V10.8211.AL3.3D.S.NEWSKY",
    ycCu: 0,
    ngayGiao: "2022-04-03T09:24:40.199Z",
    ghiChu: "Ghi chú: In mặt sau ...",
    checked: false,
  },
  {
    id: 2,
    sanPham: "PS2-9-STD.TD-X8.V10.8211.AL3.3D.S.NEWSKY",
    ycCu: 2,
    ngayGiao: "2022-04-03T09:24:40.199Z",
    ghiChu: "Ghi chú: In mặt sau ...",
    checked: false,
  },
];

// function EditToolbar(props) {
//   const { setRows, setRowModesModel } = props;

//   const handleClick = () => {
//     const id = randomId();
//     setRows((oldRows) => [...oldRows, { id, name: "", age: "", isNew: true }]);
//     setRowModesModel((oldModel) => ({
//       ...oldModel,
//       [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
//     }));
//   };

//   return (
//     <GridToolbarContainer>
//       <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
//         Add record
//       </Button>
//     </GridToolbarContainer>
//   );
// }

export default function FullFeaturedCrudGrid() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});
  //   console.log(dayjs(rows[0].ngayGiao).format("YYYY-MM-DD"));
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

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

  const columns = [
    { field: "id", headerName: "STT", width: 80, editable: true },
    {
      field: "sanPham",
      headerName: "Sản phẩm",
      width: 400,
      editable: true,
    },
    {
      field: "ycCu",
      headerName: "YC cũ",
      width: 120,
      editable: true,
      type: "number",
    },
    {
      field: "ngayGiao",
      headerName: "Ngày giao",
      width: 180,
      editable: true,
      valueFormatter: (params) => dayjs(params?.value).format("DD/MM/YYYY"),
      renderEditCell: (params) => (
        <DatePicker
          value={dayjs(params.value)}
          onChange={(newValue) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: newValue.format("YYYY-MM-DD"),
            })
          }
        />
      ),
    },
    { field: "ghiChu", headerName: "Ghi chú", width: 300, editable: true },
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
  const isAnyRowInEditMode = Object.values(rowModesModel).some(
    (row) => row.mode === GridRowModes.Edit
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Yêu cầu cung ứng cho HỘI AN - DANA VISION
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
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          onClick={() => {
            if (isAnyRowInEditMode) {
              NotifySnackbar(
                enqueueSnackbar,
                "Vui lòng lưu lại các trường trong bảng!!",
                "warning"
              );
            } else {
              NotifySnackbar(enqueueSnackbar, "Thêm thành công", "success");
            }
            console.log(isAnyRowInEditMode);
          }}
        >
          Save
        </Button>
        <Link href="/business/order">
          <Button variant="outlined">Cancel</Button>
        </Link>
      </Box>
    </Box>
  );
}
