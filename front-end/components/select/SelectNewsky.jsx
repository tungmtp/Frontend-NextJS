import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "lodash.debounce";
import { getData } from "@/hook/Hook";
// import ItemAddDialog from "../dialog/productDialog/ProductAddDialog";

export default function SelectNewsky(props) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  const handleSelectionChange = (event, value) => {
    setSelectedValue(value);
    if (props.emitParent !== undefined) {
      //Trả về value.id hoặc đầy đủ selectedValue dưới dạng String để dùng cho component sau
      props.emitParent(
        value ? (props.returnObject ? JSON.stringify(value) : value.id) : ""
      );
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

  const debouncedFetchOptions = debounce((query) => {
    if (query !== selectedValue?.nameStr) {
      // console.log(query);
      fetchOptions(query).then((items) => {
        // console.log("items:", items);
        setOptions(items);
        setInputValue(query);
      });
    }
  }, 600); // Delay in ms

  useEffect(() => {
    if (props.currentItem) {
      // fetchSelectedItem(props.currentItem);
      if (props.disabled) {
        //   setOptions([])
        console.log(props.lblinput, props.disabled);
      } else {
        fetchFirstCall(props.currentItem).then((items) => {
          let xx = items.find((item) => item.id == props.currentItem);
          setSelectedValue(xx);
          setOptions(items);
        });
      }
    } else {
      //Dành cho mục Addnew khi ko có lựa chọn trước
      setSelectedValue(null);
      if (props.fetchAll) {
        fetchOptions("all").then((items) => {
          setOptions(items);
        });
      } else {
        // setOptions([]);
      }
    }
  }, [props.currentItem]);

  useEffect(() => {
    let mInput = inputValue.toUpperCase();
    switch (mInput) {
      case "":
        // setOptions([]);
        break;
      case "**":
        // setOpenAddItem(true);
        alert("Sẽ mở dialog thêm sản phẩm");
        break;
      case "FF":
        alert("Sẽ mở dialog lọc sản phẩm");
        break;
      default:
        if (mInput.length > 2 && mInput.startsWith("++")) {
          debouncedFetchOptions(inputValue.substring(2, inputValue.length));
        }
    }
    return () => {
      debouncedFetchOptions.cancel();
    };
  }, [inputValue]);
  return (
    <Autocomplete
      fullWidth
      size="small"
      disabled={props.disabled == undefined ? false : true}
      // sx={
      //   props?.style && typeof props?.style === "object"
      //     ? props.style
      //     : { m: 2 }
      // }
      inputValue={inputValue}
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
              <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
