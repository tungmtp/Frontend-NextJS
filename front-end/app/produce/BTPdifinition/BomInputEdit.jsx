import { Box } from "@mui/material"
import { Fragment, useState } from "react"
import SelectNewsky from "@/components/select/SelectNewsky"

export const BomInputEdit = (props) => {
    const [productId, setProductId] = useState("")
    return (
        <Fragment>
            <p></p>
            <Box sx={{ typography: "subtitle" }}>{(props.action == "AddBomInput") ? "Thêm một sản phẩm đầu vào" : "Sửa chi tiết một sản phẩm đầu vào"}</Box>
            <SelectNewsky
                lblinput="Sản phẩm đầu vào" emitParent={(id) => setProductId(id)}
                currentItem={props}
                byNameStr="/product-service/product/byNameStr/bom"
                firstCall="/product-service/product/firstCall/bom"
                currentItemLink="/product-service/product/oneForSelect"
            />
        </Fragment>
    )
}