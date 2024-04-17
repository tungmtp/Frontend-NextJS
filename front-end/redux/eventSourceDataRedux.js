import { createSlice } from "@reduxjs/toolkit";

export const eventSourceDataSlice = createSlice({
  name: "eventSourceData",
  initialState: {
    isFetching: false,
    error: false,
    addSegment: "",
  },
  reducers: {
    //GET ALL
    // getOrderStart: (state) => {
    //   state.isFetching = true;
    //   state.error = false;
    // },
    // getOrderSuccess: (state, action) => {
    //   state.isFetching = false;
    //   state.orders = action.payload;
    // },
    // getOrderFailure: (state) => {
    //   state.isFetching = false;
    //   state.error = true;
    // },
    //DELETE
    // deleteOrderStart: (state) => {
    //   state.isFetching = true;
    //   state.error = false;
    // },
    // deleteOrderSuccess: (state, action) => {
    //   state.isFetching = false;
    //   state.products.splice(
    //     state.products.findIndex((item) => item._id === action.payload),
    //     1
    //   );
    // },
    // deleteOrderFailure: (state) => {
    //   state.isFetching = false;
    //   state.error = true;
    // },
    //UPDATE
    // updateOrderStart: (state) => {
    //   state.isFetching = true;
    //   state.error = false;
    // },
    // updateOrderSuccess: (state, action) => {
    //   state.isFetching = false;
    //   state.products[
    //     state.products.findIndex((item) => item._id === action.payload.id)
    //   ] = action.payload.product;
    // },
    // updateOrderFailure: (state) => {
    //   state.isFetching = false;
    //   state.error = true;
    // },
    setAddSegment: (state, action) => {
      state.addSegment = action.payload;
    },
  },
});

export const {
  // getOrderStart,
  // getOrderSuccess,
  // getOrderFailure,
  // deleteOrderStart,
  // deleteOrderSuccess,
  // deleteOrderFailure,
  // updateOrderStart,
  // updateOrderSuccess,
  // updateOrderFailure,
  // addOrderStart,
  // addOrderSuccess,
  // addOrderFailure,
  setAddSegment,
} = eventSourceDataSlice.actions;

export default eventSourceDataSlice.reducer;
