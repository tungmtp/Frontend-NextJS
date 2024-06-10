'use client'
import { asyncFetch, today } from "@/hook/Hook"
import { Fragment, useEffect, useState } from "react"
import {
    Table, TableContainer, TableHead, TableRow, TableCell, TableBody,
    Typography, Button, Paper, Stack, Input
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import "dayjs/locale/en-gb";
import dayjs from 'dayjs';
import { SaveCancel } from "@/components/select/SaveCancel";
import { useSearchParams } from "next/navigation";
import { useSupplyRequest } from "../SupplyRequest";


export default function NewRequest(props) {

    const [requestList, setRequestList] = useState([])
    const [reqDay, setReqDay] = useState("")
    const [collectInput, setCollectInput] = useState({})
    const [orderID, setOrderID] = useState("")

    const searchParams = useSearchParams();
    const { addNewListRequest } = useSupplyRequest();

    const getParam = () => {
        setOrderID(searchParams.get("id"));
    }

    useEffect(() => {
        getParam()
    }, [])


    const loadData = () => {
        asyncFetch("GET", `/produce-service/ordersProduce/orderRequestSumary/${orderID}`)
            .then(response => response.json())
            .then(data => setRequestList(data))
            .catch(error => console.log(error))
        setReqDay(props.requestDate)
    }

    const handleInputChange = (value, index) => {
        console.log(value, index);
        let convertData;
        convertData = Number(value)
        if (convertData && convertData !== 0) {
            setCollectInput({ ...collectInput, [index]: convertData })
        }
    }

    const handleSave = () => {
        let data = requestList
            .map((item, index) => ({ orderDetailID: item.OrderDetailID, quantity: collectInput[index] ? collectInput[index] : 0, reqDate: reqDay, markDone: false, generated: false }))
            .filter(item => item.quantity !== 0)
        console.log(data);
        // asyncFetch("POST", "/produce-service/ordersProduce/addlist", data)
        //     .then(response => {
        //         if (response.ok) {
        //             // props.emitParent("AddRequestOK", reqDay)
        //         }
        //     })
        //     .catch(e => console.log(e));
        addNewListRequest(data);
    }

    const handleCancel = () => {
        props.emitParent("Cancel");
    }

    useEffect(() => {
        if (orderID) {
            loadData();
        }
    }, [orderID])

    return (
        <Fragment>
            <Stack spacing={2} direction="row" sx={{ m: 2 }}>

                <DatePicker
                    label="Yêu cầu giao hàng ngày"
                    value={dayjs(reqDay)}
                    onChange={(e) => setReqDay(today(e.toDate()))}
                />
                <SaveCancel save={handleSave} cancel={handleCancel} />
            </Stack>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-labelledby="tableTitle" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ border: 1 }}><b>Sản phẩm</b></TableCell>
                            <TableCell align="center" sx={{ border: 1 }}>CL</TableCell>
                            <TableCell align="center" sx={{ border: 1 }}>Order qty</TableCell>
                            <TableCell align="center" sx={{ border: 1 }}>Requested</TableCell>
                            <TableCell align="center" sx={{ border: 1 }}>Balance</TableCell>
                            <TableCell align="center" sx={{ border: 1 }}>Yêu cầu giao</TableCell>
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
                                <TableCell align="left" sx={{ border: 1 }}>{req.quality}</TableCell>
                                <TableCell align="right" sx={{ border: 1 }}>{req.OrderQuantity}</TableCell>
                                <TableCell align="right" sx={{ border: 1 }}>{req.RequestedQty}</TableCell>
                                <TableCell align="right" sx={{ border: 1 }}>{req.OrderQuantity - req.RequestedQty}</TableCell>
                                <TableCell align="right" sx={{ border: 1 }}>
                                    <Input defaultValue={0} onChange={(event) => handleInputChange(event.target.value, index)} />
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>

        </Fragment>
    )
}
