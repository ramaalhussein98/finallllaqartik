import React, { useContext } from "react";
// import { Box } from "@mui/material";
// import { Visa } from "../../assets";
// import { Logo } from "../../assets";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import GeneralContext from "../../context/generalContext";

const LoaderHome = () => {
  const { generalData } = useContext(GeneralContext);

  const preload = generalData?.style_preload;

  return preload ? (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        position: "fixed",
        inset: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        zIndex: "10000000",
      }}
    >
      <CircularProgress color="success" size="5rem" />
    </Box>
  ) : (
    ""
  );
};

export default LoaderHome;
