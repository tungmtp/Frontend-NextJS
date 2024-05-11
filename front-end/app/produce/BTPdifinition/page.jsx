"use client";
import SelectMeasurement from "@/components/select/SelectMeasurement";
import SelectProduct from "@/components/select/SelectProduct";

export default function BTPdifinition() {
  return (
    <div>
      {/* <SelectProduct
        lblinput="Sản phẩm cần tạo định mức"
        emitParent={(id) => console.log("Có gọi lại ID: " + id)}
        currentProduct="370688f3-3169-4e3b-8fe0-06a7011db05d"
      /> */}

      <SelectMeasurement
        lblinput="Đơn vị tính"
        emitParent={(id) => console.log("Có gọi lại ID Measurement: " + id)}
        currentItem="07B31AAD-B88D-469E-A26B-01EACE396D25"
        byNameStr="/product-service/Measurement/byNameStr"
        firstCall="/product-service/Measurement/firstCall"
        currentItemLink="/product-service/Measurement/oneForSelect"
      />
    </div>
  );


}
