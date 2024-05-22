import { Box, Paper, TextField } from "@mui/material"
import { Fragment, useState } from "react"
import SelectNewsky from "@/components/select/SelectNewsky"
import { SaveDelete } from "@/components/select/SaveDelete"

export const BomOutputEdit = (props) => {
    const [bomCode, setBomCode] = useState("")
    const [productId, setProductId] = useState("")
    const [measId, setMeasId] = useState("")
    const [quantity, setQuantity] = useState(0)
    const [timeOfDelay, setTimeOfDelay] = useState(0)

    const [saveStatus, setSaveStatus] = useState(true)
    const bomOutputDetail = JSON.parse(props.bomOutputId);
    const handleSave = () => {
        alert("Save clicked")
    }
    const handleDelete = () => {
        alert("Delete clicked")
    }
    const handleCancel = () => {
        alert("Cancel clicked")
    }

    return (
        <Paper elevation={3}>
            {/* <p></p> */}
            <Box sx={{ typography: "subtitle", m: 2 }}>{(props.action == "AddBomInput") ? "Thêm một định mức" : "Sửa chi tiết một định mức"}</Box>
            <Box sx={{ m: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Tên định mức"
                    value={bomOutputDetail.bomCode}
                    onChange={(event) => {
                        //Do something with this
                    }}
                />
            </Box>
            <Box sx={{ m: 2 }}>
                <SelectNewsky
                    lblinput="Sản phẩm đầu ra" emitParent={(id) => setProductId(id)}
                    currentItem={bomOutputDetail.productId}
                    byNameStr="/product-service/product/byNameStr"
                    firstCall="/product-service/product/firstCall"
                    currentItemLink="/product-service/product/oneForSelect"
                />
            </Box>
            <Box sx={{ m: 2 }}>
                <SelectNewsky
                    lblinput="Đơn vị tính" emitParent={(id) => setMeasId(id)}
                    currentItem={bomOutputDetail.measId}
                    byNameStr="/product-service/Measurement/byNameStr"
                    firstCall="/product-service/Measurement/firstCall"
                    currentItemLink="/product-service/Measurement/oneForSelect"
                />
            </Box>
            <Box sx={{ m: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Số lượng làm ra"
                    value={bomOutputDetail.quantity}
                    onChange={(event) => {
                        setQuantity(event.target.value);
                    }}
                />
            </Box>
            <SaveDelete save={handleSave} cancel={handleCancel} delete={handleDelete} />
        </Paper>
    )
}