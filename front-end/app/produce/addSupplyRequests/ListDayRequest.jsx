import { asyncFetch } from "@/hook/Hook";
import { Stack } from "@mui/material";
import { Fragment, useEffect, useState } from "react"

export const ListDayRequest = (props) => {
    const [listDate, setListDate] = useState([])

    const getListRequestDate = () => {
        asyncFetch("GET", `/produce-service/ordersProduce/orderRequestDistinctDate/${props.orderID}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setListDate(data)

            })
            .catch(err => console.error(err))
    }

    const emitParent = (action, reqDate) => {
        props.emitParent(action, reqDate)
    }

    useEffect(() => {
        if (props.orderID) {
            getListRequestDate();
        }
    }, [props.orderID]);

    return (
        <Stack spacing={2} >

            {listDate.map((item, index) => (<a key={index} onClick={() => emitParent("OpenRequest", item.ReqDate)}>{item.ReqDate}</a>))}

            <a onClick={() => emitParent("Summary")}>Summary</a>
        </Stack>
    )
}