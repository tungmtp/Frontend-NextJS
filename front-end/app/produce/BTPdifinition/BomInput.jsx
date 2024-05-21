import { useEffect, useState, Fragment } from "react"
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography, Button } from "@mui/material";
import Paper from '@mui/material/Paper';
import { getData } from "@/hook/Hook";

export const BomInput = (props) => {
    // console.log(props.key, props.bomId);
    const [listBomInput, setListBomInput] = useState([])
    const getListBomInput = async (id) => {
        console.log(`/produce-service/bom/input/${id}`)
        if (id) {
            const result = await getData(`/produce-service/bom/input/${id}`)
            setListBomInput(result)
            console.log(listBomInput)
        }
    }
    const handleBomClick = (id, action) => {
        props.emitParent(id, action)
    }
    useEffect(() => {
        // console.log("bomId in useEffect: ", props.bomId)
        getListBomInput(props.bomId);
    }, [props.bomId])
    return (
        <Fragment>
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableInput"
                component="div"
            >
                Đầu vào
            </Typography>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-labelledby="tableInput" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ border: 1 }}><b>Sản phẩm</b></TableCell>
                            <TableCell align="center" sx={{ border: 1 }}>ĐVT</TableCell>
                            <TableCell align="center" sx={{ border: 1 }}>Số lượng</TableCell>
                            <TableCell align="center" sx={{ border: 1 }}>Cost</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listBomInput.map((bom, index) => (
                            // <BomInputRow key={index} bom={bom} />
                            <TableRow key={index} hover>
                                <TableCell align="left" sx={{ border: 1 }}><a onClick={() => handleBomClick(JSON.stringify(bom), "EditBomInput")}>{bom.productName}</a></TableCell>
                                <TableCell align="left" sx={{ border: 1 }}>{bom.measName}</TableCell>
                                <TableCell align="right" sx={{ border: 1 }}>{bom.quantity}</TableCell>
                                <TableCell align="right" sx={{ border: 1 }}>{0}</TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
        </Fragment>
    )
}