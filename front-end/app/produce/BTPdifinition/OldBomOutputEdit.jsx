import { Box, Paper, Stack, TextField } from "@mui/material"
import { Fragment, useEffect, useState } from "react"
import SelectNewsky from "@/components/select/SelectNewsky"
import { SaveDelete } from "@/components/select/SaveDelete"
import { putData, postData } from "@/hook/Hook"

export const BomOutputEdit = (props) => {
    let bomOutputDetail
    if (props.action == "EditBomOutput") {
        try {
            bomOutputDetail = JSON.parse(props.bomOutputId);
        } catch (e) {
            console.log(e);
            bomOutputDetail = { bomCode: "", productId: "", measId: "", segmentId: "", quantity: 0, timeOfDelay: 0 }
        }
    } else {
        bomOutputDetail = { bomCode: "", productId: "", measId: "", segmentId: "", quantity: 0, timeOfDelay: 0 }
    }
    console.log(bomOutputDetail);

    const [bomCode, setBomCode] = useState(bomOutputDetail.bomCode)
    const [productId, setProductId] = useState(bomOutputDetail.productId)
    const [measId, setMeasId] = useState(bomOutputDetail.measId)
    const [segmentId, setSegmentId] = useState(bomOutputDetail.segmentId)
    const [quantity, setQuantity] = useState(bomOutputDetail.quantity)
    const [timeOfDelay, setTimeOfDelay] = useState(bomOutputDetail.timeOfDelay)

    const [saveStatus, setSaveStatus] = useState(true)

    const handleSave = () => {
        const data = {}
        data.bomCode = bomCode;
        data.productId = productId;
        data.measId = measId;
        data.quantity = quantity;
        data.timeOfDelay = timeOfDelay;
        data.segmentId = segmentId;
        // alert("Save clicked")
        if (props.action == "EditBomOutput") {
            const respone = putData(
                "/produce-service/bom",
                bomOutputDetail.id,
                data
            );
        } else {
            //Add new BOM
            const result = postData(
                "/produce-service/bom",
                data
            );
        }
    }
    const handleDelete = () => {
        alert("Delete clicked")
    }
    const handleCancel = () => {
        alert("Cancel clicked")
    }


    // useEffect(() => {
    //     if (props.action == "EditBomOutput") {
    //         try {
    //             bomOutputDetail = JSON.parse(props.bomOutputId);
    //         } catch (e) {
    //             console.log(e);
    //             bomOutputDetail = { bomCode: "", productId: "", measId: "", segmentId: "", quantity: 0, timeOfDelay: 0 }
    //         }
    //     } else {
    //         bomOutputDetail = { bomCode: "", productId: "", measId: "", segmentId: "", quantity: 0, timeOfDelay: 0 }
    //     }
    // }, [props.action, props.bomOutputId])

    return (
        <Paper elevation={3}>
            <Stack spacing={2} sx={{ p: 2 }}>
                <h3>{(props.action == "AddBomOutput") ? "Thêm một định mức" : "Sửa chi tiết một định mức"}</h3>
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
                <SelectNewsky
                    lblinput="Công đoạn sản xuất" emitParent={(id) => setSegmentId(id)}
                    currentItem={bomOutputDetail.segmentId}
                    byNameStr="/produce-service/segment/byNameStr"
                    firstCall="/produce-service/segment/firstCall"
                    currentItemLink="/produce-service/segment/oneForSelect"
                />
                <SelectNewsky
                    lblinput="Sản phẩm đầu ra" emitParent={(id) => setProductId(id)}
                    currentItem={bomOutputDetail.productId}
                    byNameStr="/product-service/product/byNameStr"
                    firstCall="/product-service/product/firstCall"
                    currentItemLink="/product-service/product/oneForSelect"
                />
                <SelectNewsky
                    lblinput="Đơn vị tính" emitParent={(id) => setMeasId(id)}
                    currentItem={bomOutputDetail.measId}
                    byNameStr="/product-service/Measurement/byNameStr"
                    firstCall="/product-service/Measurement/firstCall"
                    currentItemLink="/product-service/Measurement/oneForSelect"
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Số lượng làm ra"
                    defaultValue={bomOutputDetail.quantity}
                    onChange={(event) => {
                        setQuantity(event.target.value);
                    }}
                />
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
                <SaveDelete save={handleSave} cancel={handleCancel} delete={handleDelete} />
            </Stack>
        </Paper>
    )
}