import { Box, Paper, TextField, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import SelectNewsky from "@/components/select/SelectNewsky"
import { SaveDelete } from "@/components/select/SaveDelete"
import { asyncFetch } from "@/hook/Hook"

export const BomInputEdit = (props) => {
    const [currentMeasId, setCurrentMeasId] = useState("")
    const [currentProductId, setCurrentProductId] = useState("")
    const [defaultQty, setDefaultQty] = useState(0)
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
            setDefaultQty(xx.quantity)
        }
        else {
            setCurrentMeasId("")
            setCurrentProductId("")
            setDefaultQty(0)
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
        if (props.action === "EditBomInput") {
            asyncFetch("PUT", `/produce-service/bominput/${bomInputDetail.id}`, data)
                .then((response) => {
                    props.emitParent("InputEdit")
                    console.log("Update BOM Input detail: ", response)
                })
                .catch((error) => { console.log(error) });
        } else {
            asyncFetch('POST', `/produce-service/bominput`, data)
                .then((response) => {
                    props.emitParent("InputAddNew")
                    console.log("INSERT BOM Input detail: ", response)
                })
                .catch((error) => { console.log(error) });


        }
    }
    const handleDelete = () => {
        asyncFetch('DELETE', `/produce-service/bominput/${bomInputDetail.id}`, data)
            .then((response) => {
                props.emitParent("InputDelete")
            })
            .catch((error) => { console.log(error) });

    }
    const handleCancel = () => {
        props.emitParent("Cancel")
    }

    const productIdChange = (id) => {
        setBomInputDetail({ ...bomInputDetail, productId: id })
        if (id) {
            asyncFetch('GET', `/product-service/product/${id}`)
                .then(response => response.json())
                .then((data) => {
                    console.log(data);
                    setCurrentMeasId(data.measID)
                })
                .catch((error) => { console.log(error) });
        }
    }
    return (
        <Paper elevation={3}>
            <Stack spacing={2} sx={{ p: 2 }}>
                <Box sx={{ typography: "subtitle", m: 2 }}>{(props.action == "AddBomInput") ? "Thêm một sản phẩm đầu vào" : "Sửa chi tiết một sản phẩm đầu vào"}</Box>

                <SelectNewsky
                    lblinput="Sản phẩm đầu vào"
                    emitParent={productIdChange}
                    currentItem={currentProductId}
                    byNameStr="/product-service/product/byNameStr"
                    firstCall="/product-service/product/firstCall"
                    currentItemLink="/product-service/product/oneForSelect"
                />

                <SelectNewsky
                    lblinput="Đơn vị tính"
                    emitParent={(id) => setBomInputDetail({ ...bomInputDetail, measId: id })}
                    currentItem={currentMeasId}
                    byNameStr="/product-service/Measurement/byNameStr"
                    firstCall="/product-service/Measurement/firstCall"
                    currentItemLink="/product-service/Measurement/oneForSelect"
                />

                <TextField
                    id="quantity"
                    fullWidth
                    variant="outlined"
                    label="Số lượng sử dụng"
                    value={bomInputDetail.quantity}
                    onChange={(event) => setBomInputDetail({ ...bomInputDetail, quantity: event.target.value })}
                />

                <SaveDelete save={handleSave} cancel={handleCancel} delete={handleDelete} />
            </Stack>
        </Paper>
    )
}