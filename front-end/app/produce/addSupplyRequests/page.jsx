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
  GridToolbar,
} from "@mui/x-data-grid";
import { format } from "date-fns";
import { Grid, Typography } from "@mui/material";
import Link from "next/link";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { getData, postData } from "@/hook/Hook";
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
//     ordersID: "",
//     orderDetailID: "",
//     quantity: 0,
//     reqDate: null,
//     comment: "",
//     generated: false,
//     markDone: false,
export default function FullFeaturedCrudGrid() {
  const { enqueueSnackbar } = useSnackbar();
  const [ordersProduceList, setOrdersProduceList] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DD");
  const searchParams = useSearchParams();
  let orderID = searchParams.get("id");
  let orderName = searchParams.get("name");
  const router = useRouter();
  console.log(orderID);
  console.log("ordersProduceList: ", rows);
  //   console.log(dayjs(rows[0].ngayGiao).format("YYYY-MM-DD"));
  React.useEffect(() => {
    const getOrderDetailData = async () => {
      try {
        const result = await getData(
          `/business-service/orderDetail/byOrderID/${orderID}`
        );

        // Map through the results and fetch product names
        const resultWithIndex = await Promise.all(
          result.map(async (row, index) => {
            try {
              const productResult = await getData(
                `/product-service/product/oneForSelect/mayBeSell/${row.productID}`
              );
              // console.log(productResult);
              return {
                ordersID: row.orderID,
                orderDetailID: row.id,
                id: row.id,
                reqDate: currentDate,
                quantity: row.quantity,
                comment: "",
                index: index + 1,
                nameStr: productResult[0].nameStr,
              };
            } catch (err) {
              console.error("Error fetching product data:", err);
              return {
                ordersID: row.ordersID,
                orderDetailID: row.orderDetailID,
                reqDate: currentDate,
                quantity: row.quantity,
                comment: "",
                index: index + 1,
                nameStr: "Unknown Product",
              };
            }
          })
        );

        setRows(resultWithIndex);
      } catch (err) {
        console.error("Error fetching order detail data:", err);
      }
    };

    getOrderDetailData();
  }, []);
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

  function getRowId(row) {
    return row.orderDetailID;
  }
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
      field: "quantity",
      headerName: "YC cũ",
      flex: 2,
      editable: true,
      type: "number",
    },
    {
      field: "reqDate",
      headerName: "Ngày giao",
      minWidth: 100,
      flex: 4,
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
    { field: "comment", headerName: "Ghi chú", flex: 8, editable: true },
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
  const handleSubmit = () => {
    if (isAnyRowInEditMode) {
      NotifySnackbar(
        enqueueSnackbar,
        "Vui lòng lưu lại các trường trong bảng!!",
        "warning"
      );
    } else {
      try {
        rows.map((row) => {
          delete row.nameStr;
          delete row.id;
          delete row.index;
          const result = postData("/produce-service/ordersProduce", row);
          console.log(row);
        });
        NotifySnackbar(enqueueSnackbar, "Thêm thành công", "success");
        router.push("/business/order");
      } catch (err) {
        console.error("Error post ordersProduce :", err);
        NotifySnackbar(enqueueSnackbar, "Có lỗi xảy ra!!", "error");
      }
    }
  };
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Yêu cầu cung ứng cho {orderName}
        </Typography>
      </Grid>
      <Grid item xs={9}>
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
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
            onClick={handleSubmit}
          >
            Save
          </Button>
          <Link href="/business/order">
            <Button variant="outlined">Cancel</Button>
          </Link>
        </Box>
      </Grid>
    </Grid>
  );
}
