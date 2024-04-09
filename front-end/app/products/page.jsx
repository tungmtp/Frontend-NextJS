"use client";
import { deleteData, getData, postData, putData } from "@/hook/Hook";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem, useTreeItem } from "@mui/x-tree-view/TreeItem";
import {
  Button,
  Checkbox,
  Dialog,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AddBoxTwoToneIcon from "@mui/icons-material/AddBoxTwoTone";
import AccountTreeTwoToneIcon from "@mui/icons-material/AccountTreeTwoTone";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import BorderColorTwoToneIcon from "@mui/icons-material/BorderColorTwoTone";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategoryProduct,
  deleteCategoryProduct,
  getCategoryProducts,
  updateCategoryProduct,
} from "@/redux/apiCalls";
import {
  setSelectedCategory,
  setSelectedProduct,
} from "@/redux/categoryProductRedux";

export default function TreeViewCompTest(PropData) {
  return (
    <>
      {/* <TreeViewComp
        serviceURL={"/product-service/category"}
        title={"catName"}
      /> */}
    </>
  );
}

function TreeViewComp(PropData) {
  const [selectedSingleNode, setSelectedSingleNodes] = useState("");
  const dispatch = useDispatch();
  const products = useSelector(
    (state) => state.categoryProduct.categoryProducts
  );
  useEffect(() => {
    getCategoryProducts(dispatch, PropData.serviceURL);
  }, [dispatch]);

  const CustomContent = React.forwardRef(function CustomContent(props, ref) {
    const {
      classes,
      className,
      label,
      nodeId,
      icon: iconProp,
      expansionIcon,
      displayIcon,
    } = props;

    const {
      disabled,
      expanded,
      selected,
      focused,
      handleExpansion,
      handleSelection,
      preventSelection,
    } = useTreeItem(nodeId);

    const icon = iconProp || expansionIcon || displayIcon;

    const handleMouseDown = (event) => {
      preventSelection(event);
    };

    const handleExpansionClick = (event) => {
      handleExpansion(event);
    };

    const handleSelectionClick = (event, nodeId) => {
      console.log(nodeId);
      setSelectedSingleNodes(nodeId);
    };

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        className={clsx(className, classes.root, {
          [classes.expanded]: expanded,
          [classes.selected]: selected,
          [classes.focused]: focused,
          [classes.disabled]: disabled,
        })}
        // onMouseDown={handleMouseDown}
        ref={ref}
      >
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <div onClick={handleExpansionClick} className={classes.iconContainer}>
          {icon}
        </div>
        <Typography
          onClick={(event) => {
            handleSelectionClick(event, nodeId);
            if (PropData.handleCloseAddproduct)
              PropData?.handleCloseAddproduct();
          }}
          component="div"
          className={classes.label}
        >
          {label}
        </Typography>
      </div>
    );
  });
  const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
    return <TreeItem ContentComponent={CustomContent} {...props} ref={ref} />;
  });
  const buildCategoryTree = (categoryData, parentId = null) => {
    const filteredCategories = categoryData?.filter(
      (category) => category?.isChildOf === parentId
    );
    return filteredCategories?.map((category) => {
      const hasChildren = categoryData.some(
        (c) => c?.isChildOf === category.id
      );
      return {
        id: category.id?.toString(), // Convert ID to string
        name: category[PropData.title],
        children: hasChildren
          ? buildCategoryTree(categoryData, category.id)
          : [],
      };
    });
  };
  const CategoryTree = buildCategoryTree(products);

  const renderTree = (nodes) => {
    const isLeafNode = nodes.children.length === 0;

    return (
      <CustomTreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>{nodes.name}</div>
          </div>
        }
        selected={selectedSingleNode}
      >
        {nodes.children.map((node) => renderTree(node))}
      </CustomTreeItem>
    );
  };

  return (
    <div>
      <Box sx={{ minHeight: 110 }}>
        <div style={{ overflow: "auto", height: "79vh" }}>
          <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            selected={selectedSingleNode}
          >
            {CategoryTree?.map((object) => renderTree(object))}
          </TreeView>
        </div>
      </Box>
    </div>
  );
}
