import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Box, Button, Dialog, TextField, Typography } from "@mui/material";
import { getData, postData } from "@/hook/Hook";
import SelectQuality from "@/components/select/SelectQuality";
import SelectNewsky from "@/components/select/SelectNewsky";
import { NotifySnackbar } from "@/components/general/notifySnackbar/NotifySnackbar";
import { useSnackbar } from "notistack";
export default function OrderDetailAddDialog(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedOrderDetail, setSelectedOrderDetail] = useState({
    currency: "VND",
    importTax: "",
    measID: "",
    orderID: props.orderID,
    price: 0,
    productID: "",
    quantity: 0,
    quality: 1,
    rate: 0,
  });
  // console.log("selectedOrderDetail: ", selectedOrderDetail);
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
  const handleSaveBtn = async () => {
    try {
      const result = await postData(
        "/business-service/orderDetail",
        selectedOrderDetail
      );
      NotifySnackbar(enqueueSnackbar, "Thêm mặt hàng thành công", "success");
      props.handleCloseAddOrderDetail();
    } catch (err) {
      console.error("Error fetching data:", err);
      NotifySnackbar(
        enqueueSnackbar,
        "Lỗi mạng! Vui lòng kiểm tra đường truyền",
        "error"
      );
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleCloseAddOrderDetail}
      maxWidth={"lg"}
    >
      <Typography
        sx={{
          fontSize: "18px",
          color: "#1976d2",
          fontWeight: "BOLD",
          marginX: "24px",
          marginTop: "24px",
        }}
      >
        Thêm sản phẩm
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Box sx={style}>
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
        <Box sx={style1}>
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
          />
        </Box>
        <TextField
          inputprops={{
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
          inputprops={{
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
              : selectedOrderDetail?.quantity
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
          value={selectedOrderDetail?.currency}
          onChange={(event) => {
            const updatedSelectedOrderDetail = { ...selectedOrderDetail };
            updatedSelectedOrderDetail.currency = event.target.value;
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

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: 6,
            width: "100%",
            position: "sticky",
            bottom: 0,
            height: "80px",
            background: "rgb(239,239,239,0.8)",
            marginTop: "16px",
          }}
        >
          <Button
            variant="contained"
            sx={{ margin: 2 }}
            onClick={props.handleCloseAddOrderDetail}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="warning"
            variant="contained"
            sx={{ margin: 2 }}
            onClick={handleSaveBtn}
          >
            Save
          </Button>
        </div>
      </Box>
    </Dialog>
  );
}
