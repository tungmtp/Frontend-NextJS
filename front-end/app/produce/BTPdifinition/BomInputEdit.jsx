import { Box, Paper, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import SelectNewsky from "@/components/select/SelectNewsky"
import { SaveDelete } from "@/components/select/SaveDelete"
import { getData } from "@/hook/Hook"

export const BomInputEdit = (props) => {
    const [currentMeasId, setCurrentMeasId] = useState("")
    const [currentProductId, setCurrentProductId] = useState("")
    // const bomInputDetail = JSON.parse(props.bomInputId);
    const getDefaultBomInputDetail = () => ({
        bomId: "",
        productId: "",
        measId: "",
        quantity: 0
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

    useEffect(() => {
        let xx
        if (props.bomInputId) {
            xx = JSON.parse(props.bomInputId);
            setCurrentMeasId(xx?.measId)
            setCurrentProductId(xx?.productId)
        }
        else {
            setCurrentMeasId("")
            setCurrentProductId("")
        }
        setBomInputDetail(getBomInputDetail())
    }, [props.bomInputId]);

    const handleSave = () => {
        const data = {
            bomId: bomInputDetail.bomId,
            productId: bomInputDetail.productId,
            measId: bomInputDetail.measId,
            quantity: bomInputDetail.quantity,
        };
        if (props.action === "EditBomOutput") {
            putData("/produce-service/bominput", bomInputDetail.id, data).then((response) => {
                props.emitParent("InputEdit")
                console.log("Update BOM Input detail: ", response)
                // update table
            });
        } else {
            postData("/produce-service/bominput", data).then((response) => {
                props.emitParent("InputAddNew")
                console.log("Add new BOM Input detail: ", response)
                //Update table
            });
        }
    }
    const handleDelete = () => {
        props.emitParent("InputDelete")
    }
    const handleCancel = () => {
        props.emitParent("Cancel")
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
                    currentItem={currentProductId}
                    byNameStr="/product-service/product/byNameStr"
                    firstCall="/product-service/product/firstCall"
                    currentItemLink="/product-service/product/oneForSelect"
                />
            </Box>
            <Box sx={{ m: 2 }}>
                <SelectNewsky
                    lblinput="Đơn vị tính"
                    emitParent={(id) => setBomInputDetail({ ...bomInputDetail, measId: id })}
                    currentItem={currentMeasId}
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