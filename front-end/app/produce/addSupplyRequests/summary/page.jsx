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
// import { SaveCancel } from "@/components/select/SaveCancel";
import { useSearchParams } from "next/navigation";
// import { useSupplyRequest } from "../SupplyRequest";

// import {today} from 

import { useRouter } from 'next/navigation';


export default function Summary(props) {

  const [requestList, setRequestList] = useState([])
  // const [reqDay, setReqDay] = useState(today())
  // const [collectInput, setCollectInput] = useState({})
  const [orderID, setOrderID] = useState("")

  const searchParams = useSearchParams();
  // const { getListRequestDate } = useSupplyRequest();
  // const router = useRouter();

  const getParam = () => {
    setOrderID(searchParams.get("id"));
  }

  useEffect(() => {
    getParam()
  }, [])


  const loadData = () => {
    asyncFetch("GET", `/produce-service/ordersProduce/orderRequestSumary/${orderID}`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          setRequestList(data)
        } else { setRequestList([]) }
      }
      )
      .catch(error => console.log(error))
  }



  useEffect(() => {
    if (orderID) {
      loadData();
    }
  }, [orderID])

  return (
    <Fragment>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-labelledby="tableTitle" size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ border: 1 }}><b>Sản phẩm</b></TableCell>
              <TableCell align="center" sx={{ border: 1 }}>CL</TableCell>
              <TableCell align="center" sx={{ border: 1 }}>Order qty</TableCell>
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
                <TableCell align="left" sx={{ border: 1 }}>{req.quality}</TableCell>
                <TableCell align="right" sx={{ border: 1 }}>{req.OrderQuantity}</TableCell>
                <TableCell align="right" sx={{ border: 1 }}>{req.RequestedQty}</TableCell>
                <TableCell align="right" sx={{ border: 1 }}>{req.OrderQuantity - req.RequestedQty}</TableCell>

              </TableRow>
            ))}

          </TableBody>
        </Table>
      </TableContainer>

    </Fragment>
  )
}
