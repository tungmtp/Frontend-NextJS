import { deleteData, getData, postData, putData } from "@/hook/Hook";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { Button, Checkbox, Dialog, IconButton, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxTwoToneIcon from "@mui/icons-material/AddBoxTwoTone";
import AccountTreeTwoToneIcon from "@mui/icons-material/AccountTreeTwoTone";
import BuildTwoToneIcon from "@mui/icons-material/BuildTwoTone";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import "./treeViewComp.css";
import BorderColorTwoToneIcon from "@mui/icons-material/BorderColorTwoTone";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";

export default function TreeViewComp(serviceURL) {
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openFixDialog, setOpenFixDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedSingleNode, setSelectedSingleNodes] = useState("");
  const [addCategory, setAddCategory] = useState({
    catName: "",
    isChildOf: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData(serviceURL.data);
        setCategoryData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const buildCategoryTree = (categoryData, parentId = null) => {
    const filteredCategories = categoryData?.filter(
      (category) => category.isChildOf === parentId
    );
    return filteredCategories?.map((category) => {
      const hasChildren = categoryData.some((c) => c.isChildOf === category.id);
      return {
        id: category.id.toString(), // Convert ID to string
        name: category.catName,
        children: hasChildren
          ? buildCategoryTree(categoryData, category.id)
          : [],
      };
    });
  };

  const handleCheckboxChange = (event, nodeId) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedNodes([...selectedNodes, nodeId]);
      setSelectedSingleNodes(nodeId);
    } else {
      setSelectedNodes(selectedNodes.filter((id) => id !== nodeId));
      setSelectedSingleNodes(null);
    }
  };

  const handleNodeSelect = (event, nodeId) => {
    const isSelected = selectedNodes.includes(nodeId);

    if (isSelected) {
      setSelectedNodes(selectedNodes.filter((id) => id !== nodeId));
      setSelectedSingleNodes(null);
    } else {
      setSelectedNodes([...selectedNodes, nodeId]);
      setSelectedSingleNodes(nodeId);
    }
  };
  console.log("Selected Node ID:", selectedSingleNode);
  // console.log("data sẽ gửi:", addCategory);

  const CategoryTree = buildCategoryTree(categoryData);

  const renderTree = (nodes) => {
    const isLeafNode = nodes.children.length === 0;

    return (
      <TreeItem
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
        onClick={(event) => {
          handleNodeSelect(event, nodes.id);
        }}
        selected={selectedNodes.includes(nodes.id)}
      >
        {nodes.children.map((node) => renderTree(node))}
      </TreeItem>
    );
  };

  const handleOpenAdd = () => {
    setOpenAddDialog(true);
    setAddCategory({ isChildOf: selectedSingleNode });
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
    const seltecedCatName = categoryData?.find(
      (item) => item.id === selectedSingleNode
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
              const addCategory = {
                catName: catName,
                isChildOf: selectedSingleNode,
              };
              const addCategory2 = {
                catName: catName,
                isChildOf: selectedSingleNode,
                id: Math.random() * 100000,
              };
              setCategoryData((prevState) => [...prevState, addCategory2]);
              console.log(addCategory);
              postData("/product-service/category", addCategory);
              alert("Thêm thành công !!!");
              handleClose();
              //window.location.reload(false);
            },
          }}
        >
          <DialogTitle>
            Thêm thư mục vào: {seltecedCatName?.catName}{" "}
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
    if (selectedSingleNode === null) {
      event.preventDefault();
      alert("Bạn chưa chọn vị trí thư mục");
    } else {
      setOpenFixDialog(true);
      // setAddCategory({ isChildOf: selectedSingleNode });
    }
  };
  const handleCloseFix = () => {
    setOpenFixDialog(false);
  };

  function FormFixdDialog(open) {
    const seltecedCatName = categoryData?.find(
      (item) => item.id === selectedSingleNode
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
              const catNewName = formJson.catName;
              const fixCategory = {
                catName: catNewName,
                isChildOf: seltecedCatName.isChildOf,
              };
              const respone = putData(
                "/product-service/category",
                selectedSingleNode,
                fixCategory
              );
              const updatedCategoryData = categoryData.map((item) => {
                if (item.id === selectedSingleNode) {
                  return { ...item, catName: catNewName };
                }
                return item;
              });
              setCategoryData(updatedCategoryData);
              handleCloseFix();
            },
          }}
        >
          <DialogTitle>
            Đổi tên thư mục: {seltecedCatName?.catName}{" "}
          </DialogTitle>

          <DialogContent>
            <TextField
              required
              margin="dense"
              id="name"
              name="catName"
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
    if (selectedSingleNode === null) {
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
    const seltecedCatName = categoryData?.find(
      (item) => item.id === selectedSingleNode
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
              const respone = deleteData(
                "/product-service/category",
                selectedSingleNode
              );
              console.log(respone);
              const updatedCategoryData = categoryData.filter(
                (item) => item.id !== selectedSingleNode
              );
              setCategoryData(updatedCategoryData);
              handleCloseDelete();
              alert("Xóa thành công");
            },
          }}
        >
          <DialogTitle>Xóa thư mục: {seltecedCatName?.catName} </DialogTitle>
          <DialogContent>Bạn chắc chắn muốn xóa thư mục này?</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }

  const handleAddNode = () => {
    // Example implementation to add a new node
    const newNode = {
      id: "newNodeId", // Provide a unique ID for the new node
      name: "New Node",
      children: [], // Assuming the new node has no children initially
    };

    setCategoryData([...categoryData, newNode]);
  };
  return (
    <div>
      <Box sx={{ minHeight: 110, flexGrow: 1, maxWidth: 300 }}>
        <Stack direction="row" spacing={1}>
          <IconButton aria-label="add" onClick={handleOpenAdd}>
            <AddBoxTwoToneIcon />
          </IconButton>
          <FormAddDialog open={openAddDialog} />
          <IconButton aria-label="fix" onClick={handleOpenFix}>
            <BorderColorTwoToneIcon />
          </IconButton>
          <FormFixdDialog open={openFixDialog} />
          <IconButton aria-label="delete" onClick={handleOpenDelete}>
            <DeleteForeverTwoToneIcon />
          </IconButton>
          <FormDeleteDialog open={openDeleteDialog} />
        </Stack>
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={["root"]}
          defaultExpandIcon={<ChevronRightIcon />}
          selected={selectedSingleNode}
        >
          {CategoryTree?.map((object) => renderTree(object))}
        </TreeView>
      </Box>
    </div>
  );
}
