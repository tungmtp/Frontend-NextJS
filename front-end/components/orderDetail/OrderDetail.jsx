import React, { useEffect, useState, useCallback, useMemo } from "react";
import SelectProduct from "../select/SelectProduct";
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
import SelectQuality from "../select/SelectQuality";
import SelectNewsky from "../select/SelectNewsky";
import { idID } from "@mui/material/locale";
import SelectMeasCate from "../select/SelectMeasCate";

export default function OrderDetail(Props) {
  const [selectedOrderDetail, setSelectedOrderDetail] = useState({
    curency: "",
    importTax: "",
    measID: "",
    orderID: "",
    price: 0,
    productID: "",
    quantity: 0,
    quality: 1,
    rate: 0,
  });
  // const [measurementData, setMeasurementData] = useState([]);
  const [seLectedMeasurement, setSeLectedMeasurement] = useState("");
  const style = { marginTop: 2, width: "640px", marginLeft: 5 };
  const style1 = { marginTop: 2, width: "301px", marginLeft: 5 };
  // console.log(selectedOrderDetail);
  useEffect(() => {
    Props.setOrderDetail(selectedOrderDetail);
  }, [selectedOrderDetail]);
  const fetchMeasurementByProductID = useCallback(async (id) => {
    try {
      const response = await getData(
        `/product-service/product/oneForSelect/mayBeSell/${id}`
      );
      setSeLectedMeasurement(response[0]);
      const updatedSelectedOrderDetail = { ...selectedOrderDetail };
      updatedSelectedOrderDetail.productID = id;
      updatedSelectedOrderDetail.measID = response[0].measID;
      setSelectedOrderDetail(updatedSelectedOrderDetail);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  const memoizedFetchMeasurementByProductID = useMemo(
    () => fetchMeasurementByProductID,
    [fetchMeasurementByProductID]
  );

  const calculateQualityRate = (itemQuanlity, rateInRoot) => {
    if (rateInRoot == 0) {
      return itemQuanlity;
    } else {
      return rateInRoot * itemQuanlity;
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <Box>
        {/* <SelectProduct
          lblinput="Sản phẩm cần tạo đơn hàng"
          emitParent={(id) => {
            const updatedSelectedOrderDetail = {
              ...selectedOrderDetail, // Copy existing attributes
              ProductID: id, // Set or update the ProductID attribute
            };
            setSelectedOrderDetail(updatedSelectedOrderDetail);
            memoizedFetchMeasurementByProductID(id);
          }}
          currentProduct={selectedOrderDetail.productID}
        /> */}
        <SelectNewsky
          lblinput="Sản phẩm"
          emitParent={(id) => {
            // console.log("Selected Product: ", id);
            // const updatedSelectedOrderDetail = {
            //   ...selectedOrderDetail, // Copy existing attributes
            //   productID: id, // Set or update the ProductID attribute
            // };
            // setSelectedOrderDetail(updatedSelectedOrderDetail);
            memoizedFetchMeasurementByProductID(id);
          }}
          byNameStr="/product-service/product/byNameStr/mayBeSell"
          firstCall="/product-service/product/firstCall/mayBeSell"
          currentItemLink="/product-service/product/oneForSelect"
          style={style}
        />
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
      <SelectQuality
        getValue={(quality) => {
          const updatedSelectedOrderDetail = {
            ...selectedOrderDetail, // Copy existing attributes
            quality: quality, // Set or update the ProductID attribute
          };
          setSelectedOrderDetail(updatedSelectedOrderDetail);
        }}
        currentQuality={selectedOrderDetail.quality}
      />
      <TextField
        id=""
        label="Sản lượng bán ra"
        size="small"
        type="number"
        sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
        value={selectedOrderDetail?.quantity}
        onChange={(event) => {
          // console.log(seLectedMeasurement.rateInRoot);
          const updatedSelectedOrderDetail = { ...selectedOrderDetail };
          updatedSelectedOrderDetail.quantity = Number(event.target.value);
          if (seLectedMeasurement.rateInRoot !== undefined) {
            updatedSelectedOrderDetail.rate = Number(
              calculateQualityRate(
                event.target.value,
                seLectedMeasurement.rateInRoot
              )
            );
          }
          setSelectedOrderDetail(updatedSelectedOrderDetail);
        }}
      />

      {/* <Autocomplete
        size="small"
        disablePortal
        id=""
        getOptionLabel={(option) => option.measName || ""}
        options={[seLectedMeasurement]}
        sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
        renderInput={(params) => <TextField {...params} label="DVT gốc" />}
        value={seLectedMeasurement}
        onChange={(event, value) => {
          if (value) {
            const updatedSelectedOrderDetail = { ...selectedOrderDetail };
            updatedSelectedOrderDetail.measID = value.id;
            setSelectedOrderDetail(updatedSelectedOrderDetail);
          }
        }}
      /> */}
      <SelectNewsky
        lblinput="Đơn vị tính"
        emitParent={(id) => {
          // console.log("Selected Measurement: ", id);
          const updatedSelectedOrderDetail = { ...selectedOrderDetail };
          updatedSelectedOrderDetail.measID = id;
          setSelectedOrderDetail(updatedSelectedOrderDetail);
        }}
        currentItem={seLectedMeasurement?.measID}
        byNameStr="/product-service/Measurement/byNameStr"
        firstCall="/product-service/Measurement/firstCall"
        currentItemLink="/product-service/Measurement/oneForSelect"
        style={style1}
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
      {/* <SelectMeasCate
        getValue={(quality) => {}}
        currentQuality={selectedOrderDetail.quality}
      /> */}
      <TextField
        id=""
        label="SL quy đổi"
        size="small"
        sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
        value={selectedOrderDetail.rate}
        onChange={(event) => {
          const updatedSelectedOrderDetail = { ...selectedOrderDetail };
          updatedSelectedOrderDetail.rate = Number(event.target.value);
          // console.log(event.target.value);
          setSelectedOrderDetail(updatedSelectedOrderDetail);
        }}
      />
      <TextField
        id=""
        label="Giá bán"
        size="small"
        sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
        type="number"
        value={selectedOrderDetail?.price}
        onChange={(event) => {
          const updatedSelectedOrderDetail = { ...selectedOrderDetail };
          updatedSelectedOrderDetail.price = Number(event.target.value);
          // console.log(event.target.value);
          setSelectedOrderDetail(updatedSelectedOrderDetail);
        }}
      />
    </Box>
  );
}
