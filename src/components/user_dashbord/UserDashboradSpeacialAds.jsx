import React, { useEffect, useState } from "react";
import SpecialAds from "../Filter/SpecialAds";
import { Box, CircularProgress, Typography } from "@mui/material";
import useDataFetcher from "../../api/useDataFetcher ";
import { useTranslation } from "react-i18next";
import HourglassDisabledIcon from "@mui/icons-material/HourglassDisabled";
const UserDashboradSpeacialAds = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { data, isLoading, get } = useDataFetcher();
  useEffect(() => {
    get("/api/user/get_user_fav_deal");
  }, []);
  const [myAds, setMyAds] = useState([]);

  useEffect(() => {
    if (data) setMyAds(data?.ads?.data);
  }, [data]);

  return !isLoading ? (
    <Box sx={{ padding: { xs: "16px 5px", sm: "16px 56px" } }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "600",
          marginBottom: "24px",
          marginTop: "8px",
          fontSize: { xs: "1.2rem", md: "1.5rem" },
        }}
      >
        {lang === "ar" ? "اعلاناتي المفضلة" : "my favourite ads"}
      </Typography>
      {myAds?.length > 0 ? (
        <Box sx={{ maxWidth: "90%", margin: "auto" }}>
          {myAds?.map((ad) => (
            <SpecialAds ad={ad} />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            width: { xs: "100%", md: "100%" },
            height: "400px",
            boxShadow: "1",
            backgroundColor: "white",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <HourglassDisabledIcon
            sx={{ fontSize: "2rem", marginBottom: "2rem" }}
          />
          <Typography sx={{ fontSize: "25px", color: "var(--green-color)" }}>
            {lang === "ar" ? "لا يوجد بيانات" : "there is no Ads"}
          </Typography>
        </Box>
      )}
    </Box>
  ) : (
    <Box
      sx={{
        minHeight: "80vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="success" />
    </Box>
  );
};

export default UserDashboradSpeacialAds;
