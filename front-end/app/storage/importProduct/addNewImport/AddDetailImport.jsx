import SelectNewsky from "@/components/select/SelectNewsky";
import SelectQuality from "@/components/select/SelectQuality";
import { getData, postData } from "@/hook/Hook";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
export default function AddDetailImport(props) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [stockinDetail, setStockinDetail] = useState({
    stockInID: "",
    productID: "",
    measID: "",
    quality: 1,
    quantity: 0,
    relatedTable: "",
    relatedID: "",
    createdBy: props.stockin.createdBy,
    createdOn: props.stockin.createdOn,
    price: 0,
    vat: 0,
    importTax: 0,
    currency: "VND",
  });
  const [seLectedMeasurement, setSeLectedMeasurement] = useState(null);
  const fetchMeasurementByProductID = useCallback(async (id) => {
    try {
      const response = await getData(
        `/product-service/product/oneForSelect/mayBeSell/${id}`
      );
      setSeLectedMeasurement(response[0]);
      console.log(response[0]);
      const updatedStockinDetail = { ...stockinDetail };
      updatedStockinDetail.productID = id;
      updatedStockinDetail.measID = response[0].measID;
      setStockinDetail(updatedStockinDetail);
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

    console.log("stockin:  ", props.stockin);
    console.log("stockinDetail:  ", stockinDetail);

    const postStockIn = async () => {
      try {
        const result = await postData(
          "/product-service/stockIn",
          props.stockin
        );
        stockinDetail.stockInID = result.id;
        console.log("stockin:  ", props.stockin);
        console.log("stockinDetail:  ", stockinDetail);
        const result2 = await postData(
          "/product-service/stockInDetail",
          stockinDetail
        );
        NotifySnackbar(enqueueSnackbar, "Thêm thành công", "success");
        router.push("/storage/importProduct");
      } catch (err) {
        console.error("Error post ordersProduce :", err);
        NotifySnackbar(enqueueSnackbar, "Có lỗi xảy ra!!", "error");
      }
    };
    postStockIn();
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h6">Thêm mặt hàng:</Typography>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <SelectNewsky
          lblinput="Sản phẩm"
          emitParent={(id) => {
            // console.log("Selected Product: ", id);
            // const updatedStockinDetail = {
            //   ...stockinDetail, // Copy existing attributes
            //   productID: id, // Set or update the ProductID attribute
            // };
            // setStockinDetail(updatedStockinDetail);
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
              ...stockinDetail, // Copy existing attributes
              quality: quality, // Set or update the ProductID attribute
            };
            setStockinDetail(updatedStockinDetail);
          }}
          currentQuality={stockinDetail.quality}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <TextField
          fullWidth
          id=""
          label="Sản lượng nhập vào"
          size="small"
          type="number"
          //   sx={{ marginTop: 2, width: "300px", marginLeft: 5 }}
          value={stockinDetail?.quantity}
          onChange={(event) => {
            // console.log(seLectedMeasurement.rateInRoot);
            const updatedStockinDetail = { ...stockinDetail };
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
            setStockinDetail(updatedStockinDetail);
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <SelectNewsky
          lblinput="Đơn vị tính"
          emitParent={(id) => {
            // console.log("Selected Measurement: ", id);
            const updatedStockinDetail = { ...stockinDetail };
            updatedStockinDetail.measID = id;
            setStockinDetail(updatedStockinDetail);
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
                  stockinDetail.quantity,
                  seLectedMeasurement?.rateInRoot
                )
              : ""
          }
          onChange={(event) => {
            // const updatedStockinDetail = { ...stockinDetail };
            // updatedStockinDetail.rate = Number(event.target.value);
            // console.log(event.target.value);
            // setStockinDetail(updatedStockinDetail);
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
          value={stockinDetail?.price}
          onChange={(event) => {
            const updatedStockinDetail = { ...stockinDetail };
            updatedStockinDetail.price = Number(event.target.value);
            // console.log(event.target.value);
            setStockinDetail(updatedStockinDetail);
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <TextField
          id=""
          label="Loại tiền"
          size="small"
          fullWidth
          value={stockinDetail?.currency}
          onChange={(event) => {
            const updatedStockinDetail = { ...stockinDetail };
            updatedStockinDetail.currency = event.target.value;
            // console.log(event.target.value);
            setStockinDetail(updatedStockinDetail);
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
          value={stockinDetail?.importTax}
          onChange={(event) => {
            const updatedStockinDetail = { ...stockinDetail };
            updatedStockinDetail.importTax = Number(event.target.value);
            // console.log(event.target.value);
            setStockinDetail(updatedStockinDetail);
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
          value={stockinDetail?.vat}
          onChange={(event) => {
            const updatedStockinDetail = { ...stockinDetail };
            updatedStockinDetail.vat = Number(event.target.value);
            // console.log(event.target.value);
            setStockinDetail(updatedStockinDetail);
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
          <Link href="/storage/importProduct">
            <Button variant="outlined">Cancel</Button>
          </Link>
        </Box>
      </Grid>
    </Grid>
  );
}
