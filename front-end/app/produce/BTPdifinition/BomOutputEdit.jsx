import { Box, Paper, TextField } from "@mui/material"
import { Fragment, useState } from "react"
import SelectNewsky from "@/components/select/SelectNewsky"
import { SaveDelete } from "@/components/select/SaveDelete"

export const BomOutputEdit = (props) => {
    const [bomCode, setBomCode] = useState("")
    const [productId, setProductId] = useState("")
    const [measId, setMeasId] = useState("")
    const [segmentId, setSegmentId] = useState("")
    const [quantity, setQuantity] = useState(0)
    const [timeOfDelay, setTimeOfDelay] = useState(0)

    const [saveStatus, setSaveStatus] = useState(true)
    const bomOutputDetail = JSON.parse(props.bomOutputId);
    const handleSave = () => {
        const data = {}
        data.bomCode = bomCode;
        data.productId = productId;
        data.measId = measId;
        data.quantity = quantity;
        data.timeOfDelay = timeOfDelay;
        data.segmentId = segmentId;
        // alert("Save clicked")
        const respone = putData(
            "/produce-service/bom",
            bomOutputDetail.id,
            data
        );
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
                    name="bomCode"
                    fullWidth
                    variant="outlined"
                    label="Tên định mức"
                    defaultValue={bomOutputDetail.bomCode}
                    onChange={(event) => {
                        setBomCode(event.target.value);
                    }}
                />
            </Box>
            <Box sx={{ m: 2 }}>
                <SelectNewsky
                    lblinput="Công đoạn sản xuất" emitParent={(id) => setSegmentId(id)}
                    currentItem={bomOutputDetail.segmentId}
                    byNameStr="/produce-service/segment/byNameStr"
                    firstCall="/produce-service/segment/firstCall"
                    currentItemLink="/produce-service/segment/oneForSelect"
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
                    defaultValue={bomOutputDetail.quantity}
                    onChange={(event) => {
                        setQuantity(event.target.value);
                    }}
                />
            </Box>
            <Box sx={{ m: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Thời gian xử lý (ngày)"
                    defaultValue={bomOutputDetail.timeOfDelay}
                    onChange={(event) => {
                        event.preventDefault();
                        setTimeOfDelay(event.target.value);
                    }}
                />
            </Box>
            <SaveDelete save={handleSave} cancel={handleCancel} delete={handleDelete} />
        </Paper>
    )
}