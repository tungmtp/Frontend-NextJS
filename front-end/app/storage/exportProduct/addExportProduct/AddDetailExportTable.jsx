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
import {
  PostDataMessage,
  asyncGetData,
  deleteData,
  getData,
  postData,
  putData,
} from "@/hook/Hook";
import Cookies from "js-cookie";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
import { purpose, warehouseID } from "@/components/selectOptions";
import { measureCategory } from "@/components/selectOptions";
import PhysicalStock, {
  getPhysicalStock,
} from "@/components/physicalStock/PhysicalStock";
const username = Cookies.get("username");
export default function AddDetailExportTable(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const router = useRouter();
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DDTHH:mm:ss");
  // console.log(props.deliveryDetail);
  // console.log(rows);
  React.useEffect(() => {
    if (props.deliveryDetail) {
      // const resultWithIndex = props.deliveryDetail.map((row, index) => ({
      //   ...row,
      //   index: index + 1,
      // }));
      const fetchDataWithIndex = async () => {
        try {
          const resultWithIndex = await Promise.all(
            props.deliveryDetail.map(async (row, index) => {
              try {
                const response = await getData(
                  `/product-service/product/physicalStock/${row.productID}/${row.measID}/${props.stockout.slipDate}`
                );
                console.log(response);
                return {
                  ...row,
                  index: index + 1,
                  tonkho: response[0]?.tonkho,
                };
              } catch (e) {
                console.log(e);
                return {
                  ...row,
                  index: index + 1,
                  tonkho: 0, // Handle the error case
                };
              }
            })
          );
          console.log(resultWithIndex);
          setRows(resultWithIndex);
        } catch (e) {
          console.log(e);
        }
      };

      fetchDataWithIndex();
      // console.log(resultWithIndex);
      // setRows(resultWithIndex);
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
      field: "tonkho",
      headerName: "Tồn kho",
      type: "number",
      flex: 2,
      // renderCell: (param) => {
      //   return (
      //     <PhysicalStock
      //       productID={param.row.productID}
      //       measID={param.row.measID}
      //       date={currentDate}
      //     />
      //   );
      // },
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

  // const processRowUpdate = (newRow) => {
  //   // const updatedRow = { ...newRow, isNew: false };
  //   const updatedRow = { ...newRow };
  //   setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
  //   return updatedRow;
  // };
  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };

    if (newRow.quantity <= 0) {
      NotifySnackbar(enqueueSnackbar, "SL xuất phải lớn hơn 0!!!", "error");
      throw new Error("Quantity cannot be less than 0.");
    }
    if (newRow.quantity > newRow.tonkho) {
      NotifySnackbar(
        enqueueSnackbar,
        "SL xuất đã vượt quá số lượng tồn kho!!!",
        "error"
      );
      throw new Error("Quantity cannot be greater than stock.");
    }

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
    let checkQuantity = false;
    rows.map((row) => {
      if (row.quantity > row.tonkho) {
        checkQuantity = true;
      }
    });

    if (isAnyRowInEditMode) {
      NotifySnackbar(
        enqueueSnackbar,
        "Vui lòng lưu lại các trường trong bảng!!",
        "warning"
      );
    } else if (checkQuantity) {
      NotifySnackbar(
        enqueueSnackbar,
        "Không còn đủ hàng để xuất. Vui lòng kiểm tra tồn kho !!!",
        "error"
      );
    } else {
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
          deleteData(
            `/common-module/eventList/byEventIdAndEventName/ORDER DELIVERY DO IT`,
            props.orderDeliveryID
          );
          putData("/business-service/orderDelivery", props.orderDeliveryID, {
            completed: true,
            // inProcess: false,
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
                deleteData(
                  `/common-module/eventList/byEventIdAndEventName/ORDER DELIVERY DO IT`,
                  props.orderDeliveryID
                );
                // PostDataMessage(
                //   "/business-service/orderDelivery/sendMessage/orderDeliveryID/normal",
                //   props.orderDeliveryID
                // );
                // putData(
                //   "/business-service/orderDelivery",
                //   props.orderDeliveryID,
                //   {
                //     completed: false,
                //     inProcess: false,
                //   }
                // );
                window.close();
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
