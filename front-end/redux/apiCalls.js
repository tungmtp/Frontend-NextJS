import { deleteData, getData, postData, putData } from "@/hook/Hook";
import {
  addCategoryProductFailure,
  addCategoryProductStart,
  addCategoryProductSuccess,
  deleteCategoryProductFailure,
  deleteCategoryProductStart,
  deleteCategoryProductSuccess,
  getCategoryProductFailure,
  getCategoryProductStart,
  getCategoryProductSuccess,
  updateCategoryProductFailure,
  updateCategoryProductStart,
  updateCategoryProductSuccess,
} from "./categoryProductRedux";

// export const login = async (dispatch, user) => {
//   dispatch(loginStart());
//   try {
//     const res = await publicRequest.post("/auth/login", user);
//     dispatch(loginSuccess(res.data));
//   } catch (err) {
//     dispatch(loginFailure());
//   }
// };
// export const log_out = async (dispatch, user) => {
//   try {

//     dispatch(logout(user));
//   } catch (err) {
//     console.log(err)
//   }
// };
// export const getUsers = async (dispatch) => {
//   dispatch(getUserStart());
//   try {
//     const res = await userRequest.get("/users");
//     dispatch(getUserSuccess(res.data));
//   } catch (err) {
//     dispatch(getUserFailure());
//   }
// };

export const getCategoryProducts = async (dispatch) => {
  dispatch(getCategoryProductStart());
  try {
    const res = await getData("/product-service/category");
    dispatch(getCategoryProductSuccess(res));
  } catch (err) {
    dispatch(getCategoryProductFailure());
  }
};

export const deleteCategoryProduct = async (id, dispatch) => {
  dispatch(deleteCategoryProductStart());
  try {
    const res = await deleteData("/product-service/category", id);
    dispatch(deleteCategoryProductSuccess(id));
  } catch (err) {
    dispatch(deleteCategoryProductFailure());
  }
};

export const updateCategoryProduct = async (id, categoryProduct, dispatch) => {
  dispatch(updateCategoryProductStart());
  try {
    // update
    const res = await putData(`/product-service/category`, id, categoryProduct);
    dispatch(updateCategoryProductSuccess({ id, categoryProduct }));
  } catch (err) {
    dispatch(updateCategoryProductFailure());
  }
};
export const addCategoryProduct = async (categoryProduct, dispatch) => {
  dispatch(addCategoryProductStart());
  try {
    const res = await postData(`/product-service/category`, categoryProduct);

    dispatch(addCategoryProductSuccess(res));
  } catch (err) {
    dispatch(addCategoryProductFailure());
  }
};

//ORDER
// export const getOrders = async (dispatch) => {
//   dispatch(getOrderStart());
//   try {
//     const res = await userRequest.get("/orders");
//     dispatch(getOrderSuccess(res.data));
//   } catch (err) {
//     dispatch(getOrderFailure());
//   }
// };
