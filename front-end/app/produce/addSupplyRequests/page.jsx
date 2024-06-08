'use client'
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation";
import { ListDayRequest } from "./ListDayRequest"
import { RequestContent } from "./RequestContent";
import { Stack, Button, Grid, Paper } from "@mui/material";
import { today } from "@/hook/Hook";

export default function OrderSupply() {

    const [actionContent, setActionContent] = useState("Nothing");
    const [requestDate, setRequestDate] = useState("")
    const [orderID, setOrderID] = useState("")
    const [reRenderList, setReRenderList] = useState(0)

    const searchParams = useSearchParams();

    const getParam = () => {

        setOrderID(searchParams.get("id"));
        // let orderName = searchParams.get("name");
    }

    const handleAction = (action, reqDate = null) => {
        // setAction(action);
        switch (action) {
            case "AddRequestOK":
                setReRenderList(reRenderList => reRenderList + 1)
                setRequestDate(reqDate);
                setActionContent("RequestDetail") // Xem nen de gi
                break;
            case "Cancel":
                setActionContent("Nothing")
                break
            case "OpenRequest":
                setActionContent("RequestDetail")
                setRequestDate(reqDate);
                break;
            case "CreateRequest":
                setRequestDate(reqDate);
                setActionContent("NewRequest");
                break;
            case "Summary":
                setActionContent("Summary");
                break;
            default:
                break
        }

    }

    useEffect(() => {
        getParam()
    }, [])

    return (
        <Grid container spacing={0.5}>
            <Grid item xs={2}>
                <Stack spacing={2} sx={{ p: 2 }}>
                    <a onClick={() => handleAction("CreateRequest", today())}>Add new request</a>
                    <ListDayRequest orderID={orderID} emitParent={handleAction} />
                </Stack>
            </Grid>
            <Grid item xs={10}>
                <RequestContent requestDate={requestDate} orderID={orderID} action={actionContent} emitParent={handleAction} />
            </Grid>
        </Grid>
    )
}