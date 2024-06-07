import { asyncFetch } from "@/hook/Hook"
import { Fragment, useEffect, useState } from "react"
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography, Button } from "@mui/material";

export function NewRequest(props) {

    const [requestList, setRequestList] = useState([])

    const loadData = () => {
        asyncFetch("GET", `/produce-service/ordersProduce/orderRequestSumary/${props.orderID}`)
            .then(response => response.json())
            .then(data => setRequestList(data))
            .catch(error => console.log(error))
    }

    useEffect(() => {
        loadData();

    }, [props.orderID])

    return (
        <Fragment>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-labelledby="tableTitle" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ border: 1 }}><b>Sản phẩm</b></TableCell>
                            <TableCell align="center" sx={{ border: 1 }}>CL</TableCell>
                            <TableCell align="center" sx={{ border: 1 }}>Order</TableCell>
                            <TableCell align="center" sx={{ border: 1 }}>Requested</TableCell>
                            <TableCell align="center" sx={{ border: 1 }}>Balance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {requestList.map((req, index) => (
                            <TableRow key={index} hover>
                                <TableCell align="left" sx={{ border: 1 }} >
                                    {(
                                        <>
                                            <b>{req.ProductName}</b>
                                            <br />
                                            {req.MeasName}
                                        </>
                                    )}
                                </TableCell>
                                <TableCell align="left" sx={{ border: 1 }}>{measName}</TableCell>
                                <TableCell align="right" sx={{ border: 1 }}>{props.bom.quantity}</TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
        </Fragment>
    )
}
