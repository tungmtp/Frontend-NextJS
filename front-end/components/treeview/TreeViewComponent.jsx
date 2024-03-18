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

export default function TreeViewComponent(serviceURL) {
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [categoryData, setDataCategoryData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Adjust "/your-service-url" to the specific endpoint you need to hit
        const result = await getData(serviceURL.data);
        setDataCategoryData(result); // Update your state with the fetched data
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData(); // Call the async function
  }, []); // Empty dependency array ensures this effect runs only once

  const buildCategoryTree = (categoryData, parentId = null) => {
    const filteredCategories = categoryData?.filter(
      (category) => category.isChildOf === parentId
    );
    return filteredCategories?.map((category) => {
      const hasChildren = categoryData.some((c) => c.isChildOf === category.id);
      if (hasChildren) {
        return {
          id: category.id,
          name: category.catName,
          // icon: <NotificationsOutlined />,
          children: buildCategoryTree(categoryData, category.id),
        };
      } else {
        return {
          id: category.id,
          name: category.catName,
        };
      }
    });
  };

  const CategoryTree = buildCategoryTree(categoryData);

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
        selected={isLeafNode && selectedNodes.includes(nodes.id.toString())}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    );
  };

  const handleNodeSelect = (event, nodeId) => {
    const isSelected = selectedNodes.includes(nodeId);

    if (isSelected) {
      setSelectedNodes(selectedNodes.filter((id) => id !== nodeId));
    } else {
      setSelectedNodes([...selectedNodes, nodeId]);
    }

    console.log("Selected Node IDs:", selectedNodes);
  };

  return (
    <div>
      <Box sx={{ minHeight: 110, flexGrow: 1, maxWidth: 300 }}>
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={["root"]}
          defaultExpandIcon={<ChevronRightIcon />}
          multiSelect
          selected={selectedNodes}
        >
          {CategoryTree?.map((object) => renderTree(object))}
        </TreeView>
      </Box>
    </div>
  );
}
