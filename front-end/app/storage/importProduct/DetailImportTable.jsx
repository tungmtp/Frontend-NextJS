import {
  Grid,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

export default function DetailExportTable() {
  return (
    <Grid container rowSpacing={2} columnSpacing={5}>
      <Grid item xs={12}>
        <Typography variant="h5" color={"#a94442"}>
          Nhập hàng của Thanh Thành Đạt đơn hàng số: 10129
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        ID 176140 Ngày: 25/05/2024
      </Grid>
      <Grid item xs={12} md={6}>
        Type: Bán hàng
      </Grid>
      <Grid item xs={12} md={6}>
        Kho Nhà máy Việt Á{" "}
        <span
          style={{
            color: "#c7254e",
            backgroundColor: "#f9f2f4",
            borderRadius: "4px",
          }}
        >
          Created by: nv_tam on 25/05/2024 10:59:01
        </span>
      </Grid>
      <Grid item xs={12} md={6}>
        KHÁCH LẺ
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="left">Sản phẩm</TableCell>
                <TableCell align="left">ĐVT</TableCell>
                <TableCell align="left">Chất lượng</TableCell>
                <TableCell align="left">Số lượng xuất</TableCell>
              </TableRow>
            </TableHead>
            {/* <TableBody>
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
          </TableBody> */}
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
