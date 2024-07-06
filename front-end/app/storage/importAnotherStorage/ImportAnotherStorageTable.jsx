import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useEffect, useState } from "react";
import Fab from "@mui/material/Fab";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { asyncGetData, getData } from "@/hook/Hook";
import dayjs from "dayjs";
import { filterWarehouseID } from "@/components/selectOptions";
const warehouseID = {
  1: "Kho văn phòng",
  2: "Kho Nhà máy Việt Á",
  3: "Kho Sài gòn",
  4: "Giao thẳng từ nhà cung cấp",
  10: "Kho CPC",
};
const getWarehouseIDName = (selectedWarehouseID) => {
  return warehouseID[selectedWarehouseID];
};
const columns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "slipDate",
    headerName: "Ngày Nhập",
    width: 150,
    valueFormatter: (params) => dayjs(params?.value).format("DD/MM/YYYY"),
  },
  { field: "noidung", headerName: "Nội dung", width: 400, flex: 1 },
];
export default function ImportAnotherStorageTable(props) {
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DD");
  const dateMinus = dayjs(date).subtract(7, "day").format("YYYY-MM-DD");
  const [stockOutList, setStockOutList] = useState([]);
  const [filterConditional, setFilterConditional] = useState({
    warehouseID: 2,
    startDate: dateMinus,
    endDate: currentDate,
  });

  // useEffect(() => {
  //   const getStockInByDate = async () => {
  //     const result = await getData(
  //       `/product-service/stockOut/betweenWarehouses?startDate=${
  //         filterConditional.startDate
  //       }&endDate=${filterConditional.endDate}&warehouseID=${Number(
  //         filterConditional.warehouseID
  //       )}`
  //     );

  //     setStockOutList(result);
  //   };
  //   getStockInByDate();
  // }, [filterConditional]);

  useEffect(() => {
    const getStockOutByDate = async () => {
      const result = await getData(
        `/product-service/stockOut/betweenWarehouses?startDate=${
          filterConditional.startDate
        }&endDate=${filterConditional.endDate}&warehouseID=${Number(
          filterConditional.warehouseID
        )}`
      );
      const stockOutListWithstatus = await Promise.all(
        result?.map(async (item) => {
          try {
            const response = await getData(
              `/product-service/stockIn/findByRelatedTableAndRelatedID/StockOut/${item.id}`
            );
            // console.log("StockIn: ", response);
            return {
              ...item,
              status: response !== null,
            };
          } catch (error) {
            console.error("Error checking stock:", error);
            return {
              ...item,
              status: false,
            };
          }
        })
      );
      setStockOutList(stockOutListWithstatus);
    };
    getStockOutByDate();
  }, [filterConditional, props.stockInDetail]);
  // console.log("stockOutList: ", stockOutList);
  // const handleRowClick = (params) => {
  //   const getStockInDetail = async () => {
  //     const result = await getData(
  //       `/product-service/stockOut/byStockOutID/${params.id}`
  //     );
  //     // console.log(result);
  //     // setStockInDetail(result);
  //     props.setStockInDetail(result);
  //   };
  //   getStockInDetail();
  // };

  // const checkStockIn = (id) => {
  //   let checkResult = null;
  //   const result = getData(
  //     `/product-service/stockIn/findByRelatedTableAndRelatedID/StockOut/${id}`
  //   ).then((result) => {
  //     // console.log(result);
  //     if (result) {
  //       checkResult = true;
  //     } else {
  //       checkResult = false;
  //     }
  //     return checkResult;
  //   });
  //   // console.log(result);
  //   return result;
  // };

  // const checkStockIn = (id) => {
  //   const result = asyncGetData(
  //     `/product-service/stockIn/findByRelatedTableAndRelatedID/StockOut/${id}`
  //   )
  //     .then((response) => response.json())
  //     .then((result) => {
  //       // console.log(result);
  //       // return result !== null;
  //     })
  //     .catch((error) => {
  //       console.error("Error checking stock:", error);
  //       // return false; // or handle the error differently
  //     });
  // };
  // console.log(checkStockIn("fbb88df4-5fbd-3138-8934-5b9e4adf7a86"));
  const handleRowClick = (id) => {
    const getStockOutDetail = async () => {
      const response = await getData(
        `/product-service/stockIn/findByRelatedTableAndRelatedID/StockOut/${id}`
      );
      if (response === null) {
        const result = await getData(
          `/product-service/stockOut/byStockOutID/${id}`
        );
        // console.log(result);
        const stockInDetailWithStatus = result.map((item) => {
          return {
            ...item,
            status: false,
          };
        });

        props.setStockInDetail(stockInDetailWithStatus);
      } else {
        const result = await getData(
          `/product-service/stockIn/byStockInID/${response.id}`
        );
        // console.log(result);
        const stockInDetailWithStatus = result.map((item) => {
          return {
            ...item,
            status: true,
          };
        });

        props.setStockInDetail(stockInDetailWithStatus);
      }
    };
    getStockOutDetail();
  };

  // console.log(" ", stockInDetail);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl sx={{ width: "100%" }} size="small">
          <InputLabel id="partner-type-label">Kho nhận</InputLabel>
          <Select
            sx={{ width: "100%" }}
            labelId="partner-type-label"
            id="partner-type-select"
            value={filterConditional.warehouseID}
            label="Kho nhận"
            onChange={(event) => {
              const updatedFilterConditional = { ...filterConditional };
              updatedFilterConditional.warehouseID = Number(event.target.value);
              setFilterConditional(updatedFilterConditional);
            }}
          >
            {Object.keys(filterWarehouseID).map((key) => (
              <MenuItem key={key} value={key}>
                {getWarehouseIDName(key)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item md={6} xs={12}>
        <DatePicker
          sx={{ width: "100%" }}
          label="Từ ngày"
          value={dayjs(filterConditional?.startDate)}
          onChange={(newValue) => {
            const updatedFilterConditional = { ...filterConditional };
            updatedFilterConditional.startDate = newValue.format("YYYY-MM-DD");
            setFilterConditional(updatedFilterConditional);
          }}
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <DatePicker
          sx={{ width: "100%" }}
          label="Đến ngày"
          value={dayjs(filterConditional?.endDate)}
          onChange={(newValue) => {
            const updatedFilterConditional = { ...filterConditional };
            updatedFilterConditional.endDate = newValue.format("YYYY-MM-DD");
            setFilterConditional(updatedFilterConditional);
          }}
        />
      </Grid>
      {/* <Grid item xs={12}>
        <DataGrid
          onRowClick={handleRowClick}
          rows={stockOutList}
          columns={columns}
          pageSize={1}
          pageSizeOptions={[12]}
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false,
              },
            },
            pagination: {
              paginationModel: {
                pageSize: 12,
              },
            },
          }}
        />
      </Grid> */}
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">STT</TableCell>
                <TableCell align="left">Ngày chuyển</TableCell>
                <TableCell align="left">Kho chuyển/Nội dung</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockOutList &&
                stockOutList?.map((row, index) => (
                  <TableRow
                    hover={!row.status}
                    key={index}
                    sx={
                      row.status
                        ? { backgroundColor: "#c0c0c0" }
                        : {
                            cursor: "pointer",
                          }
                    }
                    onClick={() => handleRowClick(row.id)}
                  >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">
                      {dayjs(row.slipDate).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell align="left">
                      {row.noidung}
                      <br />
                      {warehouseID[row.warehouseID]}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
