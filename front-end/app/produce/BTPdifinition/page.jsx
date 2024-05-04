"use client";
import React from "react";
import SelectProduct from "@/components/select/SelectProduct";

export default function BTPdifinition() {
  return <SelectProduct
    lblinput="Sản phẩm cần tạo định mức"
    emitParent={(id) => console.log("Có gọi lại ID: " + id)}
    currentProduct="c73aacac-5528-4eea-b81e-1a6ab17bec0e"
  />;
}
