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
import { getData } from "@/hook/Hook";
import dayjs from "dayjs";
const warehouseID = {
  0: "none",
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
export default function ImportTable(props) {
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DD");
  const dateMinus = dayjs(date).subtract(7, "day").format("YYYY-MM-DD");
  const [stockInList, setStockInList] = useState([]);
  const [filterConditional, setFilterConditional] = useState({
    warehouseID: 0,
    startDate: dateMinus,
    endDate: currentDate,
  });

  useEffect(() => {
    const getStockInByDate = async () => {
      const result = await getData(
        `/product-service/stockIn/byDate?startDate=${filterConditional.startDate}&endDate=${filterConditional.endDate}`
      );
      const stockInListWithstatus = await Promise.all(
        result.map(async (item) => {
          try {
            const response = await getData(
              `/product-service/stockIn/findByRelatedTableAndRelatedID/StockOut/${item.relatedID}`
            );
            // console.log(response);
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
      setStockInList(stockInListWithstatus);
      // setStockInList(result);
    };
    getStockInByDate();
  }, [filterConditional]);
  // console.log(stockInList);
  // const handleRowClick = (params) => {
  //   const getStockInDetail = async () => {
  //     const result = await getData(
  //       `/product-service/stockIn/byStockInID/${params.id}`
  //     );
  //     // setStockInDetail(result);
  //     props.setStockInDetail(result);
  //   };
  //   getStockInDetail();
  // };

  const handleRowClick = (params) => {
    // setStockInDetail(result);
    props.setStockInDetail(params.id);
  };
  // const handleRowClick = (id) => {
  //   const getStockInDetail = async () => {
  //     const result = await getData(
  //       `/product-service/stockIn/byStockInID/${id}`
  //     );
  //     // setStockInDetail(result);
  //     props.setStockInDetail(result);
  //   };
  //   getStockInDetail();
  // };
  // console.log(" ", stockInDetail);

  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        <FormControl sx={{ width: "100%" }} size="small">
          <InputLabel id="partner-type-label">Nhập đến kho</InputLabel>
          <Select
            sx={{ width: "100%" }}
            labelId="partner-type-label"
            id="partner-type-select"
            value={0}
            label="Nhập đến kho"
            //   onChange={(event) => {
            //     const updatedOrderDelivery = { ...orderDelivery };
            //     updatedOrderDelivery.warehouseID = Number(event.target.value);
            //     setOrderDelivery(updatedOrderDelivery);
            //   }}
          >
            {Object.keys(warehouseID).map((key) => (
              <MenuItem key={key} value={key}>
                {getWarehouseIDName(key)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={2}>
        {" "}
        <Fab
          size="small"
          color="primary"
          aria-label="add"
          // sx={{ width: "48px" }}
          //   onClick={handleOpenAdd}
        >
          <Link
            href={"/storage/importProduct/addNewImport"}
            style={{
              color: "white",
              width: "100%",
              padding: 0,
              display: "flex",
              justifyContent: "space-around",
              textDecoration: "none",
            }}
          >
            <AddIcon />
          </Link>
        </Fab>
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
      <Grid item xs={12}>
        <DataGrid
          onRowClick={handleRowClick}
          rows={stockInList}
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
      </Grid>
      {/* <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">STT</TableCell>
                <TableCell align="left">Ngày chuyển</TableCell>
                <TableCell align="left">Nội dung</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockInList &&
                stockInList?.map((row, index) => (
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
                    <TableCell align="left">{row.noidung}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid> */}
    </Grid>
  );
}
