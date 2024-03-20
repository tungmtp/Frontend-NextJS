import { createSlice } from "@reduxjs/toolkit";

export const categoryProductSlice = createSlice({
  name: "categoryProduct",
  initialState: {
    categoryProducts: [],
    selectedCategory: "",
    isFetching: false,
    error: false,
  },
  reducers: {
    //GET ALL
    getCategoryProductStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getCategoryProductSuccess: (state, action) => {
      state.isFetching = false;
      state.categoryProducts = action.payload;
    },
    getCategoryProductFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //DELETE
    deleteCategoryProductStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    deleteCategoryProductSuccess: (state, action) => {
      state.isFetching = false;
      state.categoryProducts.splice(
        state.categoryProducts.findIndex((item) => item._id === action.payload),
        1
      );
    },
    deleteCategoryProductFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //UPDATE
    updateCategoryProductStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    updateCategoryProductSuccess: (state, action) => {
      state.isFetching = false;
      state.categoryProducts[
        state.categoryProducts.findIndex(
          (item) => item._id === action.payload.id
        )
      ] = action.payload.categoryProduct;
    },
    updateCategoryProductFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //ADD
    addCategoryProductStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    addCategoryProductSuccess: (state, action) => {
      state.isFetching = false;
      state.categoryProducts.push(action.payload);
    },
    addCategoryProductFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    // Thêm reducer mới để cập nhật selectedCategory
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
});
export const selectCategoryProducts = (state) => {
  const { categoryProducts, selectedCategory } = state.categoryProduct;
  if (!selectedCategory) {
    return categoryProducts;
  } else {
    return categoryProducts.filter(
      (product) => product.isChildOf === selectedCategory
    );
  }
};
export const {
  getCategoryProductStart,
  getCategoryProductSuccess,
  getCategoryProductFailure,
  deleteCategoryProductStart,
  deleteCategoryProductSuccess,
  deleteCategoryProductFailure,
  updateCategoryProductStart,
  updateCategoryProductSuccess,
  updateCategoryProductFailure,
  addCategoryProductStart,
  addCategoryProductSuccess,
  addCategoryProductFailure,
  setSelectedCategory,
} = categoryProductSlice.actions;

export default categoryProductSlice.reducer;
