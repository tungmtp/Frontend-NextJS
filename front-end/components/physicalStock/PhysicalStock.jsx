import { getData } from "@/hook/Hook";
import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function PhysicalStock(props) {
  const [physicalStock, setPhysicalStock] = useState(null);
  const [dataFromEventSource, setDataFromEventSource] = useState(null);
  //   console.log("PhysicalStock: ", physicalStock);
  useEffect(() => {
    const getPhysicalStock = async () => {
      const result = await getData(
        `/product-service/product/physicalStock/${props.productID}/${props.measID}/${props.date}`
      );
      console.log(result);
      setPhysicalStock(result);
    };
    getPhysicalStock();
    const handleNewDataFromEventSource = (event) => {
      const dataFromEventSource = event.detail;
      console.log("Received new data from eventSource: ", dataFromEventSource);
      setDataFromEventSource(dataFromEventSource);
    };

    window.addEventListener("newDataEvent", handleNewDataFromEventSource);

    return () => {
      window.removeEventListener("newDataEvent", handleNewDataFromEventSource);
    };
  }, [dataFromEventSource]);
  return <Box> {physicalStock && physicalStock[0]?.tonkho}</Box>;
}
