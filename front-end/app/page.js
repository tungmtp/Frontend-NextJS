"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import TopBar from "@/components/topbar/Topbar";
import SideBar from "@/components/sidebar/Sidebar";

export default function LandingPage() {
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <>
      <TopBar
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
      />
      <SideBar
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
      />
    </>
  );
}
