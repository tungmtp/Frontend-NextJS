import {
  selectCategoryProducts,
  setSelectedCategory,
  setSelectedProduct,
} from "@/redux/categoryProductRedux";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import FolderOpenTwoToneIcon from "@mui/icons-material/FolderOpenTwoTone";
import DetailProduct from "../detailProduct/DetailProduct";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { deleteData, getData, getDataById, postData } from "@/hook/Hook";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import AddProduct from "../addProduct/AddProduct";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem, useTreeItem } from "@mui/x-tree-view/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import clsx from "clsx";

export default function ProductAttribute(parentProp) {
  const [categoryAttribute, setCategoryAttribute] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState();
  const [productRelation, setProductRelation] = useState([]);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  // const [openAddProduct, setOpenAddProduct] = useState(false);
  let arrayLenght = productRelation.length;
  const dispatch = useDispatch();

  const selectedCategory = useSelector(
    (state) => state.categoryProduct.selectedCategory
  );
  const selectedProduct = useSelector(
    (state) => state.categoryProduct.selectedProduct
  );
  //   console.log(selectedProduct);
  const categoryProducts = useSelector(
    (state) => state.categoryProduct.categoryProducts
  );

  // Lọc tất cả các mục con của selectedCategory
  //   const childCategories = categoryProducts.filter(
  //     (category) => category?.isChildOf === selectedCategory
  //   );
  // console.log(childCategories);
  const hasChildren = (categoryId) => {
    const child = categoryProducts.filter(
      (category1) => category1?.isChildOf === categoryId
    );
    if (child?.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  //   console.log(productRelation);
  useEffect(() => {
    if (parentProp.serviceURL) {
      const getCategoryAttribute = async () => {
        try {
          const result = await getData(parentProp.serviceURL);
          setCategoryAttribute(result);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      };
      if (parentProp.status == "add") {
        setProductRelation([]);
      } else {
        const getProductRelation = async () => {
          try {
            const result2 = await getDataById(
              "/product-service/productRelation/byProductID",
              selectedProduct.id
            );
            setProductRelation(result2);
          } catch (err) {
            console.error("Error fetching data:", err);
          }
        };
        getProductRelation();
      }
      getCategoryAttribute();
      if (parentProp.getProductRelationList != undefined) {
        parentProp.getProductRelationList(productRelation);
      }
    }
  }, []);
  //xu ly mo component add product
  // const handleOpenAddproduct = () => {
  //   setOpenAddProduct(true);
  // };
  // const handleCloseAddproduct = () => {
  //   setOpenAddProduct(false);
  // };

  const handleClick = (id) => {
    // dispatch(setSelectedCategory(id));
    // dispatch(setSelectedProduct(null));
  };
  // console.log(parentProp.getProductRelationList);

  const handleOpenAdd = (event) => {
    event.preventDefault();
    setOpenAddDialog(true);
  };
  const handleClose = (event) => {
    event.preventDefault();
    setOpenAddDialog(false);
  };
  function FormAddDialog(open) {
    const [attributeRelId, setAttributeRelId] = React.useState(null);
    let attributeRelId1 = attributeRelId;

    let relTable = "productAttribute";
    let addAttribute = null;
    if (parentProp.status == "add") {
      addAttribute = {
        id: arrayLenght + 1,
        productId: null,
        relId: attributeRelId1,
        relTable: relTable,
      };
    } else {
      addAttribute = {
        productId: selectedProduct.id,
        relId: attributeRelId1,
        relTable: relTable,
      };
    }

    return (
      <React.Fragment>
        <Dialog
          open={open.open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();

              console.log(addAttribute);
              if (parentProp.status == "add") {
                if (addAttribute.relId !== null)
                  setProductRelation((prevState) => [
                    ...prevState,
                    addAttribute,
                  ]);
              } else {
                const postAttribute = async () => {
                  try {
                    const result = await postData(
                      "/product-service/productRelation",
                      addAttribute
                    );
                    const addAttribute1 = result;
                    setProductRelation((prevState) => [
                      ...prevState,
                      addAttribute1,
                    ]);
                  } catch (err) {
                    console.error("Error fetching data:", err);
                  }
                };
                postAttribute();
              }

              handleClose(event);
            },
          }}
        >
          <DialogTitle>Thêm thuộc tính</DialogTitle>
          <DialogContent>
            <Box sx={{ width: "300px" }}></Box>
            <TreeViewComp
              data={categoryAttribute}
              title={"attName"}
              setAttributeRelId={setAttributeRelId}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
  // console.log(selectedAttribute);
  const handleOpenDelete = (item) => {
    setOpenDeleteDialog(true);
    setSelectedAttribute(item);
    // setAddCategory({ isChildOf: selectedSingleNode });
  };
  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedAttribute(null);
  };
  function FormDeleteDialog(open) {
    return (
      <React.Fragment>
        <Dialog
          open={open.open}
          onClose={handleCloseDelete}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              if (parentProp.status == "add") {
                const updatedData = productRelation.filter(
                  (item) => item.id !== selectedAttribute.id
                );
                setProductRelation(updatedData);
              } else {
                const respone = deleteData(
                  "/product-service/productRelation",
                  selectedAttribute.id
                );
                console.log(respone);
                const updatedData = productRelation.filter(
                  (item) => item.id !== selectedAttribute.id
                );
                setProductRelation(updatedData);
              }
              handleCloseDelete();
              alert("Xóa thành công");
            },
          }}
        >
          <DialogTitle>Xóa thuộc tính</DialogTitle>
          <DialogContent>Bạn chắc chắn muốn xóa thuộc tính này?</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
  const generateBreadcrumbs = (
    categories,
    selectedCategoryId,
    selectedAttribute,
    handleClick
  ) => {
    const breadcrumbs = [];

    // Hàm đệ quy để tìm kiếm parent của selectedCategoryId
    const findParent = (categoryId, isLastChild = false) => {
      const category = categories?.find((cat) => cat?.id === categoryId);
      if (category) {
        if (category.isChildOf) {
          findParent(category.isChildOf, false);
        }
        if (!isLastChild) {
          breadcrumbs.push(
            <Link
              underline="hover"
              sx={{ color: "black", fontSize: "1rem" }}
              key={category.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleClick(category.id);
              }}
            >
              {category[parentProp.title]}
            </Link>
          );
        } else {
          breadcrumbs.push(
            <div style={{}}>
              <Link
                underline="none"
                key={category.id}
                variant="body1"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(category.id);
                }}
              >
                {category[parentProp.title]}
              </Link>

              <IconButton
                aria-label="delete"
                sx={{ marginLeft: 4 }}
                onClick={() => handleOpenDelete(selectedAttribute)}
              >
                <DeleteIcon color="warning" />
              </IconButton>
            </div>
          );
        }
      }
    };

    findParent(selectedCategoryId, true);
    return breadcrumbs;
  };
  const breadcrumbs = productRelation.map((item) => {
    const breadcrumb = generateBreadcrumbs(
      categoryAttribute,
      item.relId,
      item,
      handleClick
    );

    return breadcrumb;
  });

  const breadcrumb = generateBreadcrumbs(
    categoryProducts,
    selectedCategory,
    handleClick
  );
  return (
    <Grid
      container
      spacing={2}
      // sx={{ padding: 5, width: "100%" }}
    >
      <Grid item xs={12}>
        <Typography>Thuộc tính sản phẩm</Typography>
      </Grid>
      {/* <div
        style={{
          padding: "10px",
          marginLeft: "15px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      > */}
      {breadcrumbs.map((Breadcrumb, index) => (
        <Grid item xs={12} key={index}>
          <Breadcrumbs
            key={index}
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            // sx={{ width: "100%", paddingTop: 1 }}
          >
            {Breadcrumb.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </Breadcrumbs>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Tooltip title="Thêm thuộc tính" placement="left">
          <Button color="primary" aria-label="add" onClick={handleOpenAdd}>
            <AddIcon /> Thêm thuộc tính
          </Button>
        </Tooltip>
      </Grid>
      <FormAddDialog open={openAddDialog} />
      <FormDeleteDialog open={openDeleteDialog} />
    </Grid>
  );
}

function TreeViewComp(PropData) {
  const [selectedSingleNode, setSelectedSingleNodes] = useState("");
  const products = PropData.data;

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
      event.preventDefault();
      setSelectedSingleNodes(nodeId);
      PropData.setAttributeRelId(nodeId);
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
