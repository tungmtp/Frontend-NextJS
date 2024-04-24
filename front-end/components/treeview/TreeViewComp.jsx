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
import Divider from "@mui/material/Divider";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import "./treeViewComp.css";
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

export default function TreeViewComp(PropData) {
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openFixDialog, setOpenFixDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedSingleNode, setSelectedSingleNodes] = useState("");
  const [addCategory, setAddCategory] = useState({
    [PropData.title.toString()]: "",
    isChildOf: "",
  });
  const dispatch = useDispatch();
  const selectedCategory = useSelector(
    (state) => state.categoryProduct.selectedCategory
  );
  const products = useSelector(
    (state) => state.categoryProduct.categoryProducts
  );
  // console.log(products);

  useEffect(() => {
    getCategoryProducts(dispatch, PropData.serviceURL);
    setCategoryData(products);
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
      //handleSelection(event);
      console.log(nodeId);
      // const isSelected = selectedNodes.includes(nodeId);
      if (PropData.status == "forSelect") {
        PropData.setSelectedNode(nodeId);
        setSelectedSingleNodes(nodeId);
      } else {
        dispatch(setSelectedCategory(nodeId));
        dispatch(setSelectedProduct(null));
        setSelectedSingleNodes(nodeId);
      }

      // if (isSelected) {
      //   setSelectedNodes(selectedNodes.filter((id) => id !== nodeId));
      //   setSelectedSingleNodes(null);
      // } else {
      //   setSelectedNodes([...selectedNodes, nodeId]);
      //   setSelectedSingleNodes(nodeId);
      //   dispatch(setSelectedCategory(nodeId));
      // }
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

  // const handleCheckboxChange = (event, nodeId) => {
  //   const isChecked = event.target.checked;

  //   if (isChecked) {
  //     setSelectedNodes([...selectedNodes, nodeId]);
  //     setSelectedSingleNodes(nodeId);
  //   } else {
  //     setSelectedNodes(selectedNodes.filter((id) => id !== nodeId));
  //     setSelectedSingleNodes(null);
  //   }
  // };

  // const handleNodeSelect = (event, nodeId) => {
  //   const isSelected = selectedNodes.includes(nodeId);

  //   if (isSelected) {
  //     setSelectedNodes(selectedNodes.filter((id) => id !== nodeId));
  //     setSelectedSingleNodes(null);
  //   } else {
  //     setSelectedNodes([...selectedNodes, nodeId]);
  //     setSelectedSingleNodes(nodeId);
  //     dispatch(setSelectedCategory(nodeId));
  //   }
  // };
  // console.log("Selected Node ID:", selectedSingleNode);
  // console.log("data sẽ gửi:", addCategory);

  const CategoryTree = buildCategoryTree(products);

  const renderTree = (nodes) => {
    const isLeafNode = nodes.children.length === 0;

    return (
      <CustomTreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* {isLeafNode && (
              <Checkbox
                checked={selectedNodes.includes(nodes.id)}
                onChange={(event) => handleCheckboxChange(event, nodes.id)}
              />
            )} */}
            <div>{nodes.name}</div>
          </div>
        }
        //onClick={(event) => isLeafNode && handleNodeSelect(event, nodes.id)}
        // onClick={(event) => {
        //   handleNodeSelect(event, nodes.id);
        // }}
        selected={selectedNodes.includes(nodes.id)}
      >
        {nodes.children.map((node) => renderTree(node))}
      </CustomTreeItem>
    );
  };

  const handleOpenAdd = () => {
    setOpenAddDialog(true);
    setAddCategory({ isChildOf: null });
  };
  const handleOpenAddChild = (event) => {
    if (!selectedSingleNode) {
      event.preventDefault();
      alert("Bạn chưa chọn vị trí thư mục");
    } else {
      setOpenAddDialog(true);
      setAddCategory({ isChildOf: selectedSingleNode });
    }
  };
  const handleClose = () => {
    setOpenAddDialog(false);
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setAddCategory((prevState) => ({
      ...prevState,
      [name]: name === "catName" ? value : prevState.isChildOf,
    }));
  };

  function FormAddDialog(open) {
    const seltecedCatName = products.find(
      (item) => item?.id === selectedSingleNode
    );

    return (
      <React.Fragment>
        <Dialog
          open={open.open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const catName = formJson.catName;

              const addCategory1 = {
                [PropData.title.toString()]: catName,
                isChildOf: addCategory.isChildOf,
              };

              console.log(addCategory);

              // const postCategoryProduct = async () => {
              //   try {
              //     const result = await postData(
              //       "/product-service/category",
              //       addCategory
              //     );
              //     const addCategory2 = {
              //       catName: catName,
              //       isChildOf: selectedSingleNode,
              //       id: result.id,
              //     };
              //     setCategoryData((prevState) => [...prevState, addCategory2]);
              //   } catch (err) {
              //     console.error("Error fetching data:", err);
              //   }
              // };
              // postCategoryProduct();
              addCategoryProduct(addCategory1, dispatch, PropData.serviceURL);
              alert("Thêm thành công !!!");
              handleClose();
              //window.location.reload(false);
            },
          }}
        >
          <DialogTitle>
            {addCategory.isChildOf
              ? `Thêm thư mục vào: ${seltecedCatName?.[PropData.title]}`
              : "Thêm thư mục gốc"}
            {/* Thêm thư mục vào: {seltecedCatName?.catName}*/}
          </DialogTitle>
          <DialogContent>
            <TextField
              required
              margin="dense"
              id="name"
              name="catName"
              label="Tên thư mục"
              type="text"
              fullWidth
              variant="standard"
              // onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }

  const handleOpenFix = (event) => {
    if (!selectedSingleNode) {
      event.preventDefault();
      alert("Bạn chưa chọn vị trí thư mục");
    } else {
      setOpenFixDialog(true);
    }
  };
  const handleCloseFix = () => {
    setOpenFixDialog(false);
  };

  function FormFixdDialog(open) {
    const seltecedCatName = products?.find(
      (item) => item?.id === selectedSingleNode
    );
    return (
      <React.Fragment>
        <Dialog
          open={open.open}
          onClose={handleCloseFix}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const newName = formJson.newName;
              const fixCategory = {
                [PropData.title.toString()]: newName,
                isChildOf: seltecedCatName.isChildOf,
              };
              // const respone = putData(
              //   "/product-service/category",
              //   selectedSingleNode,
              //   fixCategory
              // );
              updateCategoryProduct(
                selectedSingleNode,
                fixCategory,
                dispatch,
                PropData.serviceURL
              );

              // const updatedCategoryData = categoryData.map((item) => {
              //   if (item.id === selectedSingleNode) {
              //     return { ...item, catName: catNewName };
              //   }
              //   return item;
              // });
              // setCategoryData(updatedCategoryData);
              handleCloseFix();
            },
          }}
        >
          <DialogTitle>
            Đổi tên thư mục: {seltecedCatName?.[PropData.title]}
          </DialogTitle>

          <DialogContent>
            <TextField
              required
              margin="dense"
              id="name"
              name="newName"
              label="Tên mới:"
              type="text"
              fullWidth
              variant="standard"
              // onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFix}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
  const handleOpenDelete = (event) => {
    if (!selectedSingleNode) {
      event.preventDefault();
      alert("Bạn chưa chọn vị trí thư mục");
    } else {
      setOpenDeleteDialog(true);
      // setAddCategory({ isChildOf: selectedSingleNode });
    }
  };
  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
  };
  function FormDeleteDialog(open) {
    const seltecedCatName = products?.find(
      (item) => item?.id === selectedSingleNode
    );
    return (
      <React.Fragment>
        <Dialog
          open={open.open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              // const respone = deleteData(
              //   "/product-service/category",
              //   selectedSingleNode
              // );
              // console.log(respone);
              // const updatedCategoryData = categoryData.filter(
              //   (item) => item.id !== selectedSingleNode
              // );
              // setCategoryData(updatedCategoryData);
              deleteCategoryProduct(
                selectedSingleNode,
                dispatch,
                PropData.serviceURL
              );
              handleCloseDelete();
              alert("Xóa thành công");
            },
          }}
        >
          <DialogTitle>
            Xóa thư mục: {seltecedCatName?.[PropData.title]}{" "}
          </DialogTitle>
          <DialogContent>Bạn chắc chắn muốn xóa thư mục này?</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }

  return (
    <div>
      <Box sx={{ minHeight: 110 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
            borderRadius: 7,
            marginBottom: "16px",
          }}
        >
          <IconButton aria-label="add" onClick={handleOpenAdd} color="primary">
            <AddBoxTwoToneIcon />
          </IconButton>
          <IconButton
            aria-label="addChild"
            onClick={handleOpenAddChild}
            color="primary"
          >
            <AccountTreeTwoToneIcon />
          </IconButton>
          <FormAddDialog open={openAddDialog} />
          <IconButton aria-label="fix" onClick={handleOpenFix} color="warning">
            <BorderColorTwoToneIcon />
          </IconButton>
          <FormFixdDialog open={openFixDialog} />
          <IconButton
            aria-label="delete"
            onClick={handleOpenDelete}
            color="error"
          >
            <DeleteForeverTwoToneIcon />
          </IconButton>
          <FormDeleteDialog open={openDeleteDialog} />
        </div>
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
