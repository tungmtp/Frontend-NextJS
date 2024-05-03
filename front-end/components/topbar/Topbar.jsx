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
import NewskyLogoLight from "../../img/newskyLogoLight.jpg";

const category = {
  NEWSKY: "home",
  "Sản xuất": "produce/segment",
  "Kinh doanh": "business/partner",
  Kho: "storage",
  "Vật tư": "products/category",
  "Mua hàng": "purchase",
  "Kế toán": "accountancy",
  "Nhân sự": "humanResources",
};
const settings = ["Thông tin", "Đổi mật khẩu", "Đăng xuất"];
const drawerWidth = 300;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

// const closedMixin = (theme) => ({
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   overflowX: "hidden",
//   width: `calc(${theme.spacing(7)} + 1px)`,
//   [theme.breakpoints.up("sm")]: {
//     width: `calc(${theme.spacing(8)} + 1px)`,
//   },
// });

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-end",
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
// }));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// const Drawer = styled(MuiDrawer, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   width: drawerWidth,
//   flexShrink: 0,
//   whiteSpace: "nowrap",
//   boxSizing: "border-box",
//   ...(open && {
//     ...openedMixin(theme),
//     "& .MuiDrawer-paper": openedMixin(theme),
//   }),
//   ...(!open && {
//     ...closedMixin(theme),
//     "& .MuiDrawer-paper": closedMixin(theme),
//   }),
// }));

export default function Topbar(ParentProp) {
  // const [categoriesChild, setCategoriesChild] = useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  // const theme = useTheme();
  // const [open, setOpen] = React.useState(true);
  // const dispatch = useDispatch();
  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

  // const handleCateClick = (key) => {
  //   const value = category[key];
  //   window.location.href = "/" + value;
  // };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Adjust "/your-service-url" to the specific endpoint you need to hit
  //       const serviceURL = "/product-service/category";
  //       const result = await getData(serviceURL);
  //       setCategoriesChild(result); // Update your state with the fetched data
  //     } catch (err) {
  //       console.error("Error fetching data:", err);
  //     }
  //   };

  //   fetchData(); // Call the async function
  // }, []); // Empty dependency array ensures this effect runs only once
  //Xây dựng sidebar category
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

  // const categoriesAfterFilter = getChildCategories(
  //   getKeyByValue(category, pathSplit),
  //   categoriesChild
  // );

  function titleCategory(mnu, pathSplit) {
    return mnu[pathSplit];
  }
  // const titleCategoryList = titleCategory(mnu, pathSplit);

  return (
    <Box>
      <CssBaseline />
      <AppBar position="fixed" open={ParentProp.open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={ParentProp.handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(ParentProp.open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Link
            href={"/" + category["NEWSKY"]}
            sx={{
              fontSize: 24,
              color: "white",
              display: "block",
              fontWeight: 700,
            }}
          >
            <img
              // style="display: block;-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;"
              style={{ width: "12rem" }}
              src={NewskyLogoLight.src}
            ></img>
          </Link>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              // display: {
              //   xs: "none",
              //   md: "flex",
              // },
              mx: 4,
            }}
          >
            {Object.keys(category)
              .slice(1)
              .map((key) => (
                <Link
                  href={"/" + category[key]}
                  key={key}
                  style={{
                    my: "8px",
                    color: "white",
                    display: "block",
                    fontWeight: 700,
                    letterSpacing: -0.5,
                    marginRight: "30px",
                  }}
                >
                  {key}
                </Link>
              ))}
          </Box>
          <Badge badgeContent={4} color="success" style={{ marginRight: 20 }}>
            <NotificationsIcon style={{ color: "white" }} />
          </Badge>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
