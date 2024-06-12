import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
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
export default function ExportTable(props) {
  const date = new Date();
  const currentDate = dayjs(date).format("YYYY-MM-DD");
  const dateMinus = dayjs(date).subtract(7, "day").format("YYYY-MM-DD");
  const [stockOutList, setStockOutList] = useState([]);
  const [filterConditional, setFilterConditional] = useState({
    warehouseID: 0,
    startDate: dateMinus,
    endDate: currentDate,
  });

  useEffect(() => {
    const getStockInByDate = async () => {
      const result = await getData(
        `/product-service/stockOut/byDate?startDate=${filterConditional.startDate}&endDate=${filterConditional.endDate}`
      );
      setStockOutList(result);
    };
    getStockInByDate();
  }, [filterConditional]);
  const handleRowClick = (params) => {
    const getStockInDetail = async () => {
      const result = await getData(
        `/product-service/stockOut/byStockOutID/${params.id}`
      );
      console.log(result);
      // setStockInDetail(result);
      props.setStockOutDetail(result);
    };
    getStockInDetail();
  };
  // console.log(" ", stockInDetail);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl sx={{ width: "100%" }} size="small">
          <InputLabel id="partner-type-label">Xuất từ kho</InputLabel>
          <Select
            disabled
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
      </Grid>
    </Grid>
  );
}
