'use client'
import { useState, useEffect, Fragment } from "react"
import { asyncFetch } from "@/hook/Hook"
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Stack, Input } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import { SaveCancel } from "@/components/select/SaveCancel";

import { useSearchParams } from "next/navigation";
import { useSupplyRequest } from "../SupplyRequest";

import { useRouter } from 'next/navigation';


export default function RequestDetail(props) {
    const [reqDay, setReqDay] = useState("")
    const [editDay, setEditDay] = useState("")
    const [reqList, setReqList] = useState([])
    const [collectInput, setCollectInput] = useState({})
    const [orderID, setOrderID] = useState("")

    const searchParams = useSearchParams();
    const { getListRequestDate } = useSupplyRequest();

    const router = useRouter();

    const getParam = () => {
        setOrderID(searchParams.get("id"));
        setReqDay(searchParams.get("mdate"))
        setEditDay(searchParams.get("mdate"))
    }

    const getListRequest = () => {
        console.log(`/produce-service/ordersProduce/getOrderRequestByOrderIdAndDate/${orderID}/${reqDay}`);
        asyncFetch("GET", `/produce-service/ordersProduce/getOrderRequestByOrderIdAndDate/${orderID}/${reqDay}`)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                setReqList(data);
                // Initialize collectInput with reqList values
                const initialInput = data.reduce((acc, item, index) => {
                    acc[index] = item.Quantity;
                    return acc;
                }, {});
                setCollectInput(initialInput);
            })
            .catch(err => console.error(err))
    }

    const handleInputChange = (value, index) => {
        // console.log(value, index);
        let convertData = Number(value);
        if (!isNaN(convertData)) {
            setCollectInput({ ...collectInput, [index]: convertData });
        }
    }

    const handleSave = () => {
        let data = reqList
            .map((item, index) => ({
                id: item.id,
                orderDetailID: item.OrderDetailID,
                quantity: collectInput[index] ? collectInput[index] : 0,
                reqDate: editDay,
                markDone: item.MarkDone,
                generated: item.Generated
            }))
            .filter(item => !item.markDone && item.quantity !== 0);
        console.log(data);
        asyncFetch("PUT", "/produce-service/ordersProduce/updatelist", data)
            .then(response => {
                if (response.ok) {
                    getListRequestDate(orderID)
                    router.push(`/produce/addSupplyRequests?id=${orderID}`)
                }
            })
            .catch(e => console.log(e));
    }

    const handleCancel = () => {
        router.push(`/produce/addSupplyRequests?id=${orderID}`);
    }

    // useEffect(() => {
    //     setReqDay(props.requestDate)
    // }, [props.requestDate])

    useEffect(() => {
        getParam()
    }, [])

    useEffect(() => {
        if (orderID && reqDay) {
            getListRequest()
        }
    }, [orderID, reqDay])



    return (
        <Fragment>
            <Stack spacing={2} direction="row" sx={{ m: 2 }}>
                <DatePicker
                    label="Yêu cầu giao hàng ngày"
                    value={dayjs(editDay)}
                    onChange={(e) => setEditDay(dayjs(e.toDate()).format("YYYY-MM-DD"))}
                />
                <SaveCancel save={handleSave} cancel={handleCancel} />
            </Stack>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-labelledby="tableTitle" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ border: 1 }}><b>Sản phẩm</b></TableCell>
                            <TableCell align="center" sx={{ border: 1 }}>CL</TableCell>
                            <TableCell align="center" sx={{ border: 1 }}>Yêu cầu giao</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reqList.map((req, index) => (
                            <TableRow key={index} hover>
                                <TableCell align="left" sx={{ border: 1 }}>
                                    <>
                                        <b>{req.ProductName}</b>
                                        <br />
                                        {req.MeasName}
                                    </>
                                </TableCell>
                                <TableCell align="left" sx={{ border: 1 }}>{req.quality}</TableCell>
                                <TableCell align="right" sx={{ border: 1 }}>
                                    {!req.Generated ? (
                                        <Input value={collectInput[index] || ''} onChange={(event) => handleInputChange(event.target.value, index)} />
                                    ) : (
                                        <span>{req.Quantity}</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Fragment>
    )
}
