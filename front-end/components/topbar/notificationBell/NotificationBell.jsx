import { Badge, Box, Menu, MenuItem, Typography } from "@mui/material";
import React from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";

const options = [
  "Sản phẩm A đang dưới mức tồn kho tối thiểu",
  "Show all notification content",
  "Hide sensitive notification content",
  "Hide all notification content",
];
export default function NotificationBell() {
  const [anchorElNotification, setAnchorElNotification] = React.useState(null);
  const handleOpenNotification = (event) => {
    setAnchorElNotification(event.currentTarget);
  };
  const handleCloseNotification = () => {
    setAnchorElNotification(null);
  };
  return (
    <Box>
      {" "}
      <Badge
        badgeContent={options.length}
        color="success"
        style={{ marginRight: 20 }}
      >
        <NotificationsIcon
          onClick={handleOpenNotification}
          style={{ color: "white" }}
        />
      </Badge>
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
        {options.map((setting) => (
          <MenuItem key={setting} onClick={handleCloseNotification}>
            <Typography textAlign="center">{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
