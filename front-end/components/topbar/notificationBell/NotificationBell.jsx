import {
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { asyncGetData } from "@/hook/Hook";
import Link from "next/link";

const options = [
  "Sản phẩm A đang dưới mức tồn kho tối thiểu",
  "Show all notification content",
  "Hide sensitive notification content",
  "Hide all notification content",
];
export default function NotificationBell() {
  const [anchorElNotification, setAnchorElNotification] = React.useState(null);
  const [inventoryLowCount, setInventoryLowCount] = useState([]);

  const handleOpenNotification = (event) => {
    setAnchorElNotification(event.currentTarget);
  };
  const handleCloseNotification = () => {
    setAnchorElNotification(null);
  };

  const getInventoryMessage = (messName) => {
    asyncGetData(`/common-module/eventList/${messName}`)
      .then((response) => response.json())
      .then((data) => setInventoryLowCount(data))
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    getInventoryMessage("INVENTORY LOW COUNT");
  }, []);

  return (
    <Box>
      {" "}
      <IconButton onClick={handleOpenNotification}>
        <Badge
          badgeContent={inventoryLowCount.length}
          color="success"
          style={{ marginRight: 20 }}
        >
          <NotificationsIcon style={{ color: "white" }} />
        </Badge>
      </IconButton>
      <Menu
        sx={{ mt: "30px" }}
        id="menu-appbar"
        anchorEl={anchorElNotification}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElNotification)}
        onClose={handleCloseNotification}
      >
        {inventoryLowCount.map((item) => (
          <MenuItem key={item.id} onClick={handleCloseNotification}>
            {item.eventName == "INVENTORY LOW COUNT" ? (
              <Link href={"/products/controlMinimumInventory"}>
                {item.message}
              </Link>
            ) : (
              <Typography textAlign="center">{item.message}</Typography>
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
