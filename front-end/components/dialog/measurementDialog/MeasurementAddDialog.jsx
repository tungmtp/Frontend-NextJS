import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import FolderOpenTwoToneIcon from "@mui/icons-material/FolderOpenTwoTone";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { deleteData, getData, postData, putData } from "@/hook/Hook";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
const measureCategory = {
  1: "Diện tích",
  2: "Chiều dài",
  3: "Khối lượng",
  4: "Đơn lẻ (unit)",
  5: "Thể tích",
};

const getMeasCateName = (selectedButtonGroup) => {
  return measureCategory[selectedButtonGroup];
};
export default function MeasurementAddDialog(Props) {
  const [measurementData, setMeasurementData] = useState([]);
  const [selectedMeasCate, setSelectedMeasCate] = useState(1);
  const [rateInRoot, setRateInRoot] = useState("");
  useEffect(() => {
    const getMeasurementData = async () => {
      try {
        const result = await getData("/product-service/Measurement");
        const resultWithIndex = result.map((row, index) => ({
          ...row,
          index: index + 1,
        }));
        setMeasurementData(resultWithIndex);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getMeasurementData();
    console.log("rendering again");
  }, []);
  const handleChange = (event) => {
    setSelectedMeasCate(event.target.value);
  };

  const getRootMeas = measurementData.filter(
    (measurement) =>
      measurement.isRoot === true &&
      measurement.measCatId === Number(selectedMeasCate)
  );

  console.log("getRootMeas", getRootMeas);
  const calculateRateInRootChange = (event) => {
    event.preventDefault();
    const length = document.querySelector('input[name="length"]').value;
    const width = document.querySelector('input[name="width"]').value;
    const height = document.querySelector('input[name="height"]').value;
    const upc = document.querySelector('input[name="upc"]').value;
    console.log("lenght:", length);
    console.log("selectedMeasCate:", selectedMeasCate);
    switch (selectedMeasCate) {
      case 1:
        {
          return setRateInRoot(
            (length * width * upc) /
              (getRootMeas[0].length * getRootMeas[0].width)
          );
        }
        break;
      case 2:
        {
          return setRateInRoot((length * upc) / getRootMeas[0].length);
        }
        break;
      case 3:
        {
          return 0;
        }
        break;
      case 4:
        {
          return 0;
        }
        break;
      case 5:
        {
          return setRateInRoot(
            (length * width * height * upc) /
              (getRootMeas[0].length *
                getRootMeas[0].width *
                getRootMeas[0].height)
          );
        }
        break;
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={Props.open}
        onClose={Props.handleCloseAddDialog}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const measName = formJson.measName;
            const length = formJson.length;
            const width = formJson.width;
            const height = formJson.height;
            // const rateInRoot = formJson.rateInRoot;
            const upc = formJson.upc;
            const isRoot = formJson.isRoot ? true : false;

            const addMeasurement = {
              measCatId: selectedMeasCate,
              measName: measName,
              length: Number(length),
              width: Number(width),
              height: Number(height),
              rateInRoot: Number(rateInRoot),
              upc: Number(upc),
              isRoot: isRoot,
            };

            const postMeasurement = async () => {
              try {
                const result = await postData(
                  "/product-service/Measurement",
                  addMeasurement
                );
                // const addMeasurement2 = {
                //   length: result.length,
                //   measName: result.measName,
                //   measCatId: result.measCatId,
                //   width: result.width,
                //   height: result.height,
                //   rateInRoot: result.rateInRoot,
                //   isRoot: result.isRoot,
                //   id: result.id,
                //   upc: result.upc,
                //   index: 78,
                // };
                const addMeasurement2 = result;

                console.log(addMeasurement2);

                // setMeasurementData((prevState) => [
                //   ...prevState,
                //   addMeasurement2,
                // ]);
              } catch (err) {
                console.error("Error fetching data:", err);
              }
            };
            postMeasurement();

            Props.handleCloseAddDialog(event);
            //window.location.reload(false);
          },
        }}
      >
        <DialogTitle>
          Thêm đơn vị tính: {getMeasCateName(selectedMeasCate)}
        </DialogTitle>
        <DialogContent>
          <FormControl sx={{ width: "223px", margin: 2 }}>
            <InputLabel id="measure-category-select-label">
              Chọn đơn vị tính
            </InputLabel>
            <Select
              labelId="measure-category-select-label"
              value={selectedMeasCate}
              onChange={handleChange}
              label="Chọn đơn vị tính"
              sx={{ width: "223px" }}
            >
              {Object.entries(measureCategory).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            name="measName"
            variant="outlined"
            label="Đơn vị tính"
            required
            sx={{ margin: 2 }}
          />
          <TextField
            name="length"
            variant="outlined"
            label="Chiều dài (mm)"
            sx={{ margin: 2 }}
            onChange={calculateRateInRootChange}
          />
          <TextField
            name="width"
            variant="outlined"
            label="Chiều rộng (mm)"
            sx={{ margin: 2 }}
            onChange={calculateRateInRootChange}
          />
          <TextField
            name="height"
            variant="outlined"
            label="Chiều cao (mm)"
            sx={{ margin: 2 }}
            onChange={calculateRateInRootChange}
          />
          {selectedMeasCate !== 4 && (
            <TextField
              name="rateInRoot"
              variant="outlined"
              label="Tỉ lệ so với đơn vị gốc"
              value={rateInRoot}
              onChange={(event) => setRateInRoot(event.target.value)}
              sx={{ margin: 2 }}
            />
          )}
          <TextField
            name="upc"
            variant="outlined"
            label="Đóng gói"
            sx={{ margin: 2 }}
            onChange={calculateRateInRootChange}
          />
          <FormControlLabel
            control={<Checkbox name="isRoot" />}
            label="Là đơn vị gốc "
            sx={{ marginTop: 2, marginX: 4 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={Props.handleCloseAddDialog}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
