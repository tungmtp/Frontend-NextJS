import { Box, Paper, TextField, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import SelectNewsky from "@/components/select/SelectNewsky"
import { SaveDelete } from "@/components/select/SaveDelete"
import { asyncFetch } from "@/hook/Hook"

export const BomInputEdit = (props) => {
    const [defaultMeasId, setDefaultMeasId] = useState("")
    const [defaultProductId, setDefaultProductId] = useState("")
    const [defaultBomId, setDefaultBomId] = useState("")
    const [currentBomInputId, setCurrentBomInputId] = useState("")

    const [quantity, setQuantity] = useState(0)
    const [productId, setProductId] = useState("")
    const [measId, setMeasId] = useState("")


    const loadDefaultValue = () => {
        let xx
        xx = JSON.parse(props.bomInputId);

        setDefaultMeasId(xx.measId)
        setDefaultProductId(xx.productId)
        setDefaultBomId(xx.bomId)

        setCurrentBomInputId(xx.id)

        setQuantity(xx.quantity)
        setProductId(xx.productId)
        setMeasId(xx.measId)
    };

    const handleSave = () => {
        const data = {
            bomId: defaultBomId,
            productId: productId,
            measId: measId,
            quantity: quantity,
        };

        console.log("Data to save: ", data);

        asyncFetch("PUT", `/produce-service/bominput/${currentBomInputId}`, data)
            .then((response) => {
                props.emitParent("InputEdit")
                console.log("Update BOM Input detail: ", response)
            })
            .catch((error) => { console.log(error) });

    }
    const handleDelete = () => {
        asyncFetch('DELETE', `/produce-service/bominput/${currentBomInputId}`)
            .then((response) => {
                props.emitParent("InputDelete")
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
                    setDefaultMeasId(data.measID)
                    setMeasId(data.measID)
                })
                .catch((error) => { console.log(error) });
        }
    }
    //------------ useEffect area --------------------//
    useEffect(() => {
        loadDefaultValue();
    }, [props.bomInputId]);

    useEffect(() => {
        productIdChange(productId);
    }, [productId]);
    //------------ useEffect area --------------------//

    return (
        <Paper elevation={3}>
            <Stack spacing={2} sx={{ p: 2 }}>
                <Box sx={{ typography: "subtitle", m: 2 }}>{(props.action == "AddBomInput") ? "Thêm một sản phẩm đầu vào" : "Sửa chi tiết một sản phẩm đầu vào"}</Box>

                <SelectNewsky
                    lblinput="Sản phẩm đầu vào"
                    emitParent={(id) => setProductId(id)}
                    currentItem={defaultProductId}
                    byNameStr="/product-service/product/byNameStr"
                    firstCall="/product-service/product/firstCall"
                    currentItemLink="/product-service/product/oneForSelect"
                />

                <SelectNewsky
                    lblinput="Đơn vị tính"
                    emitParent={(id) => setMeasId(id)}
                    currentItem={defaultMeasId}
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

                <SaveDelete save={handleSave} cancel={handleCancel} delete={handleDelete} />
            </Stack>
        </Paper>
    )
}