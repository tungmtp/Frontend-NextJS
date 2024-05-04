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
  // const [openAddDialogMeas, setOpenAddDialogMeas] = useState(false);
  // const [openAddDialogSegment, setOpenAddDialogSegment] = useState(false);
  // const [openAddDialogClassPrice, setOpenAddDialogClassPrice] = useState(false);

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [firstCall, setFirstCall] = useState(true);
  const handleOpenAddproduct = () => {
    setOpenAddProduct(true);
  };
  const handleCloseAddproduct = () => {
    setOpenAddProduct(false);
  };
  const handleSelectionChange = (event, value) => {
    setSelectedValue(value);
    if (props.emitParent !== undefined) {
      props.emitParent(value ? value.id : "");
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


  const fetchFirstCall = async (id) => {
    try {
      const result = await getData(`/product-service/product/firstCall/${id}`);
      return result;
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const debouncedFetchOptions = debounce((query) => {
    const findQuery = options.find(item => item.nameStr == query);
    console.log("query:", query);
    console.log("findQuery:", findQuery);
    if (findQuery == undefined) {
      fetchOptions(query).then((items) => {
        setOptions(items);
      });
    }
  }, 600); // Delay in ms

  useEffect(() => {
    if (props.currentProduct) {
      fetchFirstCall(props.currentProduct).then((items) => {
        setOptions(items);
        setSelectedValue(items.find((item) => item.id == props.currentProduct))
      });
    }
  }, [props.currentProduct])

  useEffect(() => {
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
    return () => {
      debouncedFetchOptions.cancel();
    };
  }, [inputValue]);

  return (
    <div>
      <Autocomplete
        fullWidth
        size="small"
        sx={{ width: "640px" }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        getOptionLabel={(option) => option.nameStr || ""} // Adjust based on your data
        options={options && options?.status != 404 ? options : []}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={handleSelectionChange}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={selectedValue}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.lblinput ? props.lblinput : "Search input"}
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
