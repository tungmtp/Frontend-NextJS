import { Box, Paper, Stack, TextField } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import SelectNewsky from "@/components/select/SelectNewsky";
import { SaveDelete } from "@/components/select/SaveDelete";
import { putData, postData, asyncFetch } from "@/hook/Hook";

export const BomOutputEdit = (props) => {
    const getDefaultBomOutputDetail = () => ({
        bomCode: "",
        productId: "",
        measId: "",
        segmentId: "",
        quantity: 0,
        timeOfDelay: 0,
    });

    const getBomOutputDetail = () => {
        if (props.action === "EditBomOutput") {
            try {
                return JSON.parse(props.bomOutputId);
            } catch (e) {
                console.log(e);
                return getDefaultBomOutputDetail();
            }
        } else {
            return getDefaultBomOutputDetail();
        }
    };

    const [bomOutputDetail, setBomOutputDetail] = useState(getBomOutputDetail());
    const [defaultProductId, setDefaultProductId] = useState("")
    const [defaultSegmentId, setDefaultSegmentId] = useState("")
    const [defaultMeasId, setDefaultMeasId] = useState("")

    useEffect(() => {
        let xx
        if (props.action == "EditBomOutput") {
            xx = JSON.parse(props.bomOutputId);
            setDefaultMeasId(xx.measId);
            setDefaultProductId(xx.productId)
            setDefaultSegmentId(xx.segmentId)
        } else {
            setDefaultMeasId(props.measIdForAddBOM);
            setDefaultProductId(props.selectedProductId);
            setDefaultSegmentId(props.segmentIdForAddBOM);
        }
        setBomOutputDetail(getBomOutputDetail());
    }, [props.bomOutputId, props.action]);

    const handleSave = () => {
        const data = {
            bomCode: bomOutputDetail.bomCode ? bomOutputDetail.bomCode : "Định mức của: " + props.productNameForAddBOM,
            productId: bomOutputDetail.productId ? bomOutputDetail.productId : defaultProductId,
            measId: bomOutputDetail.measId ? bomOutputDetail.measId : defaultMeasId,
            quantity: bomOutputDetail.quantity,
            timeOfDelay: bomOutputDetail.timeOfDelay,
            segmentId: bomOutputDetail.segmentId ? bomOutputDetail.segmentId : defaultSegmentId,
        };
        console.log(data)
        if (props.action === "EditBomOutput") {
            putData("/produce-service/bom", bomOutputDetail.id, data).then((response) => {
                props.emitParent("OutputEdit")
            });

        } else {
            postData("/produce-service/bom", data).then((response) => {
                props.emitParent("OutputAddNew")
            });
        }
    };

    const handleDelete = () => {
        // alert("Delete clicked");
        asyncFetch("DELETE", `/produce-service/bom/${bomOutputDetail.id}`)
            .then((response) => { props.emitParent("OutputDelete") })
            .catch((error) => console.log(error));

    };

    const handleCancel = () => {
        props.emitParent("Cancel")
    };

    return (
        <Paper elevation={3}>
            <Stack spacing={2} sx={{ p: 2 }}>
                <h3>{props.action === "AddBomOutput" ? "Thêm một định mức" : "Sửa chi tiết một định mức"}</h3>
                <TextField
                    name="bomCode"
                    fullWidth
                    variant="outlined"
                    label="Tên định mức"
                    value={bomOutputDetail.bomCode ? bomOutputDetail.bomCode : "Định mức của: " + props.productNameForAddBOM}
                    onChange={(event) => setBomOutputDetail({ ...bomOutputDetail, bomCode: event.target.value })}
                />
                <SelectNewsky
                    lblinput="Công đoạn sản xuất"
                    emitParent={(id) => setBomOutputDetail({ ...bomOutputDetail, segmentId: id })}
                    currentItem={defaultSegmentId}
                    byNameStr="/produce-service/segment/byNameStr"
                    firstCall="/produce-service/segment/firstCall"
                    currentItemLink="/produce-service/segment/oneForSelect"
                />
                <SelectNewsky
                    lblinput="Sản phẩm đầu ra"
                    disabled={false}
                    emitParent={(id) => setBomOutputDetail({ ...bomOutputDetail, productId: id })}
                    currentItem={defaultProductId}
                    byNameStr="/product-service/product/byNameStr"
                    firstCall="/product-service/product/firstCall"
                    currentItemLink="/product-service/product/oneForSelect"
                />
                <SelectNewsky
                    lblinput="Đơn vị tính"
                    emitParent={(id) => setBomOutputDetail({ ...bomOutputDetail, measId: id })}
                    currentItem={defaultMeasId}
                    byNameStr="/product-service/Measurement/byNameStr"
                    firstCall="/product-service/Measurement/firstCall"
                    currentItemLink="/product-service/Measurement/oneForSelect"
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Số lượng làm ra"
                    value={bomOutputDetail.quantity}
                    onChange={(event) => setBomOutputDetail({ ...bomOutputDetail, quantity: event.target.value })}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Thời gian xử lý (ngày)"
                    value={bomOutputDetail.timeOfDelay}
                    onChange={(event) => setBomOutputDetail({ ...bomOutputDetail, timeOfDelay: event.target.value })}
                />
                <SaveDelete save={handleSave} cancel={handleCancel} delete={handleDelete} />
            </Stack>
        </Paper>
    );
};
