import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography, Button } from "@mui/material";
import { useState, Fragment, useEffect } from "react";
import Paper from '@mui/material/Paper';
import { getData } from "@/hook/Hook";
import Link from "next/link";

export const BomOutput = (props) => {
    const [openDlg, setOpenDlg] = useState(false);
    const [productName, setProductName] = useState("")
    const [measName, setMeasName] = useState("")

    const searchName = async (productId, measId) => {
        const product = await getData(`/product-service/product/${productId}`);
        setProductName(product.nameStr);
        const meas = await getData(`/product-service/Measurement/${measId}`);
        // console.log(meas);
        setMeasName(meas.measName);
    }

    const handleBomClick = (id, action) => {
        props.emitParent(id, action)
    }

    useEffect(() => {
        searchName(props.bom.productId, props.bom.measId);
    }, [props])

    return (
        <Fragment>
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Đầu ra
            </Typography>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-labelledby="tableTitle" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ border: 1 }}><b>Sản phẩm</b></TableCell>
                            <TableCell align="center" sx={{ border: 1 }}>ĐVT</TableCell>
                            <TableCell align="center" sx={{ border: 1 }}>Số lượng</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow hover>
                            <TableCell align="left" sx={{ border: 1 }} ><a onClick={() => handleBomClick(props.bom.id, "EditBomOutput")}>{productName}</a></TableCell>
                            <TableCell align="left" sx={{ border: 1 }}>{measName}</TableCell>
                            <TableCell align="right" sx={{ border: 1 }}>{props.bom.quantity}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Fragment>
    )

}