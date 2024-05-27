"use client";
import SelectNewsky from "@/components/select/SelectNewsky";
import { Box, Button, Grid } from "@mui/material";
import { useEffect, useState, Fragment } from "react";
import { BomOutput } from "./BomOutput";
import { getData, asyncGetData } from "@/hook/Hook";
import { BomInput } from "./BomInput";
import { BomDetail } from "./BomDetail";


export default function BTPdifinition() {
  const [productId, setProductId] = useState("");
  const [bomList, setBomList] = useState([])
  const [bomOutputIDSelected, setBomOutputIDSelected] = useState("")
  const [bomInputIDSelected, setBomInputIDSelected] = useState("")
  const [action, setAction] = useState("")
  const [addButtonDisabled, setAddButtonDisabled] = useState(false)

  const getBom = async (id) => {
    if (id) {
      try {
        const result = await getData(`/produce-service/bom/product/${id}`);
        if (!result.error) {
          // console.log(result);
          setBomList(result);
        }
      } catch (error) {
        console.log("error get data:", error)
      }
      asyncGetData(`/product-service/product/${id}`)
        .then(response => response.json())
        .then(data => console.log(data));
    } else { setBomList([]); }
  }

  const handProductChange = (id) => {
    setProductId(id);
    setAction("Nothing")
  }

  useEffect(() => {
    getBom(productId);
  }, [productId])

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
        <Button variant="contained" color="primary" sx={{ ml: 2 }}>Map</Button>
      </Grid>
      <Grid item xs={7}>
        {bomList.map((bom, index) => (
          <Fragment key={index}>
            <BomOutput key={bom.id} bom={bom} emitParent={(id, emitAct) => { setBomOutputIDSelected(id); setAction(emitAct); }} />
            <BomInput bomId={bom.id} emitParent={(id, emitAct) => { setBomInputIDSelected(id); setAction(emitAct); }} />
          </Fragment>
        ))}
      </Grid>
      <Grid item xs={5}>
        <BomDetail action={action} bomInputId={bomInputIDSelected} bomOutputId={bomOutputIDSelected} selectedProductId={productId} />
      </Grid>
    </Grid>
  );
}