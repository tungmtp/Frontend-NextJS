import { selectCategoryProducts } from "@/redux/categoryProductRedux";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ChildCategory() {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(
    (state) => state.categoryProduct.selectedCategory
  );
  const categoryProducts = useSelector(
    (state) => state.categoryProduct.categoryProducts
  );

  // Lọc tất cả các mục con của selectedCategory
  const childCategories = categoryProducts.filter(
    (category) => category.isChildOf === selectedCategory
  );

  return (
    <div>
      {childCategories.map((category) => (
        <div key={category.id}>{category.catName}</div>
      ))}
    </div>
  );
}
