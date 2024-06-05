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
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { DatePicker } from "@mui/x-date-pickers";
import { useRouter, useSearchParams } from "next/navigation";
import { PostDataMessage, getData, postData, putData } from "@/hook/Hook";
import Cookies from "js-cookie";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
import { purpose, warehouseID } from "@/components/selectOptions";
import { measureCategory } from "@/components/selectOptions";
const username = Cookies.get("username");
export default function AddDetailExportTable(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const router = useRouter();
  console.log(props.deliveryDetail);
  React.useEffect(() => {
    if (props.deliveryDetail) {
      const resultWithIndex = props.deliveryDetail.map((row, index) => ({
        ...row,
        index: index + 1,
      }));
      setRows(resultWithIndex);
    }
  }, [props]);
  //   console.log(dayjs(rows[0].ngayGiao).format("YYYY-MM-DD"));

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const calculateQualityRate = (itemQuanlity, rateInRoot) => {
    if (rateInRoot == 0) {
      return itemQuanlity;
    } else {
      return rateInRoot * itemQuanlity;
    }
  };

  const columns = [
    { field: "index", headerName: "STT", flex: 1 },
    { field: "productName", headerName: "Sản phẩm", flex: 8 },
    {
      field: "MeasName",
      headerName: "ĐVT",
      flex: 4,
    },
    {
      field: "quality",
      headerName: "ĐVT",
      flex: 2,
      valueGetter: (value, row) => {
        return `Loại ${value.row.quality}`;
      },
    },
    {
      field: "quantity",
      headerName: "SL xuất",
      type: "number",
      flex: 2,
      editable: true,
    },
    {
      field: "tonKho",
      headerName: "Tồn kho",
      type: "number",
      flex: 3,
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
    // if (editedRow.isNew) {
    //   setRows(rows.filter((row) => row.id !== id));
    // }
  };

  const processRowUpdate = (newRow) => {
    // const updatedRow = { ...newRow, isNew: false };
    const updatedRow = { ...newRow };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const isAnyRowInEditMode = Object.values(rowModesModel).some(
    (row) => row.mode === GridRowModes.Edit
  );
  const handleSubmit = (event) => {
    event.preventDefault();

    if (isAnyRowInEditMode) {
      NotifySnackbar(
        enqueueSnackbar,
        "Vui lòng lưu lại các trường trong bảng!!",
        "warning"
      );
    } else {
      console.log("stockout:  ", props.stockout);

      const postOrderDelivery = async () => {
        try {
          const result = await postData(
            "/product-service/stockOut",
            props.stockout
          );
          console.log(result.id);
          rows.map((row) => {
            delete row.productName;
            delete row.id;
            delete row.index;
            delete row.MeasName;
            delete row.RateInRoot;

            row.relatedID = props.stockout.relatedID;
            row.relatedTable = props.stockout.relatedTable;
            row.createdBy = props.stockout.createdBy;
            row.createdOn = props.stockout.createdOn;
            row.stockOutID = result.id;
            row.vat = row.VAT;
            const result2 = postData("/product-service/stockOutDetail", row);
          });
          NotifySnackbar(enqueueSnackbar, "Thêm thành công", "success");
          router.push("/business/orderDelivery");
          PostDataMessage(
            "/business-service/orderDelivery/sendMessage/orderDeliveryID/success",
            props.orderDeliveryID
          );
          putData("/business-service/orderDelivery", props.orderDeliveryID, {
            completed: true,
            inProcess: false,
          });
        } catch (err) {
          console.error("Error post ordersProduce :", err);
          NotifySnackbar(enqueueSnackbar, "Có lỗi xảy ra!!", "error");
        }
      };
      postOrderDelivery();
    }
  };
  return (
    <Grid container>
      <Grid item xs={12}>
        <DataGrid
          sx={{
            "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
              py: "4px",
            },
            "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
              py: "8px",
            },
            "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
              py: "11px",
            },
          }}
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          getRowHeight={() => "auto"}
          autoHeight
          // slots={{
          //   toolbar: EditToolbar,
          // }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Box mt={2} display="flex" justifyContent="flex-start">
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
            onClick={handleSubmit}
          >
            Save
          </Button>
          <Link href="/business/orderDelivery">
            <Button
              variant="outlined"
              onClick={() => {
                PostDataMessage(
                  "/business-service/orderDelivery/sendMessage/orderDeliveryID/normal",
                  props.orderDeliveryID
                );
                putData(
                  "/business-service/orderDelivery",
                  props.orderDeliveryID,
                  {
                    completed: false,
                    inProcess: false,
                  }
                );
              }}
            >
              Cancel
            </Button>
          </Link>
        </Box>
      </Grid>
    </Grid>
  );
}
