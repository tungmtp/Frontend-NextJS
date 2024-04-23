import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "lodash.debounce";
import { getData } from "@/hook/Hook";
import AddProduct from "../addProduct/AddProduct";
import { Paper } from "@mui/material";
import ProductAddDialog from "../dialog/productDialog/ProductAddDialog";

export default function SelectProduct(props) {
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [openAddDialogMeas, setOpenAddDialogMeas] = useState(false);
  const [openAddDialogSegment, setOpenAddDialogSegment] = useState(false);
  const [openAddDialogClassPrice, setOpenAddDialogClassPrice] = useState(false);

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [firstCall, setfirstCall] = useState(true);
  const handleOpenAddproduct = () => {
    setOpenAddProduct(true);
  };
  const handleCloseAddproduct = () => {
    setOpenAddProduct(false);
  };
  const handleSelectionChange = (event, value) => {
    setSelectedValue(value ? value.Id : "");
    if (props.emitParent !== undefined) {
      props.emitParent(value ? value.Id : "");
    }
  };
  const fetchOptions = async (query) => {
    try {
      const result = await getData(
        `/product-service/product/byNameStr/${query}`
      );
      return result;
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // const fetchOptions = async (query) => {
  //   // Replace with your actual API call logic
  //   return fetch(
  //     `${process.env.NEXT_PUBLIC_DB_HOST}/product-service/product/byNameStr/${query}`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => data.items);
  // };

  const fetchFirstCall = async (id) => {
    try {
      const result = await getData(`/product-service/product/firstCall/${id}`);
      return result;
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  // const fetchFirstCall = async (id) => {
  //   return fetch(
  //     `${process.env.NEXT_PUBLIC_DB_HOST}/product-service/product/firstCall/${id}`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => data.items);
  // };

  // Debounce the API call
  const debouncedFetchOptions = debounce((query) => {
    fetchOptions(query).then((items) => {
      setOptions(items);
    });
  }, 600); // Delay in ms

  useEffect(() => {
    if (props.currenProduct && firstCall) {
      fetchFirstCall(props.currenProduct).then((items) => {
        setfirstCall(false);
        setOptions(items);
      });
    }

    switch (inputValue.toUpperCase()) {
      case "":
        setOptions([]);
        break;
      case "++":
        setOpenAddProduct(true);
        break;
      case "FF":
        alert("Sẽ mở dialog lọc sản phẩm");
        break;
      default:
        debouncedFetchOptions(inputValue);
    }
    // if (inputValue === '') {
    //     setOptions([]);
    // } else {
    //     debouncedFetchOptions(inputValue);
    // }

    // Clean up function to cancel the debounce on unmount
    return () => {
      debouncedFetchOptions.cancel();
    };
  }, [inputValue]);
  console.log(inputValue);
  console.log(options);
  return (
    <div>
      <Autocomplete
        fullWidth
        sx={{ width: "500px" }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        getOptionLabel={(option) => option.nameStr || ""} // Adjust based on your data
        options={options && options?.status != 404 ? options : []}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        // onChange={handleSelectionChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search input"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
      <ProductAddDialog
        open={openAddProduct}
        handleCloseAddproduct={handleCloseAddproduct}
      />
    </div>
  );
}
