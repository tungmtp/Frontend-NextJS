'use client'
import { useState, useEffect, Fragment } from "react"
import { asyncFetch } from "@/hook/Hook"
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Stack, Input, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import { SaveCancel } from "@/components/select/SaveCancel";

import { useSearchParams } from "next/navigation";

export default function diary() {
    const [orderID, setOrderID] = useState("")
    const [reqListDate, setReqListDate] = useState([])
    const [reqList, setReqList] = useState([])
    const searchParams = useSearchParams();

    const getParam = () => {
        setOrderID(searchParams.get("id"))
    }

    const getRequestData = () => {
        asyncFetch("GET", `/produce-service/ordersProduce/orderRequestDistinctDate/${orderID}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data) {
                    setReqListDate(data);
                }

            })
            .catch(err => console.error(err))

        asyncFetch("GET", `/produce-service/ordersProduce/getOrderRequestByOrderId/${orderID}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data) {
                    setReqList(data);
                }

            })
            .catch(err => console.error(err))
    }

    const handleGenerate = (item) => {
        console.log(item);
    }

    useEffect(() => {
        getParam()
    }, [])

    useEffect(() => {
        if (orderID) {
            getRequestData();
        }
    }, [orderID])

    return (
        <>
            {reqListDate.map(itemDate => (
                <Fragment key={itemDate.ReqDate}>
                    <h2>{itemDate.ReqDate.split("-").reverse().join("-")}</h2>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-labelledby="tableTitle" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ border: 1 }}><b>Sản phẩm</b></TableCell>
                                    <TableCell align="center" sx={{ border: 1 }}>DVT</TableCell>
                                    <TableCell align="center" sx={{ border: 1 }}>Chất lượng</TableCell>
                                    <TableCell align="center" sx={{ border: 1 }}>Yêu cầu giao</TableCell>
                                    <TableCell align="center" sx={{ border: 1 }}>Generate</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    reqList.filter(itemReq => itemReq.ReqDate === itemDate.ReqDate)
                                        .map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell align="center" sx={{ border: 1 }}>{item.productName}</TableCell>
                                                <TableCell align="center" sx={{ border: 1 }}>{item.MeasName}</TableCell>
                                                <TableCell align="center" sx={{ border: 1 }}>{item.quality}</TableCell>
                                                <TableCell align="center" sx={{ border: 1 }}>{item.Quantity}</TableCell>
                                                <TableCell align="center" sx={{ border: 1 }}>
                                                    {item.Generated ?
                                                        (<span></span>)
                                                        :
                                                        (<a href={`/produce/BTPdifinition/extract?productId=${item.productID}&&measId=${item.measID}&&qty=${item.Quantity}&&reqDate=${item.ReqDate}&&reqId=${item.reqID}`}
                                                            target="_blank">
                                                            <Button variant="contained" color="primary">Generate</Button>
                                                        </a>)
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Fragment>
            ))}
        </>
    );

}