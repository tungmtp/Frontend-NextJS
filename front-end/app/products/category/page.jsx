"use client";
import { getData } from "@/hook/Hook";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { Label, NotificationsOutlined } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TreeViewComp from "@/components/treeview/TreeViewComp";
import ChildTreeView from "@/components/treeview/childtreeview/childTreeView";

export default function Category() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [inputValues, setInputValues] = useState({
    input1: "",
    input2: "",
    input3: "",
  });
  const categories = [
    { id: 1, catName: "Nguyên liệu chính A", chillOf: null },
    { id: 2, catName: "Nguyên liệu chính A.1", chillOf: 1 },
    { id: 3, catName: "Nguyên liệu chính A.2", chillOf: 1 },
    { id: 4, catName: "Nguyên liệu chính B", chillOf: null },
    { id: 5, catName: "Nguyên liệu chính C", chillOf: null },
    { id: 6, catName: "Nguyên liệu chính A.1.1", chillOf: 2 },
    { id: 7, catName: "Nguyên liệu chính A.1.2", chillOf: 2 },
    { id: 8, catName: "Nguyên liệu chính B.1", chillOf: 4 },
    { id: 9, catName: "Nguyên liệu chính B.2", chillOf: 4 },
    { id: 10, catName: "Nguyên liệu chính C.1", chillOf: 5 },
    { id: 11, catName: "Nguyên liệu chính C.2", chillOf: 5 },
    // Add more objects as needed
  ];
  const data = [
    {
      id: "0",
      name: "Dad",
      children: [
        {
          id: "1",
          name: "Child - 1",
        },
        {
          id: "3",
          name: "Child - 3",
          children: [
            {
              id: "4",
              name: "Child - 4",
            },
          ],
        },
      ],
    },
    {
      id: "6",
      name: "Mom",
      children: [
        {
          id: "dfgd",
          name: "Child - 1",
        },
        {
          id: "7",
          name: "Child - 3",
          children: [
            {
              id: "8",
              name: "Child - 4",
            },
          ],
        },
      ],
    },
  ];
  const buildCategoryTree = (categories, parentId = null) => {
    const filteredCategories = categories?.filter(
      (category) => category.chillOf === parentId
    );

    return filteredCategories?.map((category) => {
      const hasChildren = categories.some((c) => c.chillOf === category.id);
      if (hasChildren) {
        return {
          id: category.id,
          name: category.catName,
          // icon: <NotificationsOutlined />,
          children: buildCategoryTree(categories, category.id),
        };
      } else {
        return {
          id: category.id,
          name: category.catName,
        };
      }
    });
  };
  const CategoryTree = buildCategoryTree(categories);

  const renderTree = (nodes) => {
    const isLeafNode =
      !Array.isArray(nodes.children) || nodes.children.length === 0;

    return (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id.toString()}
        label={nodes.name}
        onClick={(event) =>
          isLeafNode && handleNodeSelect(event, nodes.id.toString())
        }
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    );
  };

  const handleNodeSelect = (event, nodeId) => {
    setSelectedNode(nodeId);
    // You can perform additional actions with the selected nodeId here
    console.log("Selected Node ID:", nodeId);
  };

  const handleInputChange = (event) => {
    setInputValues({
      ...inputValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform your submit logic here with inputValues
    console.log("Submitted values:", inputValues);
  };

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <TreeViewComp data={"/product-service/category"} />
        </Grid>
        <Grid item xs={9}></Grid>
      </Grid>
    </div>
  );
}
