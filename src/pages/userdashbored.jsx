import React, { useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { TopNav, SideBar } from "../components/user_dashbord";
import { Outlet } from "react-router";
const UserDashbored = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "#f5f5f5";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <Box>
      <TopNav />
      <Grid container>
        <Grid item xs={12} lg={3}>
          <SideBar />
        </Grid>

        <Grid item xs={12} lg={9}>
          <Box sx={{ marginTop: "7rem" }}>
            <Outlet />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashbored;
