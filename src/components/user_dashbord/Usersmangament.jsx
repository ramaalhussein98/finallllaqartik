import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Container,
  Button,
  TextField,
  InputLabel,
  Modal,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from "../Loading/Loader";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";

const columns = [
  { label: "اسم المستخدم", width: "20%" },
  { label: "رقم الهاتف", width: "40%" },
  { label: "الخيارات", width: "10%" },
];
const Usersmangament = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const handleInput = (event) => {
    event.target.value = event.target.value.replace(/\D/g, "");
  };

  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [admins, setAdmins] = useState();
  const [pendingAdmins, setPendingAdmins] = useState();
  const [isClickedSearch, setIsClickedSearch] = useState(false);
  const [handleStateChange, setHandleStateChange] = useState(false);
  const [searchedUser, setSearchedUser] = useState();
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    const getData = async () => {
      setIsloading(true);
      const res = await axios.get(
        `https://www.dashboard.aqartik.com/api/user/get_all_admin`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === 1) {
        // setUserData(res.data.user);
        setIsloading(false);
        setAdmins(res.data.users);
      } else if (res.data.status === 0) {
        setIsloading(false);
        toast.error(res.data.message);
      } else if (
        res.data.status === 0 &&
        res.data.message === "401 Unauthorized"
      ) {
        setIsloading(false);
        toast.error(res.data.message);
        localStorage.removeItem("user_token");
      }
    };
    getData();

    const getData2 = async () => {
      setIsloading(true);
      const res = await axios.get(
        `https://www.dashboard.aqartik.com/api/user/get_all_pending_admin`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === 1) {
        // setUserData(res.data.user);
        setIsloading(false);
        setPendingAdmins(res.data.users);
      } else if (res.data.status === 0) {
        setIsloading(false);
        toast.error(res.data.message);
      } else if (
        res.data.status === 0 &&
        res.data.message === "401 Unauthorized"
      ) {
        setIsloading(false);
        toast.error(res.data.message);
        localStorage.removeItem("user_token");
      }
    };
    getData2();
  }, [isClickedSearch, handleStateChange]);

  const changeUserPhone = (e) => {
    setUserPhoneNumber(e.target.value);
  };

  useEffect(() => {
    validatePhoneNumber();
  }, [userPhoneNumber]);

  const validatePhoneNumber = () => {
    const saudiNumberRegex = /^(9665[0-9]{8})$/;
    const isValid = saudiNumberRegex.test(userPhoneNumber);
    setIsValidPhoneNumber(isValid);
  };

  const checkPhoneNumber = async () => {
    const token = localStorage.getItem("user_token");
    const getData = async () => {
      setIsloading(true);
      const res = await axios.get(
        `https://www.dashboard.aqartik.com/api/user/search?phone=${userPhoneNumber}&lang=${lang}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === 1) {
        // setUserData(res.data.user);
        setIsloading(false);
        setSearchedUser(res.data.user);
      } else if (res.data.status === 0) {
        setIsloading(false);
        toast.error(res.data.message);
      } else if (
        res.data.status === 0 &&
        res.data.message === "401 Unauthorized"
      ) {
        setIsloading(false);
        toast.error(res.data.message);
        localStorage.removeItem("userData");
        localStorage.removeItem("userMembership");
        localStorage.removeItem("userLocation");
        localStorage.removeItem("user_token");
      }
    };
    getData();
    setIsClickedSearch(true);
    setUserPhoneNumber("");
  };

  const handleDeleteOpenModal = (id) => {
    Swal.fire({
      title: lang === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
      text:
        lang === "ar"
          ? "لايمكنك التراجع بعد التأكيد"
          : "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: lang === "ar" ? "الغاء" : "cancel",
      confirmButtonColor: "#14b183",
      cancelButtonColor: "#d33",
      confirmButtonText: lang === "ar" ? "تأكيد الحذف!" : "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // setIsModalDeleteOpen(true);
        const token = localStorage.getItem("user_token");
        const getData = async () => {
          setIsloading(true);
          const res = await axios.get(
            `https://www.dashboard.aqartik.com/api/user/remove_admin?user_id=${id}&lang=${lang}`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );
          if (res.data.status === 1) {
            // setUserData(res.data.user);
            setIsloading(false);
            // setSearchedUser(res.data.user);
            toast.success(res.data.message);
            setHandleStateChange((prev) => !prev);
          } else if (res.data.status === 0) {
            setIsloading(false);
            toast.error(res.data.message);
          } else if (
            res.data.status === 0 &&
            res.data.message === "401 Unauthorized"
          ) {
            setIsloading(false);
            toast.error(res.data.message);
            localStorage.removeItem("userData");
            localStorage.removeItem("userMembership");
            localStorage.removeItem("userLocation");
            localStorage.removeItem("user_token");
          }
        };
        getData();
      }
    });
  };

  const handleDeletePendingUser = (id) => {
    Swal.fire({
      title: lang === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
      text:
        lang === "ar"
          ? "لايمكنك التراجع بعد التأكيد"
          : "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: lang === "ar" ? "الغاء" : "cancel",
      confirmButtonColor: "#14b183",
      cancelButtonColor: "#d33",
      confirmButtonText: lang === "ar" ? "تأكيد الحذف!" : "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // setIsModalDeleteOpen(true);
        const token = localStorage.getItem("user_token");
        const getData = async () => {
          setIsloading(true);
          const res = await axios.get(
            `https://www.dashboard.aqartik.com/api/user/cancel_admin?user_id=${id}&lang=${lang}`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );
          if (res.data.status === 1) {
            // setUserData(res.data.user);
            setIsloading(false);
            // setSearchedUser(res.data.user);
            setHandleStateChange((prev) => !prev);
            toast.success(res.data.message);
          } else if (res.data.status === 0) {
            setIsloading(false);
            toast.error(res.data.message);
          } else if (
            res.data.status === 0 &&
            res.data.message === "401 Unauthorized"
          ) {
            setIsloading(false);
            toast.error(res.data.message);
            localStorage.removeItem("userData");
            localStorage.removeItem("userMembership");
            localStorage.removeItem("userLocation");
            localStorage.removeItem("user_token");
          }
        };
        getData();
      }
    });
  };

  const addUser = async (phone) => {
    const token = localStorage.getItem("user_token");
    const getData = async () => {
      setIsloading(true);
      const res = await axios.get(
        `https://www.dashboard.aqartik.com/api/user/add_user_as_admin?phone=${phone}&lang=${lang}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === 1) {
        // setUserData(res.data.user);
        setIsloading(false);
        // setSearchedUser(res.data.user);
        setIsClickedSearch(false);
        toast.success(res.data.message);
      } else if (res.data.status === 0) {
        setIsloading(false);
        toast.error(res.data.message);
      } else if (
        res.data.status === 0 &&
        res.data.message === "401 Unauthorized"
      ) {
        setIsloading(false);
        toast.error(res.data.message);
        localStorage.removeItem("userData");
        localStorage.removeItem("userMembership");
        localStorage.removeItem("userLocation");
        localStorage.removeItem("user_token");
      }
    };
    getData();
  };

  return (
    <>
      {isLoading && <Loader />}
      <Typography
        sx={{
          fontSize: { xs: "20px", md: "25px" },
          fontWeight: "700",
          marginBottom: "2rem",
        }}
      >
        {t("user_dashboard.users_manage.title")}
      </Typography>
      <Paper
        sx={{
          maxWidth: { xs: "auto", lg: "90%" },
          padding: "2rem",
          margin: "auto",
          boxShadow: "2",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box>
            <InputLabel sx={{ marginBottom: "15px" }}>
              {t("user_dashboard.users_manage.label")}
            </InputLabel>
            <TextField
              id="phoneNumber"
              type="text"
              placeholder="9665 123 123 12"
              value={userPhoneNumber}
              onChange={(e) => changeUserPhone(e)}
              sx={{
                direction: "ltr",
                border: "none",
                width: "250px",
                // paddingLeft: "1.8rem",
                // "& fieldset": { border: "none" },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
                "& ::placeholder": {
                  fontSize: "20px",
                  fontWeight: "700",
                },
              }}
            />
          </Box>
          <Button
            onClick={checkPhoneNumber}
            disabled={!isValidPhoneNumber}
            sx={{
              backgroundColor: "var(--green-color)",
              color: "white",
              borderRadius: "6px",
              marginTop: "37px",
              padding: { xs: "10px 3rem", md: "16px 3rem" },
              marginRight: "20px",
              "&:hover": {
                backgroundColor: "var(--green-color)",
                color: "white",
              },
              "&:disabled": {
                color: "#bdbdbd",
              },
            }}
          >
            {t("user_dashboard.users_manage.button")}
          </Button>
        </Box>
        <Box
          sx={{
            width: "80%",
            height: "0.5px",
            backgroundColor: "#e9e7e7;",
            marginY: "3rem",
            marginX: "auto",
          }}
        ></Box>
        {isClickedSearch ? (
          <>
            <Box>
              <Typography
                sx={{ fontSize: "22px", color: "var(--green-color)" }}
              >
                {t("user_dashboard.users_manage.title2")}
              </Typography>
              <Box
                sx={{ width: { xs: "100%", md: "100%", overflowX: "auto" } }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #eee",
                    paddingY: "1rem",
                  }}
                >
                  {columns.map((column, index) => (
                    <Typography
                      key={index}
                      sx={{
                        width: column.width,
                        textAlign: "center",
                        color: "var(--green-color)",
                      }}
                    >
                      {column.label}
                    </Typography>
                  ))}
                </Box>

                {searchedUser ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingY: "1rem",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <Typography sx={{ width: "20%", textAlign: "center" }}>
                      {searchedUser.username}
                    </Typography>
                    <Typography sx={{ width: "40%", textAlign: "center" }}>
                      {searchedUser.phone}
                    </Typography>
                    <Typography sx={{ width: "10%", textAlign: "center" }}>
                      <AddIcon
                        sx={{ color: "red", cursor: "pointer" }}
                        onClick={() => addUser(searchedUser.phone)}
                      />
                    </Typography>
                  </Box>
                ) : (
                  ""
                )}
              </Box>
            </Box>
            <Box
              sx={{
                width: "80%",
                height: "0.5px",
                backgroundColor: "#e9e7e7;",
                marginY: "3rem",
                marginX: "auto",
              }}
            ></Box>
          </>
        ) : (
          ""
        )}
        {/* for pending */}
        {pendingAdmins?.length > 0 ? (
          <>
            <Box>
              <Typography
                sx={{ fontSize: "22px", color: "var(--green-color)" }}
              >
                {lang === "ar" ? "مستخدمين تم دعوتهم" : "pending users"}
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  border: "1px solid #eee",
                  padding: "1rem",
                }}
              >
                {pendingAdmins &&
                  pendingAdmins?.map((ele, i) => (
                    <Box
                      kei={i}
                      sx={{
                        display: "flex",
                        marginY: "1rem",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #eee",
                        paddingBottom: "1rem",
                        flexDirection: { xs: "column", md: "row" },
                      }}
                    >
                      <Box
                        sx={{
                          display: { xs: "block", md: "flex" },
                          marginBottom: { xs: "15px", md: "0px" },
                        }}
                      >
                        <Typography sx={{ marginLeft: "10px" }}>
                          {t("user_dashboard.users_manage.user_info.name")}:
                        </Typography>
                        <Typography sx={{ color: "gray", minWidth: "12rem" }}>
                          {ele?.username}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: { xs: "block", md: "flex" },
                          marginBottom: { xs: "15px", md: "0px" },
                        }}
                      >
                        <Typography sx={{ marginLeft: "10px" }}>
                          {t(
                            "user_dashboard.users_manage.user_info.phonenumber"
                          )}
                          :
                        </Typography>
                        <Typography sx={{ color: "gray", minWidth: "12rem" }}>
                          {ele?.phone}
                        </Typography>
                      </Box>

                      <DeleteIcon
                        sx={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleDeletePendingUser(ele.id)}
                      ></DeleteIcon>
                    </Box>
                  ))}
              </Box>
            </Box>
            <Box
              sx={{
                width: "80%",
                height: "0.5px",
                backgroundColor: "#e9e7e7;",
                marginY: "3rem",
                marginX: "auto",
              }}
            ></Box>
          </>
        ) : (
          ""
        )}

        {/* for active  */}
        {admins?.length > 0 ? (
          <Box>
            <Typography sx={{ fontSize: "22px", color: "var(--green-color)" }}>
              {t("user_dashboard.users_manage.title3")}
            </Typography>
            <Box
              sx={{ width: "100%", border: "1px solid #eee", padding: "1rem" }}
            >
              {admins &&
                admins?.map((ele, i) => (
                  <Box
                    kei={i}
                    sx={{
                      display: "flex",
                      marginY: "1rem",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "1rem",
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    <Box
                      sx={{
                        display: { xs: "block", md: "flex" },
                        marginBottom: { xs: "15px", md: "0px" },
                      }}
                    >
                      <Typography sx={{ marginLeft: "10px" }}>
                        {t("user_dashboard.users_manage.user_info.name")}:
                      </Typography>
                      <Typography sx={{ color: "gray", minWidth: "12rem" }}>
                        {ele?.username}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: { xs: "block", md: "flex" },
                        marginBottom: { xs: "15px", md: "0px" },
                      }}
                    >
                      <Typography sx={{ marginLeft: "10px" }}>
                        {t("user_dashboard.users_manage.user_info.phonenumber")}
                        :
                      </Typography>
                      <Typography sx={{ color: "gray", minWidth: "12rem" }}>
                        {ele?.phone}
                      </Typography>
                    </Box>

                    <DeleteIcon
                      sx={{ color: "red", cursor: "pointer" }}
                      onClick={() => handleDeleteOpenModal(ele.id)}
                    ></DeleteIcon>
                  </Box>
                ))}
            </Box>
          </Box>
        ) : (
          ""
        )}
      </Paper>
    </>
  );
};
export default Usersmangament;
