'use client'
import { asyncGetData } from "@/hook/Hook";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import { Grid } from "@mui/material";

export default function ControlMinimumInventory() {
  const [inventoryLow, setInventoryLow] = useState([]);

  const columns = [
    { field: "index", headerName: "STT", flex: 10 },
    { field: "productID", headerName: "Id" },
    {
      field: "productName",
      headerName: "Tên sản phẩm",
      flex: 40,

      renderCell: (params) => {

        return (
          <Link
            href={"#"}
            style={{ color: "black" }}
            key={params.row.id}
            color="inherit"
            variant="body1"
          // onClick={() => {
          //   setSelectedDataGrid(params.row);
          // }
          // } 
          >
            {params.row.productName}
          </Link>
        );
      },
    },
    { field: "MeasName", headerName: "ĐVT", flex: 20 },
    { field: "minimumStock", headerName: "Tối thiểu", flex: 10 },

    {
      field: "mm", headerName: "Tồn kho", flex: 20,
      renderCell: (params) => {
        return (
          params.row.tonDK + params.row.Nhap - params.row.Xuat
        );
      },
    },
  ];

  function getRowId(row) {
    return row.productID;
  }


  const getDataInventory = () => {
    asyncGetData("/common-module/eventList/inventoryLow")
      .then(response => response.json())
      .then(data => setInventoryLow(data))
      .catch(e => console.log(e))
  }

  useEffect(() => {
    getDataInventory();
  }, [])

  return (
    <Grid container spacing={0.5}>
      <Grid item xs={12}>
        <DataGrid
          getRowId={getRowId}
          rows={inventoryLow}
          columns={columns}
          pageSize={1}

          initialState={{
            columns: {
              columnVisibilityModel: {
                productID: false,
              },
            },
            pagination: {
              paginationModel: {
                pageSize: 15,
              },
            },
          }}
          pageSizeOptions={[5]}
        // sx={{ height: "305px", minWidth: "305px" }}
        />
      </Grid>
    </Grid>
  );
}
