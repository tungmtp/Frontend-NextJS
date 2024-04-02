import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function Dropdown(props) {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={props.options}
      sx={{ width: 300 }}
      //   value={props.options.find(
      //     (item) => item.id === props.options.selectedDataGrid
      //   )}
      renderInput={(params) => <TextField {...params} label="test dropdown" />}
      onChange={props.onChange(props.productId)}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
