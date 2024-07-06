'use client'
import { useEffect, useState, Fragment } from "react"
import { Grid, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, TextField, Button, Box, MenuItem, Stack } from "@mui/material";
import Paper from '@mui/material/Paper';
import { asyncGetData } from "@/hook/Hook";
import { useSearchParams } from "next/navigation";
import { today, selectMaxDate } from "@/hook/Hook"
import SelectNewsky from "@/components/select/SelectNewsky";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ExtractBom() {
    const [productId, setProductId] = useState("")
    const [measId, setMeasId] = useState("")
    const [defaultMeasId, setDefaultMeasId] = useState("")
    const [extractBomData, setExtractBomData] = useState([])
    const [quantity, setQuantity] = useState(100)
    const [productName, setProductName] = useState("")
    const [keyRender, setKeyRender] = useState(1)
    const [arrLevel, setArrLevel] = useState([])
    const [showLevel, setShowLevel] = useState(2)
    const [idxClick, setIdxClick] = useState({})
    const [maxDateProduce, setMaxDateProduce] = useState("")
    const searchParams = useSearchParams()

    const [open, setOpen] = useState(false);
    const [daySelected, setDaySelected] = useState("")
    const [defaultDate, setDefaultDate] = useState("")
    const [reqId, setReqId] = useState("")
    const [firstTimeOfDelay, setFirstTimeOfDelay] = useState(0)

    function setNewDateForNextLevel(level, maxDate, timeOfDelay) {
        // console.log("level ", level)
        if (level - 1 >= arrLevel[0]) {
            // console.log("Run next level", level)
            let arrLength = extractBomData.length
            let i
            for (i = 0; i < arrLength; i++) {

                if (extractBomData[i].bomLevel == level - 1) {
                    console.log("Run next level", level - 1, " maxDate: ", maxDate, " timeOfDelay: ", extractBomData[i].timeOfDelay, " convert maxDate + timeOfDelay: ", today(maxDate + extractBomData[i].timeOfDelay * 1000 * 60 * 60 * 24))
                    if (!extractBomData[i].bomID) {
                        extractBomData[i].dateFix = extractBomData[i].reqDate
                    } else {
                        extractBomData[i].dateFix = selectMaxDate(today(maxDate.getTime() + timeOfDelay * 1000 * 60 * 60 * 24), extractBomData[i].dateFix)
                    }
                }
            }
        }
    }

    function setNewDateForThisLevel(level, maxDate) {
        let i
        let arrLength = extractBomData.length
        for (i = 0; i < arrLength; i++) {
            if (extractBomData[i].bomLevel == level) {
                if (!extractBomData[i].dateFix) {
                    extractBomData[i].dateFix = extractBomData[i].reqDate
                }
            }
        }

    }

    const fixDate = (valFixDate) => {
        let arrLength = extractBomData.length;
        let i, j
        for (i = 0; i < arrLength; i++) {
            // console.log(extractBomData[i].productID, i, idxClick.productID)
            if (extractBomData[i].productID == idxClick.productID) {
                extractBomData[i].dateFix = selectMaxDate(daySelected, extractBomData[i].reqDate)
            } else {
                extractBomData[i].dateFix = extractBomData[i].reqDate
            }
        }

        let reverseArrLevel = arrLevel.slice().reverse()
        // console.log("Reverse: ", reverseArrLevel)
        let arrLvlLength = reverseArrLevel.length
        let dateMs, maxDateInMsCurrent //, maxDateInMsNext, timeOfDelayInMs
        for (i = 0; i < arrLvlLength; i++) {
            // console.log("level ", reverseArrLevel[i])
            const { minReqDate, maxReqDate, timeOfDelay } = extractBomData.filter(item => item.bomLevel == reverseArrLevel[i]).reduce(
                (acc, xItem) => {
                    if (xItem.dateFix) {
                        let maxDate = selectMaxDate(xItem.dateFix, xItem.reqDate)
                        dateMs = new Date(maxDate) // loi o day
                    } else dateMs = new Date(xItem.reqDate)

                    acc.timeOfDelay = xItem.timeOfDelay
                    if (dateMs < acc.minReqDate) acc.minReqDate = dateMs
                    if (dateMs > acc.maxReqDate) acc.maxReqDate = dateMs
                    return acc;
                },
                { minReqDate: Infinity, maxReqDate: -Infinity, timeOfDelay: 0 }
            )
            maxDateInMsCurrent = maxReqDate
            console.log("level & maxDateInMsCurrent ", reverseArrLevel[i], " ", maxDateInMsCurrent)
            // timeOfDelayInMs = timeOfDelay * 1000 * 60 * 60 * 24
            // if (i == 0) {
            //     // setNewDateForThisLevel(reverseArrLevel[i], maxDateInMsCurrent)
            // }
            setNewDateForNextLevel(reverseArrLevel[i], maxDateInMsCurrent, timeOfDelay)
        }

        // them muc chuyen doi dateFix ve reqDate roi xoa dateFix
        for (i = 0; i < arrLength; i++) {
            extractBomData[i].reqDate = extractBomData[i].dateFix
            extractBomData[i].dateFix = null
        }

        const { maxDateFix } = extractBomData.reduce(
            (acc, item) => {
                let dateMs = new Date(item.reqDate)
                // if (dateMs<acc.minDateFix) acc.minDateFix = dateMs
                if (dateMs > acc.maxDateFix) { acc.maxDateFix = dateMs }
                return acc
            },
            { maxDateFix: -Infinity }
        )
        setMaxDateProduce(today(maxDateFix.getTime() + firstTimeOfDelay * 1000 * 60 * 60 * 24, "VN"))
    }

    const handleClickOpen = (item) => {
        setIdxClick({ ...item })
        setDaySelected(item.reqDate);
        console.log("handleClickOpen: ", item.reqDate)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getParam = () => {
        setProductId(searchParams.get("productId"))
        setMeasId(searchParams.get("measId"))
        setDefaultMeasId(searchParams.get("measId"))
        setDefaultDate(searchParams.get("reqDate"))
        setQuantity(Number(searchParams.get("qty")))
        setReqId(searchParams.get("reqId"))
    }

    const getExtractBomData = () => {
        // console.log(`/produce-service/bom/extract/${productId}/${measId}/${today()}/${quantity}`)

        asyncGetData(`/produce-service/bom/extract/${productId}/${measId}/${defaultDate}/${quantity}`)
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                if (data) {
                    //Lấy ra bom level nhỏ nhất và lớn nhất để sau đó tạo array cho mục điều khiển cấp độ bảng.
                    const { minLevel, maxLevel, maxDateDefault } = data.reduce(
                        (acc, item) => {
                            if (item.bomLevel < acc.minLevel) acc.minLevel = item.bomLevel;
                            if (item.bomLevel > acc.maxLevel) acc.maxLevel = item.bomLevel;
                            let dateMs = new Date(item.reqDate)
                            if (dateMs > acc.maxDateDefault) acc.maxDateDefault = dateMs
                            return acc;
                        },
                        { minLevel: Infinity, maxLevel: -Infinity, maxDateDefault: -Infinity }
                    );
                    const levelArray = Array.from(
                        { length: maxLevel - minLevel + 1 },
                        (_, index) => minLevel + index
                    );

                    asyncGetData(`/produce-service/bom/product/${productId}`)
                        .then(res => res.json())
                        .then(data1 => {
                            console.log("BOM of Extract Product: ", data1);
                            setFirstTimeOfDelay(data1[0].timeOfDelay);
                            setMaxDateProduce(today(maxDateDefault.getTime() + data1[0].timeOfDelay * 1000 * 60 * 60 * 24, "VN"))
                        })
                        .catch(e => console.log(e))

                    // setMaxDateProduce(today(maxDateDefault.getTime(), "VN"))

                    setArrLevel([...levelArray])

                    setShowLevel(maxLevel)

                    setExtractBomData(data)
                } else {
                    setExtractBomData([]);
                }
            })
            .catch(e => console.log(e))

        asyncGetData(`/product-service/product/${productId}`)
            .then(response => response.json())
            .then(data => setProductName(data.nameStr))
            .catch(e => console.log(e));


    }

    useEffect(() => {
        getParam()
    }, [])

    useEffect(() => {
        if (productId && measId) {
            getExtractBomData();
        }
    }, [productId, keyRender])

    return (
        <Grid container spacing={0.5}>
            <Grid item xs={12}>
                <h2>Phân rã quá trình sản xuất sản phẩm {productName}</h2>
            </Grid>
            <Grid item xs={6}>
                <SelectNewsky
                    lblinput="Đơn vị tính"
                    emitParent={(id) => setMeasId(id)}
                    currentItem={defaultMeasId}
                    byNameStr="/product-service/Measurement/byNameStr"
                    firstCall="/product-service/Measurement/firstCall"
                    currentItemLink="/product-service/Measurement/oneForSelect"
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="quantity"
                    fullWidth
                    variant="outlined"
                    label="Số lượng dự kiến SX"
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                />
            </Grid>
            <Grid item xs={2}>
                <Button
                    variant="contained"
                    sx={{ marginX: 2 }}
                    onClick={() => setKeyRender(keyRender => keyRender + 1)}
                >
                    Submit
                </Button>
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="outlined-select-level"
                    fullWidth
                    select
                    label="Select level to show"
                    value={showLevel}
                    onChange={(event => setShowLevel(Number(event.target.value)))}
                >
                    {arrLevel.map((val) => (
                        <MenuItem key={val} value={val}>
                            {val}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12}>
                <Stack spacing={2} direction="row" sx={{ m: 2 }}>
                    <h2>Có thể trả hàng cho khách vào ngày {maxDateProduce}</h2>
                    {reqId ? (<Button
                        variant="contained"
                        sx={{ marginX: 2 }}
                        onClick={() => alert("Tính năng đang xay dựng")}
                    >
                        Save plan
                    </Button>) : (<span></span>)}
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-labelledby="tableTitle" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ border: 1 }}><b>Sản phẩm</b></TableCell>
                                <TableCell align="center" sx={{ border: 1 }}>DVT</TableCell>
                                <TableCell align="center" sx={{ border: 1 }}>Số lượng</TableCell>
                                <TableCell align="center" sx={{ border: 1 }}>Ngày đáp ứng</TableCell>
                                <TableCell align="center" sx={{ border: 1 }}>Công đoạn</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                extractBomData.filter(item => item.bomLevel <= showLevel)
                                    .map((item, index) => (
                                        <TableRow hover key={index}>
                                            <TableCell align="left" sx={{ border: 1 }}><Box sx={{ ml: item.bomLevel - 1, color: item.bomID ? "blue" : "red" }}>{item.productName}</Box></TableCell>
                                            <TableCell align="left" sx={{ border: 1 }}>{item.MeasName}</TableCell>
                                            <TableCell align="right" sx={{ border: 1 }}>{item.inputQuantity.toFixed(2)}</TableCell>
                                            <TableCell align="left" sx={{ border: 1 }} onDoubleClick={() => handleClickOpen(item)}>{item.reqDate.split("-").reverse().join("-")}</TableCell>
                                            <TableCell align="left" sx={{ border: 1 }}>{item.segmentName}</TableCell>
                                        </TableRow>
                                    ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(formData.entries());
                            const email = formJson.email;
                            console.log(email);
                            fixDate(email)
                            handleClose();
                        },
                    }}
                >
                    <DialogTitle>Điều chỉnh ngày có hàng</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Hãy gõ vào ngày vật tư hoặc bán thành phẩm này có thể có mặt tại nhà máy
                        </DialogContentText>
                        <TextField
                            autoFocus
                            id="name"
                            name="email"
                            label="Ngày điều chỉnh"
                            fullWidth
                            value={(daySelected ? daySelected : today()).split("-").reverse().join("/")}
                            onChange={(e) => setDaySelected((e.target.value).split("/").reverse().join("-"))}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Subscribe</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </Grid>
    )
}