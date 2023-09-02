import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Container, Button } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckIcon from "@mui/icons-material/Check";
import useDataFetcher from "../api/useDataFetcher ";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const Cards = () => {
  const { data, isLoading, get } = useDataFetcher();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const nav = useNavigate();

  useEffect(() => {
    get("/api/memberships/all");
  }, []);

  const handleMembershipClick = (data) => {
    nav("/membershipPayment", {
      state: {
        data: data,
      },
    });
  };

  return (
    <Container sx={{ marginTop: "17rem" }}>
      <Typography
        sx={{
          color: "var(--green-color)",
          fontSize: "25px",
          fontWeight: "700",
          marginBottom: "2rem",
        }}
      >
        {lang === "ar" ? "العضويات" : "memberships"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          justifyContent: {
            xs: "center",
            md: lang === "ar" ? "right" : "left",
          },
        }}
      >
        {isLoading ? (
          <Typography>Loading cards...</Typography>
        ) : (
          data?.memberships.map((membership) => (
            <Box
              key={membership?.id}
              sx={{
                width: "300px",
                minHeight: "300px",
              }}
            >
              <Paper
                sx={{
                  padding: "1.5rem",
                  height: "100%",
                  position: "relative",
                  boxShadow: "0px 0px 12px rgba(80, 80, 80, .15)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <AccountBalanceIcon sx={{ color: "var(--green-color)" }} />
                  <Typography
                    sx={{
                      marginRight: "10px",
                      fontSize: "20px",
                      fontWeight: "600",
                    }}
                  >
                    {lang === "ar" ? membership?.ar_name : membership?.en_name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "25px",
                    marginBottom: "1rem",
                  }}
                >
                  <Typography
                    sx={{
                      color: "orange",
                      marginLeft: "10px",
                      fontSize: "25px",
                    }}
                  >
                    {membership?.price}
                  </Typography>
                  <Typography sx={{ color: "gray", fontSize: "18px" }}>
                    {lang === "ar" ? "ريال / سنة" : "SR / year"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <CheckIcon
                    sx={{ color: "var(--green-color)", marginLeft: "5px" }}
                  />
                  <Typography sx={{ marginLeft: "10px" }}>
                    {lang === "ar" ? "عدد الإعلانات:" : "num of deals:"}
                  </Typography>
                  <Typography>{membership?.count_ads} </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <CheckIcon
                    sx={{ color: "var(--green-color)", marginLeft: "5px" }}
                  />
                  <Typography sx={{ marginLeft: "10px" }}>
                    {lang === "ar"
                      ? "عدد الإعلانات المميزة:"
                      : "num of special deals:"}
                  </Typography>
                  <Typography>{membership?.count_special} </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",

                    marginBottom: "1rem",
                  }}
                >
                  <CheckIcon
                    sx={{ color: "var(--green-color)", marginLeft: "5px" }}
                  />
                  <Typography sx={{ marginLeft: "10px" }}>
                    {lang === "ar" ? "عدد المشتركين:" : "num of subscribers:"}
                  </Typography>
                  <Typography> {membership?.count_members}</Typography>
                </Box>

                <Button
                  sx={{
                    position: "absolute",
                    bottom: "1.5rem",
                    left: lang === "ar" && "1.5rem",
                    right: lang === "en" && "1.5rem",
                    backgroundColor: "var(--green-color)",
                    color: "white",
                    borderRadius: "20px",
                    display: "block",
                    marginRight: "auto",
                    minWidth: "7rem",
                    "&:hover": {
                      backgroundColor: "var(--green-color)",
                      color: "white",
                    },
                  }}
                  onClick={() => handleMembershipClick(membership)}
                >
                  {lang === "ar" ? "اشترك الأن" : "subscirbe now"}
                </Button>
              </Paper>
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
};

export default Cards;
