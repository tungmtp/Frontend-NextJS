import { Box, Grid, TextField, Typography } from "@mui/material";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbar,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import { filterWarehouseID } from "@/components/selectOptions";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
import { getData, postData } from "@/hook/Hook";
const username = Cookies.get("username");
const rowss = [
  {
    index: 1,
    id: "1aaaa",
    nameStr: "test",
    MeasName: "meas test",
    slChuyen: 123,
    slNhan: 122,
  },
];
export default function StockInAnotherStorageDetail(props) {
  const { enqueueSnackbar } = useSnackbar();
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DD");
  const [rows, setRows] = useState(rowss);
  const [rowModesModel, setRowModesModel] = useState({});
  const [stockIn, setStockIn] = useState({
    slipDate: currentDate,
    comment: "",
    relatedTable: "StockOut",
    relatedID: "",
    createdBy: username,
    createdOn: currentDate,
    purpose: 5,
    // paymentDate: currentDate,
    noidung: "",
    warehouseID: 1,
    receiveFrom: 1,
  });
  // console.log(stockIn);

  useEffect(() => {
    const updateStockInDetail = { ...stockIn };
    updateStockInDetail.comment = props.stockInDetail[0].Comment;
    updateStockInDetail.relatedID = props.stockInDetail[0].id;
    updateStockInDetail.receiveFrom = props.stockInDetail[0].warehouseID;
    updateStockInDetail.noidung = props.stockInDetail[0].Noidung;
    updateStockInDetail.warehouseID = props.stockInDetail[0].shipTo;
    updateStockInDetail.status = props.stockInDetail[0].status;

    setStockIn(updateStockInDetail);
    if (props.stockInDetail[0].status === false) {
      updateStockInDetail.slipDate = currentDate;
      updateStockInDetail.createdBy = username;
      updateStockInDetail.createdOn = currentDate;
      const stockInDetail = props.stockInDetail[0].StockOutDetail;

      stockInDetail?.map((item) => {
        item.quantityStockOut = item.quantity;
        item.relatedID = item.id;
        item.relatedTable = "StockOutDetail";
        console.log("stockInDetail: ", props.stockInDetail[0]);
      });
      setRows(stockInDetail);
    } else {
      updateStockInDetail.slipDate = props.stockInDetail[0].slipDate;
      updateStockInDetail.createdBy = props.stockInDetail[0].createdBy;
      updateStockInDetail.createdOn = props.stockInDetail[0].createdOn;
      const stockInDetail = props.stockInDetail[0].StockInDetail;
      // console.log("stockInDetail: ", props.stockInDetail[0]);
      // stockInDetail?.map((item) => {
      //   item.quantityStockOut = "---";
      // });
      setRows(stockInDetail);
    }
  }, [props.stockInDetail]);
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
    // if (editedRow.isNew) {
    //   setRows(rows.filter((row) => row.id !== id));
    // }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow };
    // const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const columns = [
    { field: "index", headerName: "STT", flex: 1 },
    { field: "id", headerName: "STT", width: 10 },

    {
      field: "nameStr",
      headerName: "Sản phẩm",
      minWidth: 150,
      flex: 8,
    },
    {
      field: "MeasName",
      headerName: "ĐVT",
      minWidth: 150,
      flex: 8,
    },
    {
      field: "quantityStockOut",
      headerName: "SL chuyển",
      flex: 2,
      type: "number",
    },
    {
      field: "quantity",
      headerName: "SL nhận",
      flex: 2,
      editable: true,
      type: "number",
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
        if (!props.stockInDetail[0].status) {
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
        } else return [<></>];
      },
    },
  ];
  const handleSubmit = (event) => {
    event.preventDefault();

    // console.log("stockin:  ", stockIn);
    // rows.map((row, i) => {
    //   row.stockInID = "abc";
    //   delete row.stockOutID;
    //   delete row.id;
    //   delete row.MeasName;
    // });
    // console.log("stockinDetail:  ", rows);
    const postStockIn = async () => {
      try {
        delete stockIn.status;
        const result = await postData("/product-service/stockIn", stockIn);
        rows.map((row, i) => {
          row.stockInID = result.id;
          delete row.stockOutID;
          delete row.id;
          delete row.MeasName;
          delete row.quantityStockOut;
        });
        console.log("stockin:  ", stockIn);
        console.log("stockinDetail:  ", rows);
        rows.map((row, i) => {
          const result2 = postData("/product-service/stockInDetail", row);
        });

        NotifySnackbar(enqueueSnackbar, "Thêm thành công", "success");
        props.setStockInDetail([]);
      } catch (err) {
        console.error("Error post ordersProduce :", err);
        NotifySnackbar(enqueueSnackbar, "Có lỗi xảy ra!!", "error");
      }
    };
    postStockIn();
  };
  const checkStockIn = async (id) => {
    const result = await getData(
      `/product-service/stockIn/findByRelatedTableAndRelatedID/StockOut/${id}`
    );
    // console.log(result);

    if (result) {
      return true;
    } else return false;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">
          Nhận hàng từ {filterWarehouseID[props.stockInDetail[0].warehouseID]}{" "}
          chuyển về
        </Typography>
      </Grid>
      <Grid item md={4} xs={12}>
        <DatePicker
          sx={{ width: "100%" }}
          label="Ngày nhận"
          value={dayjs(stockIn?.slipDate)}
          onChange={(newValue) => {
            const updatedStockIn = { ...stockIn };
            updatedStockIn.slipDate = newValue.format("YYYY-MM-DD");
            setStockIn(updatedStockIn);
          }}
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <TextField
          variant="outlined"
          label="Nội dung"
          sx={{ width: "100%" }}
          value={stockIn.noidung}
          onChange={(event) => {
            const updatedStockIn = { ...stockIn };
            updatedStockIn.noidung = event.target.value;
            setStockIn(updatedStockIn);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          label="Thông tin nhận hàng"
          sx={{ width: "100%" }}
          value={stockIn.comment}
          onChange={(event) => {
            const updatedStockIn = { ...stockIn };
            updatedStockIn.comment = event.target.value;
            setStockIn(updatedStockIn);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5">Danh sách hàng chuyển đến</Typography>
      </Grid>
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
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false,
              },
            },
          }}
        />
      </Grid>
      <Grid item xs={9}>
        <Box mt={2} display="flex" justifyContent="flex-start">
          {!props.stockInDetail[0].status && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              onClick={handleSubmit}
            >
              Save
            </Button>
          )}

          <Link href="">
            <Button
              variant="outlined"
              onClick={() => {
                props.setStockInDetail([]);
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
