"use client";
import { Inter } from "next/font/google";
// import "./globals.css";
import React, { createContext, useContext, useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Avatar, Badge, Button, Tooltip } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";

// import { useRouter } from "next/navigation";
const SelectedPageContext = createContext();
const inter = Inter({ subsets: ["latin"] });
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { getData } from "@/hook/Hook";
import { mnu } from "@/components/menu";
import Link from "next/link";
import { useDispatch } from "react-redux";
import {
  setSelectedCategory,
  setSelectedProduct,
} from "@/redux/categoryProductRedux";

const category = {
  NEWSKY: "home",
  "Sản xuất": "produce",
  "Kinh doanh": "business",
  Kho: "storage",
  "Vật tư": "products",
  "Mua hàng": "purchase",
  "Kế toán": "accountancy",
  "Nhân sự": "humanResources",
};

const drawerWidth = 300;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function SideBar(ParentProp) {
  const [categoriesChild, setCategoriesChild] = useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const dispatch = useDispatch();
  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };
  const pathname = usePathname();

  let pathname1 = pathname.split("/");
  let pathSplit = pathname1[1];
  function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }
  function getChildCategories(categoryName, data) {
    const category = data?.find((item) => item.catName === categoryName);

    if (!category) {
      return []; // Category not found
    }

    const children = data.filter((item) => item.isChildOf === category.id);
    let result = [...children];

    // children.forEach((child) => {
    //   const subChildren = getChildCategories(child.catName, data);
    //   result = [...result, ...subChildren];
    // });

    return result;
  }

  const categoriesAfterFilter = getChildCategories(
    getKeyByValue(category, pathSplit),
    categoriesChild
  );

  function titleCategory(mnu, pathSplit) {
    return mnu[pathSplit];
  }
  const titleCategoryList = titleCategory(mnu, pathSplit);

  return (
    <Box>
      <CssBaseline />
      <Drawer variant="permanent" open={ParentProp.open}>
        <DrawerHeader>
          <IconButton onClick={ParentProp.handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {titleCategoryList?.map((cate, index) => (
            <ListItem
              selected={cate.link === pathname}
              key={cate.link}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => {
                dispatch(setSelectedProduct(null));
                dispatch(setSelectedCategory(null));
              }}
            >
              <Link href={cate.link} style={{ textDecoration: "none" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    color: "black",
                  }}
                >
                  <Tooltip title={cate.title} placement="right-start">
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: "none",
                      }}
                    >
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText
                    primary={cate.title}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
    </Box>
  );
}
