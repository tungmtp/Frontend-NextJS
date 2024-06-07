'use client'
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation";
import { ListDayRequest } from "./ListDayRequest"
import { RequestContent } from "./RequestContent";
import { Stack, Button, Grid } from "@mui/material";
import { today } from "@/hook/Hook";

export default function OrderSupply() {

    const [action, setAction] = useState("Nothing");
    const [requestDate, setRequestDate] = useState("")
    const [orderID, setOrderID] = useState("")

    const searchParams = useSearchParams();

    const getParam = () => {

        setOrderID(searchParams.get("id"));
        // let orderName = searchParams.get("name");
    }

    const handleAction = (action, requestDate) => {
        setAction(action);
        setRequestDate(requestDate);
    }

    useEffect(() => {
        getParam()
    }, [])

    return (
        <Grid container spacing={0.5}>
            <Grid item xs={2}>
                <Stack spacing={2} sx={{ p: 2 }}>
                    <Button variant="contained" color="primary" onClick={() => { setRequestDate(today()); setAction("NewRequest") }}>Add</Button>
                    <ListDayRequest orderID={orderID} emitParent={handleAction} />
                </Stack>
            </Grid>
            <Grid item xs={10}>
                <RequestContent requestDate={requestDate} orderID={orderID} action={action} />
            </Grid>
        </Grid>
    )
}