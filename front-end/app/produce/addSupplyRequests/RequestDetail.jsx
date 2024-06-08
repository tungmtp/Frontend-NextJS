import { useState, useEffect } from "react"
import { asyncFetch } from "@/hook/Hook"
export const RequestDetail = (props) => {
    const [reqDay, setReqDay] = useState("")
    const [reqList, setReqList] = useState([])

    const getListRequest = () => {
        asyncFetch("GET", `/produce-service/ordersProduce/getOrderRequestByOrderIdAndDate/${props.orderID}/${props.requestDate}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setReqList(data);
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        getListRequest()
    }, [props.orderID, props.requestDate])

    return (
        <div>Request Detail</div>
    )
}