import SelectNewsky from "@/components/select/SelectNewsky";
import SelectQuality from "@/components/select/SelectQuality";
import { getData, postData } from "@/hook/Hook";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { Dialog } from "@mui/material";

export default function AddProductToTableDialog(props) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [stockoutDetail, setStockoutDetail] = useState({
    stockOutID: "",
    productID: "",
    measID: "",
    quality: 1,
    quantity: 0,
    relatedTable: "",
    relatedID: "",
    createdBy: props.stockout?.createdBy,
    createdOn: props.stockout?.createdOn,
    price: 0,
    vat: 0,
    importTax: 0,
    currency: "VND",
  });
  //   console.log("ADDstockoutDetail: ", stockoutDetail);
  const [seLectedMeasurement, setSeLectedMeasurement] = useState(null);
  //   useEffect(() => {
  //     setStockoutDetail({
  //       stockInID: props.stockin?.id,
  //       productID: "",
  //       measID: "",
  //       quality: 1,
  //       quantity: 0,
  //       relatedTable: "",
  //       relatedID: "",
  //       createdBy: props.stockin?.createdBy,
  //       createdOn: props.stockin?.createdOn,
  //       price: 0,
  //       vat: 0,
  //       importTax: 0,
  //       currency: "VND",
  //     });
  //   }, [props.stockin]);
  const fetchMeasurementByProductID = useCallback(async (id) => {
    try {
      const response = await getData(
        `/product-service/product/oneForSelect/mayBeSell/${id}`
      );
      setSeLectedMeasurement(response[0]);
      console.log(response[0]);
      const updatedStockinDetail = { ...stockoutDetail };
      updatedStockinDetail.productID = id;
      updatedStockinDetail.measID = response[0].measID;
      setStockoutDetail(updatedStockinDetail);
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
  const handleSubmit = (event) => {
    event.preventDefault();
    const addProductToTable = async () => {
      try {
        const productResult = await getData(
          `/product-service/product/oneForSelect/mayBeSell/${stockoutDetail.productID}`
        );
        // console.log(productResult);
        stockoutDetail.index = props.arrayLength + 1;
        stockoutDetail.nameStr = productResult[0].nameStr;
        stockoutDetail.measName = productResult[0].measName;
        props.setRows((prevState) => [...prevState, stockoutDetail]);

        NotifySnackbar(enqueueSnackbar, "Thêm thành công", "success");
        props.handleClose();
      } catch (err) {
        console.error("Error post ordersProduce :", err);
        NotifySnackbar(enqueueSnackbar, "Có lỗi xảy ra!!", "error");
      }
    };
    addProductToTable();
  };
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      fullWidth
      maxWidth={"lg"}
    >
      <Grid
        container
        spacing={2}
        sx={{
          padding: 4,
        }}
      >
        <Grid item xs={12}>
          <Typography variant="h6">Thêm mặt hàng:</Typography>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <SelectNewsky
            lblinput="Sản phẩm"
            emitParent={(id) => {
              // console.log("Selected Product: ", id);
              // const updatedStockinDetail = {
              //   ...stockoutDetail, // Copy existing attributes
              //   productID: id, // Set or update the ProductID attribute
              // };
              // setStockoutDetail(updatedStockinDetail);
              memoizedFetchMeasurementByProductID(id);
            }}
            byNameStr="/product-service/product/byNameStr/mayBeSell"
            firstCall="/product-service/product/firstCall/mayBeSell"
            currentItemLink="/product-service/product/oneForSelect"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <SelectQuality
            disableStyle={true}
            getValue={(quality) => {
              const updatedStockinDetail = {
                ...stockoutDetail, // Copy existing attributes
                quality: quality, // Set or update the ProductID attribute
              };
              setStockoutDetail(updatedStockinDetail);
            }}
            currentQuality={stockoutDetail.quality}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <TextField
            fullWidth
            id=""
            label="Sản lượng xuất ra"
            size="small"
            type="number"
            //   sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
            value={stockoutDetail?.quantity}
            onChange={(event) => {
              // console.log(seLectedMeasurement.rateInRoot);
              const updatedStockinDetail = { ...stockoutDetail };
              updatedStockinDetail.quantity = Number(event.target.value);
              //cập nhật calculate theo sản lượng bán ra
              // if (seLectedMeasurement.rateInRoot !== undefined) {
              //   updatedStockinDetail.rate = Number(
              //     calculateQualityRate(
              //       event.target.value,
              //       seLectedMeasurement.rateInRoot
              //     )
              //   );
              // }
              setStockoutDetail(updatedStockinDetail);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <SelectNewsky
            lblinput="Đơn vị tính"
            emitParent={(id) => {
              // console.log("Selected Measurement: ", id);
              const updatedStockinDetail = { ...stockoutDetail };
              updatedStockinDetail.measID = id;
              setStockoutDetail(updatedStockinDetail);
            }}
            currentItem={seLectedMeasurement?.measID}
            byNameStr="/product-service/Measurement/byNameStr"
            firstCall="/product-service/Measurement/firstCall"
            currentItemLink="/product-service/Measurement/oneForSelect"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <TextField
            InputProps={{
              readOnly: true,
            }}
            id=""
            label="SL quy đổi"
            size="small"
            fullWidth
            value={
              seLectedMeasurement?.rateInRoot
                ? calculateQualityRate(
                    stockoutDetail.quantity,
                    seLectedMeasurement?.rateInRoot
                  )
                : ""
            }
            onChange={(event) => {
              // const updatedStockinDetail = { ...stockoutDetail };
              // updatedStockinDetail.rate = Number(event.target.value);
              // console.log(event.target.value);
              // setStockoutDetail(updatedStockinDetail);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <TextField
            id=""
            label="Giá nhập"
            size="small"
            fullWidth
            type="number"
            value={stockoutDetail?.price}
            onChange={(event) => {
              const updatedStockinDetail = { ...stockoutDetail };
              updatedStockinDetail.price = Number(event.target.value);
              // console.log(event.target.value);
              setStockoutDetail(updatedStockinDetail);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <TextField
            id=""
            label="Loại tiền"
            size="small"
            fullWidth
            value={stockoutDetail?.currency}
            onChange={(event) => {
              const updatedStockinDetail = { ...stockoutDetail };
              updatedStockinDetail.currency = event.target.value;
              // console.log(event.target.value);
              setStockoutDetail(updatedStockinDetail);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <TextField
            id=""
            label="importTax"
            size="small"
            type="number"
            fullWidth
            value={stockoutDetail?.importTax}
            onChange={(event) => {
              const updatedStockinDetail = { ...stockoutDetail };
              updatedStockinDetail.importTax = Number(event.target.value);
              // console.log(event.target.value);
              setStockoutDetail(updatedStockinDetail);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <TextField
            id=""
            label="VAT"
            size="small"
            type="number"
            fullWidth
            value={stockoutDetail?.vat}
            onChange={(event) => {
              const updatedStockinDetail = { ...stockoutDetail };
              updatedStockinDetail.vat = Number(event.target.value);
              // console.log(event.target.value);
              setStockoutDetail(updatedStockinDetail);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Box mt={2} display="flex" justifyContent="flex-start">
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              onClick={handleSubmit}
            >
              Save
            </Button>

            <Button variant="outlined" onClick={props.handleClose}>
              Cancel
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
}
