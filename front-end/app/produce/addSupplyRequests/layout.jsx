'use client'
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation";
import { Stack, Button, Grid, Paper, Link } from "@mui/material";
import { MyProvider, useSupplyRequest } from "./SupplyRequest";

import { today } from "@/hook/Hook";

function MainLayout({ children }) {

    const { listDate, getListRequestDate } = useSupplyRequest();

    const [orderID, setOrderID] = useState("")
    const searchParams = useSearchParams();

    const getParam = () => {

        setOrderID(searchParams.get("id"));
        // let orderName = searchParams.get("name");
    }

    useEffect(() => {
        getParam()
    }, [])

    useEffect(() => {
        if (orderID) {
            getListRequestDate(orderID)
        }
    }, [orderID, getListRequestDate])

    return (
        <Grid container spacing={0.5}>
            <Grid item xs={2}>
                <Stack spacing={2} sx={{ p: 2 }}>
                    <Link href={`/produce/addSupplyRequests/newrequest?id=${orderID}`} >Add new request</Link>
                    {orderID ? (listDate.map(
                        (item, index) => (<Link key={index} href={`/produce/addSupplyRequests/detail?id=${orderID}&&mdate=${item.ReqDate}`}>{item.ReqDate.split("-").reverse().join("-")}</Link>)
                    )) : (<span></span>)}
                    <Link href={`/produce/addSupplyRequests/summary?id=${orderID}`}>Summary</Link>
                    <Link href={`/produce/addSupplyRequests/diary?id=${orderID}`}>Diary</Link>
                </Stack>
            </Grid>
            <Grid item xs={10}>
                {/* <RequestContent requestDate={requestDate} orderID={orderID} action={actionContent} emitParent={handleAction} /> */}
                {children}
            </Grid>
        </Grid>
    )
}

export default function LayoutWrapper({ children }) {
    return (
        <MyProvider>
            <MainLayout>{children}</MainLayout>
        </MyProvider>
    );
}