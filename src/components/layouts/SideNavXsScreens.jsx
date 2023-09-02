import React, { forwardRef, useContext, useEffect, useState } from "react";
import { Box, Button, List, ListItem, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Chalets, Special, Camps, Chair, Farms } from "../../assets";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LanguageIcon from "@mui/icons-material/Language";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageButton from "../selectnav/LanguageButton";
import GeneralContext from "../../context/generalContext";

const SideNavXsScreens = forwardRef(({ navItems }, ref) => {
  const { generalData, website_status } = useContext(GeneralContext);
  const [headerData, setHeaderData] = useState([]);

  useEffect(() => {
    if (generalData) {
      setHeaderData(generalData);
    }
  }, [generalData]);

  const socialMediaLinksSmall = [
    {
      icon: <FacebookIcon sx={{ fontSize: "2.3rem", marginX: "7px" }} />,
      url: headerData.social_link6,
    },
    {
      icon: <TwitterIcon sx={{ fontSize: "2.3rem", marginX: "7px" }} />,
      url: headerData.social_link2,
    },

    {
      icon: <InstagramIcon sx={{ fontSize: "2.3rem", marginX: "7px" }} />,
      url: headerData.social_link6,
    },
    {
      icon: <YouTubeIcon sx={{ fontSize: "2.3rem", marginX: "7px" }} />,
      url: "",
    },
  ];

  return (
    <Box
      ref={ref}
      sx={{
        position: "absolute",
        top: "80px",
        right: "0px",
        left: "0px",
        height: "100%",
        width: "100%",
        display: "flex",
        zIndex: "999",
        transition: "top 0.45s ease-in-out 0s",
        opacity: "1",
      }}
    >
      <Box
        sx={{
          height: "1px",
          width: "100%",
          position: "absolute",
          //   top: "80px",
          zIndex: "2",
          display: "block",
          backgroundColor: "rgb(242, 242, 242)",
        }}
      ></Box>
      <Box
        sx={{
          height: "425px",
          width: "100%",
          backgroundColor: "rgb(255, 255, 255)",
          position: "absolute",
          zIndex: "1",
          maxHeight: "90vh",
          top: "0px",
        }}
      >
        <Box sx={{ paddingX: "12px" }}>
          <List sx={{ paddingY: "32px" }}>
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.url}
                underline="none"
                style={{ color: "black", textDecoration: "none" }}
              >
                <ListItem
                  key={index}
                  sx={{
                    paddinY: "6px",
                    paddingX: "16px",
                    whiteSpace: "nowrap",
                    minHeight: "48px",
                  }}
                >
                  <Typography>{item.label}</Typography>
                </ListItem>
              </Link>
            ))}
          </List>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 25px",
              borderTop: "1px solid #eaedf2",
            }}
          >
            <ChevronRightIcon sx={{ fontSize: "2.5rem" }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
                alignItems: "center",
              }}
            >
              <LanguageIcon sx={{ color: "gray" }} />
              {/* added language button comonent and give it a prop to let the component show on small screens  */}
              <LanguageButton isMenuButton={true} />
            </Box>
          </Box>
          {/* <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "50px",
              borderTop: "1px solid #eaedf2",
            }}
          >
            {socialMediaLinksSmall.map((social, index) => (
              <Link key={index} to={social.url} style={{ color: "black" }}>
                <Box>{social.icon}</Box>
              </Link>
            ))}
          </Box> */}
        </Box>
      </Box>
    </Box>
  );
});

export default SideNavXsScreens;
