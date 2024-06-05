import { Box, Paper, TextField, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import SelectNewsky from "@/components/select/SelectNewsky"
import { SaveCancel } from "@/components/select/SaveCancel"
import { asyncFetch } from "@/hook/Hook"

export const BomInputAddNew = (props) => {
    const [currentMeasId, setCurrentMeasId] = useState("")
    // const [currentProductId, setCurrentProductId] = useState("")
    const [quantity, setQuantity] = useState(0)
    const [productId, setProductId] = useState("")
    const [measId, setMeasId] = useState("")


    useEffect(() => {
        productIdChange(productId);
    }, [productId]);

    const handleSave = () => {
        const data = {
            bomId: props.bomId,
            productId: productId,
            measId: measId,
            quantity: quantity,
        };

        console.log("Data to save: ", data);

        asyncFetch('POST', `/produce-service/bominput`, data)
            .then((response) => {
                props.emitParent("InputAddNew")
            })
            .catch((error) => { console.log(error) });
    }

    const handleCancel = () => {
        props.emitParent("Cancel")
    }

    const productIdChange = (id) => {
        if (id) {
            asyncFetch('GET', `/product-service/product/${id}`)
                .then(response => response.json())
                .then((data) => {
                    // console.log(data);
                    setCurrentMeasId(data.measID)
                    setMeasId(data.measID)
                })
                .catch((error) => { console.log(error) });
        }
    }
    return (
        <Paper elevation={3}>
            <Stack spacing={2} sx={{ p: 2 }}>
                <Box sx={{ typography: "subtitle", m: 2 }}>"Thêm một sản phẩm đầu vào" </Box>

                <SelectNewsky
                    lblinput="Sản phẩm đầu vào"
                    emitParent={(id) => setProductId(id)}
                    byNameStr="/product-service/product/byNameStr"
                    firstCall="/product-service/product/firstCall"
                    currentItemLink="/product-service/product/oneForSelect"
                />

                <SelectNewsky
                    lblinput="Đơn vị tính"
                    emitParent={(id) => setMeasId(id)}
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
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                />

                <SaveCancel save={handleSave} cancel={handleCancel} />
            </Stack>
        </Paper>
    )
}