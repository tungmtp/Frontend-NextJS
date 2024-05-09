import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import Link from "next/link";
import Divider from "@mui/material/Divider";
import { format } from "date-fns";
import dayjs from "dayjs";
export default function OrderInfo(Props) {
  const partnerName = Props.partnerData.find(
    (item) => item.id === Props.selectedOder.partnersID
  )?.nameStr;
  return (
    <Box sx={{}}>
      <Divider variant="middle" />
      <Box my={1} sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="subtitle1">
          Order No. <Link href="">{Props.selectedOder.lotNo}</Link>
        </Typography>
        <Typography variant="subtitle1">
          Ngày ký: {dayjs(Props.selectedOder.endDate).format("DD/MM/YYYY")}{" "}
        </Typography>
        <Typography variant="subtitle1">
          Ngày giao hàng đầu tiên:{" "}
          {dayjs(Props.selectedOder.endDate).format("DD/MM/YYYY")}{" "}
        </Typography>
      </Box>
      <Divider variant="middle" />
      <Typography variant="h6" sx={{ my: 1 }}>
        Khách hàng: <Link href="">{partnerName}</Link>
      </Typography>
    </Box>
  );
}
