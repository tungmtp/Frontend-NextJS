import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/lab/Autocomplete';
import debounce from 'lodash.debounce';

export default function searchProduct(props) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [firstCall, setfirstCall] = useState(true);

    const handleSelectionChange = (event, value) => {
        setSelectedValue(value ? value.Id : '');
        if (props.emitParent !== undefined) {
            props.emitParent(value ? value.Id : '');
        }
    }

    const fetchOptions = async (query) => {
        // Replace with your actual API call logic
        return fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/product-service/product/byNameStr/${query}`)
            .then(response => response.json())
            .then(data => data.items);
    };

    const fetchFirstCall = async (id) => {
        return fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/product-service/product/firstCall/${id}`)
            .then(response => response.json())
            .then(data => data.items);
    }

    // Debounce the API call
    const debouncedFetchOptions = debounce((query) => {
        fetchOptions(query).then(items => {
            setOptions(items);
        });
    }, 1000);  // Delay in ms

    useEffect(() => {
        if (props.currenProduct && firstCall) {
            fetchFirstCall(props.currenProduct).then(items => {
                setfirstCall(false);
                setOptions(items);
            });
        }

        switch (inputValue.toUpperCase()) {
            case '':
                setOptions([]);
                break
            case '#++':
                alert('Sẽ mở tab thêm sản phẩm mới');
                break;
            case '#FF':
                alert('Sẽ mở dialog lọc sản phẩm');
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

    return (
        <Autocomplete
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            getOptionLabel={(option) => option.nameStr || ''}  // Adjust based on your data
            options={options}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            onChange={handleSelectionChange}
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
    );
}
