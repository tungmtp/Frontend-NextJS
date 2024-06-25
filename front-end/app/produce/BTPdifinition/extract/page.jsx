'use client'
import { useEffect, useState, Fragment } from "react"
import { Grid, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, TextField, Button, Box, MenuItem } from "@mui/material";
import Paper from '@mui/material/Paper';
import { asyncGetData } from "@/hook/Hook";
import { useSearchParams } from "next/navigation";
import { today } from "@/hook/Hook"
import SelectNewsky from "@/components/select/SelectNewsky";

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
    const searchParams = useSearchParams()

    const getParam = () => {
        setProductId(searchParams.get("productId"))
        setMeasId(searchParams.get("measId"))
        setDefaultMeasId(searchParams.get("measId"))
    }

    const getExtractBomData = () => {
        console.log(`/produce-service/bom/extract/${productId}/${measId}/${today()}/${quantity}`)

        asyncGetData(`/produce-service/bom/extract/${productId}/${measId}/${today()}/${quantity}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data) {
                    const { minLevel, maxLevel } = data.reduce(
                        (acc, item) => {
                            if (item.bomLevel < acc.minLevel) acc.minLevel = item.bomLevel;
                            if (item.bomLevel > acc.maxLevel) acc.maxLevel = item.bomLevel;
                            return acc;
                        },
                        { minLevel: Infinity, maxLevel: -Infinity }
                    );
                    const levelArray = Array.from(
                        { length: maxLevel - minLevel + 1 },
                        (_, index) => minLevel + index
                    );

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
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-labelledby="tableTitle" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ border: 1 }}><b>Sản phẩm</b></TableCell>
                                <TableCell align="center" sx={{ border: 1 }}>DVT</TableCell>
                                <TableCell align="center" sx={{ border: 1 }}>Số lượng</TableCell>
                                <TableCell align="center" sx={{ border: 1 }}>Ngày đáp ứng</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                extractBomData.filter(item => item.bomLevel <= showLevel)
                                    .map((item, index) => (
                                        <TableRow hover key={index}>
                                            <TableCell align="left" sx={{ border: 1 }}><Box sx={{ ml: item.bomLevel - 1 }}>{item.productName}</Box></TableCell>
                                            <TableCell align="left" sx={{ border: 1 }}>{item.MeasName}</TableCell>
                                            <TableCell align="right" sx={{ border: 1 }}>{item.inputQuantity.toFixed(2)}</TableCell>
                                            <TableCell align="left" sx={{ border: 1 }}>{item.reqDate.split("-").reverse().join("-")}</TableCell>
                                        </TableRow>
                                    ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <p></p>
            </Grid>
        </Grid>
    )
}