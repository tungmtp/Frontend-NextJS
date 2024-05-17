import React, { useState } from "react";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
const measureCategory = {
  1: "Diện tích",
  2: "Chiều dài",
  3: "Khối lượng",
  4: "Đơn lẻ (unit)",
  5: "Thể tích",
};

export default function SelectMeasCate(Props) {
  const handleChange = (event) => {
    Props.getValue(event.target.value);
  };

  return (
    <FormControl
      label="Cấp phẩm chất"
      sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
    >
      <InputLabel>Cấp phẩm chất</InputLabel>
      <Select
        value={Props.currentQuality}
        onChange={handleChange}
        displayEmpty
        label="DVT quy đổi"
      >
        <MenuItem value={1}>Diện tích</MenuItem>
        <MenuItem value={2}>Chiều dài</MenuItem>
        <MenuItem value={3}>Khối lượng</MenuItem>
        <MenuItem value={4}>Đơn lẻ (unit)</MenuItem>
        <MenuItem value={5}>Thể tích</MenuItem>
      </Select>
    </FormControl>
  );
}
