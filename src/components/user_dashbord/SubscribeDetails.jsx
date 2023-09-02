import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Container, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useTranslation } from "react-i18next";
import { myAxios } from "../../api/myAxios";
import Loader from "../Loading/Loader";
const SubscribeDetails = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      const res = await myAxios.get("/api/user/get_user_data");

      if (res) {
        setUserData(res.data.user);
      }
      setIsLoading(false);
    };
    getData();
  }, []);

  return (
    <Container>
      {isLoading && <Loader />}
      <Typography
        sx={{
          fontSize: "25px",
          fontWeight: "700",
        }}
      >
        {t("user_dashboard.sub_page.title")}
      </Typography>
      <Paper
        sx={{
          width: { xs: "100%", lg: "90%" },
          margin: "auto",
          padding: "1rem",
          marginY: "3rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "1rem 0rem",
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography
            sx={{
              color: "var(--green-color)",
              marginLeft: "10px",
              fontSize: "18px",
            }}
          >
            {t("user_dashboard.sub_page.label2")}:
          </Typography>
          <Typography>
            {" "}
            {lang === "ar"
              ? userData?.membership.ar_name
              : userData?.membership.en_name}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "1rem 0rem",
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography
            sx={{
              color: "var(--green-color)",
              marginLeft: "10px",
              fontSize: "18px",
            }}
          >
            {t("user_dashboard.sub_page.label3")}:
          </Typography>
          <Typography>
            {" "}
            {userData?.ads_count} من أصل {userData?.membership.count_ads}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "1rem 0rem",
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography
            sx={{
              color: "var(--green-color)",
              marginLeft: "10px",
              fontSize: "18px",
            }}
          >
            {lang === "ar" ? "عدد الاعلانات المميزة" : "num of special deals"}:
          </Typography>
          <Typography>
            {" "}
            {userData?.special_count} من أصل{" "}
            {userData?.membership.count_special}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "1rem 0rem",
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography
            sx={{
              color: "var(--green-color)",
              marginLeft: "10px",
              fontSize: "18px",
            }}
          >
            {lang === "ar" ? "عدد المستخدمين" : "num of users"}:
          </Typography>
          <Typography>
            {" "}
            {userData?.admins_count} من أصل {userData?.membership.count_members}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "1rem 0rem",
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography
            sx={{
              color: "var(--green-color)",
              marginLeft: "10px",
              fontSize: "18px",
            }}
          >
            {t("user_dashboard.sub_page.label5")}:
          </Typography>
          <Typography sx={{ display: "flex" }}>
            <Typography>{userData?.subscription_date}</Typography>
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "1rem 0rem",
          }}
        >
          <Typography
            sx={{
              color: "var(--green-color)",
              marginLeft: "10px",
              fontSize: "18px",
            }}
          >
            {t("user_dashboard.sub_page.label6")}:
          </Typography>
          <Typography sx={{ display: "flex" }}>
            <Typography>{userData?.membership_validity}</Typography>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SubscribeDetails;
