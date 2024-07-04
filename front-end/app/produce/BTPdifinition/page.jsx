"use client";
import SelectNewsky from "@/components/select/SelectNewsky";
import { Box, Button, Grid } from "@mui/material";
import { useEffect, useState, Fragment } from "react";
import { BomOutput } from "./BomOutput";
import { getData, asyncGetData, today } from "@/hook/Hook";
import { BomInput } from "./BomInput";
import { BomDetail } from "./BomDetail";


export default function BTPdifinition() {
  const [productId, setProductId] = useState("");
  const [defaultMeasId, setDefaultMeasId] = useState("");
  const [productDetails, setProductDetails] = useState({});
  const [bomList, setBomList] = useState([])
  const [bomOutputIDSelected, setBomOutputIDSelected] = useState("")
  const [bomInputIDSelected, setBomInputIDSelected] = useState("")
  const [action, setAction] = useState("")
  const [addButtonDisabled, setAddButtonDisabled] = useState(false)
  const [keyRendered, setKeyRendered] = useState(0)

  const getBom = async (id) => {
    if (id) {
      try {
        const result = await getData(`/produce-service/bom/product/${id}`);
        if (!result.error) {
          // console.log(result);
          console.log("Có chạy bomList");
          setBomList(result);
        }
      } catch (error) {
        console.log("error get data:", error)
      }
      asyncGetData(`/product-service/product/${id}`)
        .then(response => response.json())
        .then(data => {
          setDefaultMeasId(data.measID);
          setProductDetails({ ...data })
          console.log(data);
        })
        .catch(error => console.log("error get data:", error));

    } else { setBomList([]); }
  }

  const handProductChange = (id) => {
    setProductId(id);
    setAction("Nothing")
  }

  const handleInOutAction = (action) => {
    setAction("Nothing")
    if (action !== "Cancel") {
      setKeyRendered(keyRendered => keyRendered + 1)
    }
  }

  useEffect(() => {
    getBom(productId);
  }, [productId, keyRendered])

  useEffect(() => {
    if (bomList && bomList.length > 0) {
      setAddButtonDisabled(true)
    } else { setAddButtonDisabled(false) }
  }, [bomList])

  return (
    <Grid container spacing={0.5}>
      <Grid item xs={8}>
        <SelectNewsky
          lblinput="Sản phẩm cần tạo định mức (Gõ vài ký tự đại diện của SP cần chọn)" emitParent={handProductChange}
          // currentItem="8ffc32c9-0d0e-4138-a30f-0514e11d5ea3"
          // returnObject={true}
          byNameStr="/product-service/product/byNameStr/bom"
          firstCall="/product-service/product/firstCall/bom"
          currentItemLink="/product-service/product/oneForSelect"
        />
      </Grid>
      <Grid item xs={4} sx={{ m: 0 }}>
        <Button disabled={addButtonDisabled} variant="contained" color="primary" onClick={() => { setBomOutputIDSelected(""); setAction("AddBomOutput") }}>Add</Button>
        <Button disabled={bomList && !bomList.length} variant="contained" color="primary" sx={{ ml: 2 }}>Clone</Button>
        {/* <Button variant="contained" color="primary" sx={{ ml: 2 }}>Map</Button> */}
        <a href={`/produce/BTPdifinition/extract?productId=${productId}&&measId=${defaultMeasId}&&qty=100&&reqDate=${today()}`}
          target="_blank">
          <Button variant="contained" color="primary" sx={{ ml: 2 }}>Map</Button>
        </a>
      </Grid>
      <Grid item xs={7}>
        {bomList.map((bom, index) => (
          <Fragment key={index}>
            <BomOutput key={bom.id} bom={bom} emitParent={(id, emitAct) => { setBomOutputIDSelected(id); setAction(emitAct); }} keyRendered={keyRendered} />
            <BomInput bomId={bom.id} emitParent={(id, emitAct) => { setBomInputIDSelected(id); setAction(emitAct); }} keyRendered={keyRendered} />
          </Fragment>
        ))}
      </Grid>
      <Grid item xs={5}>
        <BomDetail action={action} bomInputId={bomInputIDSelected} bomOutputId={bomOutputIDSelected} selectedProductId={productId}
          measIdForAddBOM={defaultMeasId}
          segmentIdForAddBOM={productDetails.segmentID}
          productNameForAddBOM={productDetails.nameStr}
          emitParent={handleInOutAction} />
      </Grid>
    </Grid>
  );
}