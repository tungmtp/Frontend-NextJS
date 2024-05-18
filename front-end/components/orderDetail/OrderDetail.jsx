import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Box, TextField } from "@mui/material";
import { getData } from "@/hook/Hook";
import SelectQuality from "../select/SelectQuality";
import SelectNewsky from "../select/SelectNewsky";

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
  const [seLectedMeasurement, setSeLectedMeasurement] = useState(null);
  const measureCategory = {
    1: "m2",
    2: "md",
    3: "kg",
    4: "",
    5: "Lít",
  };
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
      console.log(response[0]);
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
          //cập nhật calculate theo sản lượng bán ra
          // if (seLectedMeasurement.rateInRoot !== undefined) {
          //   updatedSelectedOrderDetail.rate = Number(
          //     calculateQualityRate(
          //       event.target.value,
          //       seLectedMeasurement.rateInRoot
          //     )
          //   );
          // }
          setSelectedOrderDetail(updatedSelectedOrderDetail);
        }}
      />

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

      <TextField
        InputProps={{
          readOnly: true,
        }}
        id=""
        label="Đơn vị gốc"
        size="small"
        sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
        value={
          seLectedMeasurement?.measCatId
            ? measureCategory[seLectedMeasurement.measCatId]
            : ""
        }
      />
      <TextField
        InputProps={{
          readOnly: true,
        }}
        id=""
        label="SL quy đổi"
        size="small"
        sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
        value={
          seLectedMeasurement?.rateInRoot
            ? calculateQualityRate(
                selectedOrderDetail.quantity,
                seLectedMeasurement?.rateInRoot
              )
            : ""
        }
        onChange={(event) => {
          // const updatedSelectedOrderDetail = { ...selectedOrderDetail };
          // updatedSelectedOrderDetail.rate = Number(event.target.value);
          // console.log(event.target.value);
          // setSelectedOrderDetail(updatedSelectedOrderDetail);
        }}
      />
      <TextField
        id=""
        label="Loại tiền"
        size="small"
        sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
        value={selectedOrderDetail?.curency}
        onChange={(event) => {
          const updatedSelectedOrderDetail = { ...selectedOrderDetail };
          updatedSelectedOrderDetail.curency = event.target.value;
          // console.log(event.target.value);
          setSelectedOrderDetail(updatedSelectedOrderDetail);
        }}
      />
      <TextField
        id=""
        label="Tỉ giá"
        size="small"
        sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
        type="number"
        value={selectedOrderDetail?.rate}
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
      <TextField
        id=""
        label="Mã thuế"
        size="small"
        sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
        type="number"
        value={selectedOrderDetail?.importTax}
        onChange={(event) => {
          const updatedSelectedOrderDetail = { ...selectedOrderDetail };
          updatedSelectedOrderDetail.importTax = Number(event.target.value);
          // console.log(event.target.value);
          setSelectedOrderDetail(updatedSelectedOrderDetail);
        }}
      />
    </Box>
  );
}
