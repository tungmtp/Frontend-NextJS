import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import TreeViewComp from "../treeview/TreeViewComp";
import { getDataById } from "@/hook/Hook";
export default function SelectAttributeTreeView(props) {
  const [openTreview, setOpenTreeview] = useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState({
    attName: "",
    id: "",
  });
  const handleOpenAdd = (event) => {
    event.preventDefault();
    setOpenTreeview(true);
  };
  const handleClose = (event) => {
    event.preventDefault();
    setOpenTreeview(false);
  };
  const FormAddCategory = (open) => {
    const [treeviewNodeId, setTreeviewNodeId] = React.useState();
    // let attributeRelId1 = attributeRelId;

    // let relTable = "productAttribute";
    // let addAttribute = null;
    // if (parentProp.status == "add") {
    //   addAttribute = {
    //     id: arrayLenght + 1,
    //     productId: null,
    //     relId: attributeRelId1,
    //     relTable: relTable,
    //   };
    // } else {
    //   addAttribute = {
    //     productId: selectedProduct.id,
    //     relId: attributeRelId1,
    //     relTable: relTable,
    //   };
    // }

    return (
      <React.Fragment>
        <Dialog
          open={open.open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              props.setSelectedAttribute(treeviewNodeId);
              const getCatById = async () => {
                try {
                  const result = await getDataById(
                    "/product-service/ProductAttribute",
                    treeviewNodeId
                  );

                  setSelectedCategory(result);
                  //   const updatedSelectedDataGrid = { ...selectedDataGrid };
                  //   updatedSelectedDataGrid.extraCategoryID = result.id;

                  //   setSelectedDataGrid(updatedSelectedDataGrid);
                  handleClose(event);
                } catch (err) {
                  console.error("Error fetching data:", err);
                }
              };
              getCatById();
            },
          }}
        >
          <DialogTitle>Thêm phân loại</DialogTitle>
          <DialogContent>
            <Box sx={{ width: "300px" }}></Box>
            <TreeViewComp
              status="forSelect"
              serviceURL={"/product-service/ProductAttribute"}
              title={"attName"}
              setSelectedNode={setTreeviewNodeId}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        <TextField
          sx={{ width: "100%" }}
          required
          id="nameStr"
          variant="outlined"
          label="Chọn thư mục"
          InputProps={{
            readOnly: true,
          }}
          value={selectedCategory.attName}
        />
      </Grid>
      <Grid item xs={2}>
        <Tooltip title="Thêm thư mục">
          <Fab
            size="small"
            color="primary"
            aria-label="add"
            onClick={handleOpenAdd}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Grid>
      <FormAddCategory open={openTreview} />
    </Grid>
  );
}
