import React, { useEffect, useState } from "react";
import { DataGrid, GridFooter, GridFooterContainer } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Menu,
  Button,
} from "@mui/material";
import Link from "next/link";
import Divider from "@mui/material/Divider";
import ProductAddDialog from "../dialog/productDialog/ProductAddDialog";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import OrderDetailAddDialog from "../dialog/orderDetailDialog/OrderDetailAddDialog";
import { getData } from "@/hook/Hook";
import OrderDetailUpdateDialog from "../dialog/orderDetailDialog/OrderDetailUpdateDialog";

// Define the data for the DataGrid

export default function OrderDetailTable(props) {
  const [openAddOderDetail, setOpenAddOderDetail] = useState(false);
  const [openUpdateOderDetail, setOpenUpdateOderDetail] = useState(false);
  const [orderDeatailList, setOrderDetailList] = useState([]);
  const [selectedOrderDeatail, setSelectedOrderDetail] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [seLectedMeasurement, setSeLectedMeasurement] = useState(null);

  const measureCategory = {
    1: "m2",
    2: "md",
    3: "kg",
    4: "",
    5: "Lít",
  };

  // console.log("orderDeatailList: ", orderDeatailList);
  useEffect(() => {
    const getOrderDetailData = async () => {
      try {
        const result = await getData(
          `/business-service/orderDetail/byOrderID/${props.orderID}`
        );

        // Map through the results and fetch product names
        const resultWithIndex = await Promise.all(
          result.map(async (row, index) => {
            try {
              const productResult = await getData(
                `/product-service/product/oneForSelect/mayBeSell/${row.productID}`
              );
              // console.log(productResult);
              return {
                ...row,
                index: index + 1,
                nameStr: productResult[0].nameStr,
                measName: productResult[0].measName,
                rateInRoot: productResult[0].rateInRoot,
                measCatId: productResult[0].measCatId,
              };
            } catch (err) {
              console.error("Error fetching product data:", err);
              return {
                ...row,
                index: index + 1,
                nameStr: "Unknown Product",
              };
            }
          })
        );

        setOrderDetailList(resultWithIndex);
      } catch (err) {
        console.error("Error fetching order detail data:", err);
      }
    };

    getOrderDetailData();
  }, [props.orderID, openAddOderDetail]);

  const calculateQualityRate = (itemQuanlity, rateInRoot) => {
    if (rateInRoot == 0) {
      return itemQuanlity;
    } else {
      return rateInRoot * itemQuanlity;
    }
  };
  const columns = [
    { field: "id", headerName: "id", width: 70 },
    { field: "index", headerName: "STT", width: 30 },
    {
      field: "nameStr",
      headerName: "Sản phẩm",
      width: 380,
      renderCell: (params) => {
        return (
          <Link
            href=""
            key={params.row.id}
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              cursor: "pointer",
              ":hover": " underline",
            }}
            onClick={() => {
              handleOpenUpdateOrderDetail();
              setSelectedOrderDetail(params.row.id);
            }}
          >
            {params.row.nameStr}
            {/* <OrderDetailUpdateDialog
              open={openUpdateOderDetail}
              handleClose={handleCloseUpdateOrderDetail}
              id={params.row.id}
            /> */}
          </Link>
        );
      },
    },
    { field: "quality", headerName: "CL", width: 50 },
    {
      field: "quantity",
      headerName: "Số lượng",
      valueGetter: (params) => {
        return `${params.value}  ${
          params.row.measName
        } = ${calculateQualityRate(
          params.row.quantity,
          params.row.rateInRoot
        )} ${measureCategory[params.row.measCatId]}`;
      },
      width: 300,
    },
    { field: "price", headerName: "Giá bán", width: 100, type: "number" },
    {
      field: "total",
      headerName: "Thành tiền",
      width: 150,
      valueGetter: (params) => {
        return (
          params.row.price *
          calculateQualityRate(params.row.quantity, params.row.rateInRoot)
        );
      },
      type: "number",
    },
  ];
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpenAddOrderDetail = () => {
    setOpenAddOderDetail(true);
  };
  const handleCloseAddOrderDetail = () => {
    setOpenAddOderDetail(false);
  };
  const handleOpenUpdateOrderDetail = () => {
    setOpenUpdateOderDetail(true);
  };
  const handleCloseUpdateOrderDetail = () => {
    setOpenUpdateOderDetail(false);
  };
  const totalSum = orderDeatailList.reduce(
    (sum, row) =>
      sum + row.price * calculateQualityRate(row.quantity, row.rateInRoot),
    0
  );
  return (
    <Box>
      <Box display="flex" alignItems="center" marginBottom={2} sx={{ mt: 4 }}>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
          variant="contained"
        >
          Đặt hàng
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            style={{ color: "black", textDecoration: "none" }}
            onClick={handleOpenAddOrderDetail}
          >
            Thêm sản phẩm
          </MenuItem>
          {/* <ProductAddDialog
            open={openAddOderDetail}
            handleCloseAddOrderDetail={handleCloseAddOrderDetail}
          /> */}
          <OrderDetailAddDialog
            open={openAddOderDetail}
            handleCloseAddOrderDetail={handleCloseAddOrderDetail}
            orderID={props.orderID}
          />
          <Link
            // href={"/produce/addSupplyRequests"}
            href={{
              pathname: `/produce/addSupplyRequests`,
              query: {
                name: props.partnerName,
                id: props.orderID,
              },
            }}
            style={{ color: "black", textDecoration: "none" }}
          >
            <MenuItem onClick={handleClose}> Lệnh cung ứng</MenuItem>
          </Link>
          <Link
            href={{
              pathname: "/business/addOrderDelivery",
              query: {
                name: props.partnerName,
                id: props.orderID,
              },
            }}
            style={{ color: "black", textDecoration: "none" }}
          >
            <MenuItem onClick={handleClose}>Lệnh giao hàng</MenuItem>
          </Link>
          <Divider variant="middle" />
          <Link
            href={"/business/deliveryProcess"}
            style={{ color: "black", textDecoration: "none" }}
          >
            <MenuItem onClick={handleClose}>Quá trình giao hàng</MenuItem>
          </Link>
          <Divider variant="middle" />
          <MenuItem onClick={handleClose}>Nhật kí sản xuất</MenuItem>
        </Menu>
      </Box>
      <DataGrid
        rows={orderDeatailList}
        columns={columns}
        autoHeight
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
        components={{
          Footer: () => (
            <GridFooterContainer
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Typography variant="h7" sx={{ marginRight: 4 }}>
                Tổng thành tiền: {totalSum}
              </Typography>
            </GridFooterContainer>
          ),
        }}
      />
      {selectedOrderDeatail && (
        <OrderDetailUpdateDialog
          open={openUpdateOderDetail}
          handleClose={handleCloseUpdateOrderDetail}
          id={selectedOrderDeatail}
          orderID={props.orderID}
        />
      )}
    </Box>
  );
}
