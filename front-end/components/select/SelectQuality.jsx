import React, { useState } from "react";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";

export default function SelectQuality(Props) {
  const handleChange = (event) => {
    Props.getValue(event.target.value);
  };

  return (
    <FormControl
      label="Cấp phẩm chất"
      sx={
        Props.disableStyle
          ? { width: "100%" }
          : { marginTop: 2, width: "300px", marginLeft: 5 }
      }
    >
      <InputLabel>Cấp phẩm chất</InputLabel>
      <Select
        value={Props.currentQuality}
        onChange={handleChange}
        displayEmpty
        label="Cấp phẩm chất"
      >
        <MenuItem value={1}>Loại 1</MenuItem>
        <MenuItem value={2}>Loại 2</MenuItem>
        <MenuItem value={3}>Loại 3</MenuItem>
      </Select>
    </FormControl>
  );
}
