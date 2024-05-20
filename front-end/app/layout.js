"use client";
import React, { useEffect, useRef } from "react";
import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";
import TopBar from "@/components/topbar/Topbar";
import SideBar from "@/components/sidebar/Sidebar";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";

// import { useRouter } from "next/navigation";

// export const metadata = {
//   title: "SÀN GỖ NEWSKY",
//   description: "Generated by create next app",
// };

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            // You can adjust this value as needed
            paddingTop: "8px", // Adjust the top padding
            paddingBottom: "8px", // Adjust the bottom padding
          },
          "& .MuiInputBase-multiline": {
            // Adjust padding for multiline TextField
            paddingTop: "4px",
            paddingBottom: "4px",
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiAutocomplete-inputRoot": {
            // You can adjust this value as needed
            paddingTop: "0px", // Adjust the top padding
            paddingBottom: "4px", // Adjust the bottom padding
          },
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
        size: "small", // Set default size to small
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          paddingTop: "2px", // Adjust top padding
          paddingBottom: "2px", // Adjust bottom padding
        },
      },
    },
    // Add other components here with similar overrides if needed
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
export default function RootLayout({ children }) {
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const pathname = usePathname();

  let pathname1 = pathname.split("/");
  let pathSplit = pathname1[1];

  //event source
  const handleMessage = (event) => {
    const data = JSON.parse(event.data);
    // console.log("Received data:", data);
    const customEvent = new CustomEvent("newDataEvent", {
      detail: data,
    });
    window.dispatchEvent(customEvent);
  };

  const eventSource = useEventSource(handleMessage);
  return (
    <html lang="en">
      <head>
        <title>SÀN GỖ NEWSKY</title>
        <meta name="description" content="Generated by create next app" />
      </head>
      <body>
        {/* {!isLoginPage && <Sidebar />} */}
        <input type="hidden" name="globalData" value={Date.now()} />
        <ReduxProvider>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <ThemeProvider theme={theme}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="en-gb"
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {" "}
                  {pathSplit != "login" && (
                    <TopBar
                      open={open}
                      handleDrawerOpen={handleDrawerOpen}
                      handleDrawerClose={handleDrawerClose}
                    />
                  )}
                  <div style={{ display: "flex" }}>
                    {/* {pathSplit != "login" && (
                      <SideBar
                        open={open}
                        handleDrawerOpen={handleDrawerOpen}
                        handleDrawerClose={handleDrawerClose}
                      />
                    )} */}
                    <Box component="main" sx={{ flexGrow: 1, pt: 3, px: 3 }}>
                      <DrawerHeader />
                      {children}
                    </Box>
                  </div>
                </div>
              </LocalizationProvider>
            </ThemeProvider>
          </SnackbarProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
const useEventSource = (onMessage) => {
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const eventSource = new EventSource(
      "http://123.31.12.44:8080/rabbitMQ/events"
    );
    eventSourceRef.current = eventSource;

    eventSource.addEventListener("message", onMessage);

    // Xử lý sự kiện kết nối bị đóng
    eventSource.addEventListener("error", () => {
      console.error("EventSource failed.");
    });

    return () => {
      eventSource.close();
    };
  }, [onMessage]);

  return eventSourceRef;
};
