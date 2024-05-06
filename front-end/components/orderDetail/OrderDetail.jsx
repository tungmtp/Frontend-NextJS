import React, { useEffect, useState } from "react";
import SelectProduct from "../select/selectProduct";
import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { getData } from "@/hook/Hook";

const quality = {
  1: "Loại 1",
  2: "Loại 2",
  3: "Loại 3",
};
const getQualityName = (selectedQuality) => {
  return quality[selectedQuality];
};

export default function OrderDetail() {
  const [selectedOrderDetail, setSelectedOrderDetail] = useState({});
  const [measurementData, setMeasurementData] = useState([]);
  useEffect(() => {
    const getMeasurementData = async () => {
      try {
        const result = await getData("/product-service/Measurement");
        const resultWithIndex = result.map((row, index) => ({
          ...row,
          index: index + 1,
          label: row.measName,
        }));
        setMeasurementData(resultWithIndex);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getMeasurementData();
    console.log("rendering again");
  }, []);
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ marginTop: 2, marginLeft: 5 }}>
        <SelectProduct />
      </Box>

      {/* <FormControl
        sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
        size="small"
      >
        <InputLabel>Cấp phẩm chất</InputLabel>
        <Select
          sx={{}}
          size="small"
          // value={selectedDataGrid?.calcType}
          label="Cấp phẩm chất"
          //   onChange={(event) => {
          //     const updatedSelectedDataGrid = { ...selectedDataGrid };
          //     updatedSelectedDataGrid.calcType = Number(event.target.value);
          //     setSelectedDataGrid(updatedSelectedDataGrid);
          //   }}
        >
          {Object.keys(quality).map((key) => (
            <MenuItem key={key} value={key}>
              {getQualityName(key)}
            </MenuItem>
          ))}
        </Select>

      </FormControl> */}

      <TextField
        id=""
        label="Sản lượng bán ra"
        size="small"
        sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
        //   value={selectedDataGrid?.comment}
        // onChange={(event) => {
        //   const updatedSelectedDataGrid = { ...selectedDataGrid };
        //   updatedSelectedDataGrid.comment = event.target.value;
        //   console.log(event.target.value);
        //   setSelectedDataGrid(updatedSelectedDataGrid);
        // }}
      />
      <Autocomplete
        disabled
        size="small"
        disablePortal
        id=""
        options={measurementData}
        sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
        renderInput={(params) => <TextField {...params} label="DVT gốc" />}
        // value={
        //   measurementData.length > 0 &&
        //   measurementData.find(
        //     (measurement) => measurement.id === selectedDataGrid.partnersID
        //   )
        //     ? partnerData.find(
        //         (partner) => partner.id === selectedDataGrid.partnersID
        //       )
        //     : ""
        // }
        // onChange={(event, value) => {
        //   if (value) {
        //     const updatedSelectedDataGrid = { ...selectedDataGrid };
        //     updatedSelectedDataGrid.partnersID = value.id;
        //     setSelectedDataGrid(updatedSelectedDataGrid);
        //   }
        // }}
        //   onChange={handleOnChange}
      />

      {/* <Autocomplete
        disabled
        disablePortal
        id=""
        size="small"
        // options={["None", ...contactData]}
        sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
        renderInput={(params) => <TextField {...params} label="DVT quy đổi" />}
        // value={
        //   contactData.length > 0 &&
        //   contactData.find(
        //     (contact) => contact.id === selectedDataGrid.contactID
        //   )
        //     ? contactData.find(
        //         (contact) => contact.id === selectedDataGrid.contactID
        //       )
        //     : ""
        // }
        // onChange={(event, value) => {
        //   if (value && value != "None") {
        //     const updatedSelectedDataGrid = { ...selectedDataGrid };
        //     updatedSelectedDataGrid.contactID = value.id;
        //     setSelectedDataGrid(updatedSelectedDataGrid);
        //   } else {
        //     const updatedSelectedDataGrid = { ...selectedDataGrid };
        //     updatedSelectedDataGrid.contactID = "";
        //     setSelectedDataGrid(updatedSelectedDataGrid);
        //   }
        // }}
      /> */}

      <TextField
        id=""
        label="SL quy đổi"
        size="small"
        sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
        //   value={selectedDataGrid?.comment}
        // onChange={(event) => {
        //   const updatedSelectedDataGrid = { ...selectedDataGrid };
        //   updatedSelectedDataGrid.comment = event.target.value;
        //   console.log(event.target.value);
        //   setSelectedDataGrid(updatedSelectedDataGrid);
        // }}
      />
      <TextField
        id=""
        label="Giá bán"
        size="small"
        sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
        //   value={selectedDataGrid?.comment}
        // onChange={(event) => {
        //   const updatedSelectedDataGrid = { ...selectedDataGrid };
        //   updatedSelectedDataGrid.comment = event.target.value;
        //   console.log(event.target.value);
        //   setSelectedDataGrid(updatedSelectedDataGrid);
        // }}
      />
    </Box>
  );
}
