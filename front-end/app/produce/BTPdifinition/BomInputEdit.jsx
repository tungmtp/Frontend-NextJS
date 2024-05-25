import { Box, Paper, TextField } from "@mui/material"
import { Fragment, useState } from "react"
import SelectNewsky from "@/components/select/SelectNewsky"
import { SaveDelete } from "@/components/select/SaveDelete"
import { getData } from "@/hook/Hook"

export const BomInputEdit = (props) => {
    const [productId, setProductId] = useState("")
    const [saveStatus, setSaveStatus] = useState(true)
    // const bomInputDetail = JSON.parse(props.bomInputId);
    const getDefaultBomInputDetail = () => ({
        bomCode: "",
        productId: "",
        measId: "",
        segmentId: "",
        quantity: 0,
        timeOfDelay: 0,
    });

    const getBomInputDetail = () => {
        if (props.action === "EditBomInput") {
            try {
                return JSON.parse(props.bomInputId);
            } catch (e) {
                console.log(e);
                return getDefaultBomInputDetail();
            }
        } else {
            return getDefaultBomInputDetail();
        }
    };

    const [bomInputDetail, setBomInputDetail] = useState(getBomInputDetail());

    const handleSave = () => {
        alert("Save clicked")
    }
    const handleDelete = () => {
        alert("Delete clicked")
    }
    const handleCancel = () => {
        alert("Cancel clicked")
    }

    const productIdChange = (id) => {
        setBomInputDetail({ ...bomInputDetail, productId: id })
        if (id) {
            // getData(`/product-service/product/${id}`).then((data) => { setBomInputDetail({ ...bomInputDetail, measId: data.measId }) })
        }
    }
    return (
        <Paper elevation={3}>
            {/* <p></p> */}
            <Box sx={{ typography: "subtitle", m: 2 }}>{(props.action == "AddBomInput") ? "Thêm một sản phẩm đầu vào" : "Sửa chi tiết một sản phẩm đầu vào"}</Box>
            <Box sx={{ m: 2 }}>
                <SelectNewsky
                    lblinput="Sản phẩm đầu vào"
                    emitParent={productIdChange}
                    currentItem={() => bomInputDetail.productId}
                    byNameStr="/product-service/product/byNameStr"
                    firstCall="/product-service/product/firstCall"
                    currentItemLink="/product-service/product/oneForSelect"
                />
            </Box>
            <Box sx={{ m: 2 }}>
                <SelectNewsky
                    lblinput="Đơn vị tính"
                    emitParent={(id) => setBomInputDetail({ ...bomInputDetail, measId: id })}
                    currentItem={() => bomInputDetail.measId}
                    byNameStr="/product-service/Measurement/byNameStr"
                    firstCall="/product-service/Measurement/firstCall"
                    currentItemLink="/product-service/Measurement/oneForSelect"
                />
            </Box>
            <Box sx={{ m: 2 }}>
                <TextField
                    id="quantity"
                    fullWidth
                    variant="outlined"
                    label="Số lượng sử dụng"
                    value={bomInputDetail.quantity}
                    onChange={(event) => setBomInputDetail({ ...bomInputDetail, bomCode: event.target.value })}
                />
            </Box>
            <SaveDelete save={handleSave} cancel={handleCancel} delete={handleDelete} />
        </Paper>
    )
}