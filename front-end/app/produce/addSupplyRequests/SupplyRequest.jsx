import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { asyncFetch } from "@/hook/Hook";


const MyContext = createContext();

export function MyProvider({ children }) {
    const [listDate, setListDate] = useState([]);

    const getListRequestDate = useCallback(
        (orderID) => {
            asyncFetch("GET", `/produce-service/ordersProduce/orderRequestDistinctDate/${orderID}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setListDate(data)
                })
                .catch(err => console.error(err))
        }
        , []);

    const addNewListRequest = (data) => {
        asyncFetch("POST", "/produce-service/ordersProduce/addlist", data)
            .then(response => {
                if (response.ok) {
                    getListRequestDate();
                }
            })
            .catch(e => console.log(e));
    }

    // useEffect(() => {
    //     getListRequestDate(orderID);
    // }, [getListRequestDate]);

    return (
        <MyContext.Provider value={{
            listDate,
            getListRequestDate,
            addNewListRequest
        }}>
            {children}
        </MyContext.Provider>
    )
}

export function useSupplyRequest() {
    return useContext(MyContext)
}