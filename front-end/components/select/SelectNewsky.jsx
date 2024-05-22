import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "lodash.debounce";
import { getData } from "@/hook/Hook";
// import ItemAddDialog from "../dialog/productDialog/ProductAddDialog";

export default function SelectNewsky(props) {
  const [openAddItem, setOpenAddItem] = useState(false);

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  const handleOpenAddItem = () => {
    setOpenAddItem(true);
  };
  const handleCloseAddItem = () => {
    setOpenAddItem(false);
  };
  const handleSelectionChange = (event, value) => {
    setSelectedValue(value);
    if (props.emitParent !== undefined) {
      props.emitParent(value ? value.id : "");
    }
  };
  const fetchOptions = async (query) => {
    try {
      const result = await getData(`${props.byNameStr}/${query}`);
      return result;
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const fetchFirstCall = async (id) => {
    try {
      const result = await getData(`${props.firstCall}/${id}`);
      return result;
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const fetchSelectedItem = async (id) => {
    try {
      const result = await getData(`${props.currentItemLink}/${id}`);
      if (!result.error) {
        setSelectedValue(result);
        setOptions(options => [result, ...options]);
        // setOptions(prevOptions => [result, ...prevOptions]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const debouncedFetchOptions = debounce((query) => {
    if (query !== selectedValue?.nameStr) {
      fetchOptions(query).then((items) => {
        // console.log("items:", items);
        setOptions(items);
      });
    }
  }, 600); // Delay in ms

  useEffect(() => {
    if (props.currentItem) {
      fetchSelectedItem(props.currentItem);
      fetchFirstCall(props.currentItem).then((items) => {
        setOptions(items);
      });
    }
  }, [props.currentItem]);

  useEffect(() => {
    switch (inputValue.toUpperCase()) {
      case "":
        // setOptions([]);
        break;
      case "++":
        // setOpenAddItem(true);
        alert("Sẽ mở dialog thêm sản phẩm");
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

    <Autocomplete
      fullWidth
      size="small"
      // sx={
      //   props?.style && typeof props?.style === "object"
      //     ? props.style
      //     : { m: 2 }
      // }
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionLabel={(option) => option.nameStr || ""} // Adjust based on your data
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.id}>
            {option.nameStr}
          </li>
        );
      }}
      options={options && options?.status != 404 ? options : []}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={handleSelectionChange}
      value={selectedValue}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.lblinput ? props.lblinput : "Search input"}
          variant="outlined"
          InputProps={{
            ...params.InputProps, //style: { fontSize: `12 !important` },
            endAdornment: (
              <React.Fragment>
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />

  );
}
