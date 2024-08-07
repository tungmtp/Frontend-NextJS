import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { getData } from "@/hook/Hook";
import SelectQuality from "../select/SelectQuality";
import SelectNewsky from "../select/SelectNewsky";

export default function OrderDetail(Props) {
  const [selectedOrderDetail, setSelectedOrderDetail] = useState({
    curency: "VND",
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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography
          sx={{
            fontSize: "18px",
            color: "#1976d2",
            fontWeight: "BOLD",
          }}
        >
          Chi tiết đơn hàng
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
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
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <SelectQuality
          getValue={(quality) => {
            const updatedSelectedOrderDetail = {
              ...selectedOrderDetail, // Copy existing attributes
              quality: quality, // Set or update the ProductID attribute
            };
            setSelectedOrderDetail(updatedSelectedOrderDetail);
          }}
          currentQuality={selectedOrderDetail.quality}
          disableStyle={true}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <TextField
          fullWidth
          id=""
          label="Sản lượng bán ra"
          size="small"
          type="number"
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
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
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
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <TextField
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          id=""
          label="Đơn vị gốc"
          size="small"
          value={
            seLectedMeasurement?.measCatId
              ? measureCategory[seLectedMeasurement.measCatId]
              : ""
          }
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <TextField
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          id=""
          label="SL quy đổi"
          size="small"
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
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <TextField
          fullWidth
          id=""
          label="Loại tiền"
          size="small"
          value={selectedOrderDetail?.curency}
          onChange={(event) => {
            const updatedSelectedOrderDetail = { ...selectedOrderDetail };
            updatedSelectedOrderDetail.curency = event.target.value;
            // console.log(event.target.value);
            setSelectedOrderDetail(updatedSelectedOrderDetail);
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <TextField
          fullWidth
          id=""
          label="Tỉ giá"
          size="small"
          type="number"
          value={selectedOrderDetail?.rate}
          onChange={(event) => {
            const updatedSelectedOrderDetail = { ...selectedOrderDetail };
            updatedSelectedOrderDetail.rate = Number(event.target.value);
            // console.log(event.target.value);
            setSelectedOrderDetail(updatedSelectedOrderDetail);
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <TextField
          fullWidth
          id=""
          label="Giá bán"
          size="small"
          type="number"
          value={selectedOrderDetail?.price}
          onChange={(event) => {
            const updatedSelectedOrderDetail = { ...selectedOrderDetail };
            updatedSelectedOrderDetail.price = Number(event.target.value);
            // console.log(event.target.value);
            setSelectedOrderDetail(updatedSelectedOrderDetail);
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <TextField
          fullWidth
          id=""
          label="Mã thuế"
          size="small"
          type="number"
          value={selectedOrderDetail?.importTax}
          onChange={(event) => {
            const updatedSelectedOrderDetail = { ...selectedOrderDetail };
            updatedSelectedOrderDetail.importTax = Number(event.target.value);
            // console.log(event.target.value);
            setSelectedOrderDetail(updatedSelectedOrderDetail);
          }}
        />
      </Grid>
    </Grid>
  );
}
