import { Box, Paper, TextField } from "@mui/material"
import { Fragment, useState } from "react"
import SelectNewsky from "@/components/select/SelectNewsky"

export const BomInputEdit = (props) => {
    const [productId, setProductId] = useState("")
    const bomInputDetail = JSON.parse(props.bomInputId);
    return (
        <Paper elevation={3}>
            <p></p>
            <Box sx={{ typography: "subtitle", m: 2 }}>{(props.action == "AddBomInput") ? "Thêm một sản phẩm đầu vào" : "Sửa chi tiết một sản phẩm đầu vào"}</Box>
            <Box sx={{ typography: "subtitle2", m: 2 }}>
                <SelectNewsky
                    lblinput="Sản phẩm đầu vào" emitParent={(id) => setProductId(id)}
                    currentItem={bomInputDetail.productId}
                    byNameStr="/product-service/product/byNameStr"
                    firstCall="/product-service/product/firstCall"
                    currentItemLink="/product-service/product/oneForSelect"
                />
            </Box>
            <Box sx={{ typography: "subtitle", m: 2 }}>
                <SelectNewsky
                    lblinput="Đơn vị tính" emitParent={(id) => setProductId(id)}
                    currentItem={bomInputDetail.measId}
                    byNameStr="/product-service/Measurement/byNameStr"
                    firstCall="/product-service/Measurement/firstCall"
                    currentItemLink="/product-service/Measurement/oneForSelect"
                />
            </Box>
            <Box sx={{ typography: "subtitle", m: 2 }}>
                <TextField
                    id="quantity"
                    fullWidth
                    variant="outlined"
                    label="Số lượng sử dụng"
                    value={bomInputDetail.quantity}
                    onChange={(event) => {
                        //Do something with this
                    }}
                />
            </Box>
        </Paper>
    )
}