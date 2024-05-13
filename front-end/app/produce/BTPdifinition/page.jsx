"use client";
import SelectNewsky from "@/components/select/SelectNewsky";
import SelectProduct from "@/components/select/SelectProduct";
import { Box } from "@mui/material";
import { useState } from "react";

export default function BTPdifinition() {
  const [currentValue, setCurrentValue] = useState("");
  console.log("Có gọi lại ID classes: " + currentValue);
  return (
    <div>
      {/* <SelectProduct
        lblinput="Sản phẩm cần tạo định mức"
        emitParent={(id) => console.log("Có gọi lại ID: " + id)}
        currentProduct="370688f3-3169-4e3b-8fe0-06a7011db05d"
      /> */}

      {/* <SelectNewsky
        lblinput="Đơn vị tính"
        emitParent={(id) => console.log("Có gọi lại ID Measurement: " + id)}
        currentItem="07B31AAD-B88D-469E-A26B-01EACE396D25"
        byNameStr="/product-service/Measurement/byNameStr"
        firstCall="/product-service/Measurement/firstCall"
        currentItemLink="/product-service/Measurement/oneForSelect"
      />
      <Box sx={{ marginTop: 3 }}> </Box>
      <SelectNewsky
        lblinput="Công đoạn sản xuất"
        emitParent={(id) => console.log("Có gọi lại ID segment: " + id)}
        currentItem="8768d44a-2d7c-4ccc-ac84-0633042dd82d"
        byNameStr="/produce-service/segment/byNameStr"
        firstCall="/produce-service/segment/firstCall"
        currentItemLink="/produce-service/segment/oneForSelect"
      />
      <Box sx={{ marginTop: 3 }}> </Box>
      <SelectNewsky
        lblinput="Đối tác"
        emitParent={(id) => console.log("Có gọi lại ID partner: " + id)}
        currentItem="571988d9-1943-40cb-90e5-00ff15419628"
        byNameStr="/business-service/partner/byNameStr"
        firstCall="/business-service/partner/firstCall"
        currentItemLink="/business-service/partner/oneForSelect"
      />
      <Box sx={{ marginTop: 3 }}> </Box>
      <SelectNewsky
        lblinput="Sản phẩm"
        emitParent={(id) => console.log("Có gọi lại ID product: " + id)}
        currentItem="8ffc32c9-0d0e-4138-a30f-0514e11d5ea3"
        byNameStr="/product-service/product/byNameStr"
        firstCall="/product-service/product/firstCall"
        currentItemLink="/product-service/product/oneForSelect"
      /> */}

      <Box sx={{ marginTop: 3 }}> </Box>
      <SelectNewsky
        lblinput="Class"
        emitParent={(id) => setCurrentValue(id)}
        byNameStr="/product-service/classes/byNameStr"
        firstCall="/product-service/classes/firstCall"
        currentItemLink="/product-service/classes/oneForSelect"
      />
    </div>
  );
}
