"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { getData } from "@/hook/Hook";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
// const columns = [
//   { field: "stt", headerName: "STT", width: 70 },
//   { field: "khachHang", headerName: "Khách hàng", width: 300 },
//   { field: "diaChiGiaoHang", headerName: "Địa chỉ giao hàng", width: 400 },
//   { field: "sanPham", headerName: "Sản phẩm", width: 500 },
//   { field: "comm", headerName: "Comm", width: 150 },
// ];
function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}
const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const DeliveryProcess = () => {
  const [selectedOrderDelivery, setSelectedOrderDelivery] = React.useState();
  // const [orderDeliveryDetailList, setOrderDeliveryDetailList] = React.useState(
  //   []
  // );
  console.log(selectedOrderDelivery);

  const searchParams = useSearchParams();
  let orderID = searchParams.get("id");
  // console.log("selectedOrderDelivery: ", selectedOrderDelivery);

  React.useEffect(() => {
    const getOrderDelivery = async () => {
      try {
        const response = await getData(
          `/business-service/orderDeliverySql/byOrderID/${orderID}`
        );
        setSelectedOrderDelivery(response);
      } catch (error) {
        console.log(error);
      }
    };
    getOrderDelivery();
  }, []);
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Lịch giao hàng của đơn hàng số: {orderID}
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">STT</TableCell>
              <TableCell align="right">Khách hàng</TableCell>
              <TableCell align="right">Địa chỉ giao hàng</TableCell>
              <TableCell align="left">Sản phẩm</TableCell>
              <TableCell align="left">Comm</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedOrderDelivery?.map((row, index) => (
              <TableRow
                hover
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="right">{row.partnerName}</TableCell>
                <TableCell align="right">{row.deliveryAddress}</TableCell>
                <TableCell align="left">
                  {row.deliveryDetail?.map((item) => {
                    return (
                      <Box sx={{ mb: 1 }} key={item.id}>
                        <span style={{ fontWeight: "bold", marginRight: 8 }}>
                          {item.productName}
                        </span>
                        <span
                          style={{
                            fontStyle: "italic",
                            color: "red",
                            fontWeight: "bold",
                            marginRight: 8,
                          }}
                        >
                          {item.quantity} {item.MeasName}
                        </span>
                        <span> Loại: {item.quality}</span>
                      </Box>
                    );
                  })}
                </TableCell>
                <TableCell align="left">cancel, Do it, ...</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DeliveryProcess;
