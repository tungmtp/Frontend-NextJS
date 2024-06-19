'use client'
import { useState, useEffect, Fragment } from "react"
import { asyncFetch } from "@/hook/Hook"
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Stack, Input } from "@mui/material";
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
                    <h2>{itemDate.ReqDate}</h2>
                    {reqList.filter(itemReq => itemReq.ReqDate === itemDate.ReqDate)
                        .map(item => (
                            <p key={item.ReqID}>{item.Quantity}</p>
                        ))}
                </Fragment>
            ))}
        </>
    );

}