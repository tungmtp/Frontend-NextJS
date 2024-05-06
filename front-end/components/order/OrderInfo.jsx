import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import Link from "next/link";
import Divider from "@mui/material/Divider";
export default function OrderInfo({}) {
  return (
    <Box sx={{}}>
      <Divider variant="middle" />
      <Box my={1} sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="subtitle1">
          Order No. <Link href="">15315</Link>
        </Typography>
        <Typography variant="subtitle1">Ngày ký: 06/03/2024</Typography>
        <Typography variant="subtitle1">
          Ngày giao hàng đầu tiên: 06/03/2024
        </Typography>
      </Box>
      <Divider variant="middle" />
      <Typography variant="h6" sx={{ my: 1 }}>
        Khách hàng: <Link href="">KIÊN CẤP MẪU</Link>
      </Typography>
    </Box>
  );
}
