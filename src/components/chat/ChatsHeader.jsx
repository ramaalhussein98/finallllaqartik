import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { myAxios } from "../../api/myAxios";
import useDataFetcher from "../../api/useDataFetcher ";
import ChatContext from "../../context/chatContext";
import { ListItemDiv } from "../../styledComponents/MainPageStyles";
import VerifiedIcon from "@mui/icons-material/Verified";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router";
import { CircularProgress } from "@mui/material";
import UserContext from "../../context/userContext";

export const ChatsHeader = ({
  setIsUserSelected,
  setShowMessages,
  showMessages,
}) => {
  // const { data, isLoading, get } = useDataFetcher();
  const nav = useNavigate();
  const [contacts, setContacts] = useState();
  const [isLoading, setIsLoading] = useState(true);
  // const [contacts, setContacts] = useState([]);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { userKlickedData, setUserKlickedData } = useContext(ChatContext);

  useEffect(() => {
    if (showMessages === true) {
      // get("/api/chat/getContacts");
      const token = localStorage.getItem("user_token");
      const getData = async () => {
        const res = await axios.get(
          `https://www.dashboard.aqartik.com/api/chat/getContacts`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.status === 1) {
          setIsLoading(false);
          setContacts(res.data.contacts);
          // setIsLoadingData(false);
        } else if (
          res.data.status === 0 &&
          res.data.message === "401 Unauthorized"
        ) {
          // setIsLoadingData(false);
          toast.error(
            lang === "ar"
              ? "غير مصرح، يرجى تسجيل الدخول"
              : "unauthorized, please login again"
          );
          setIsLoading(false);
          localStorage.removeItem("user_token");
          nav("../login");
        } else {
        }
      };
      getData();
    }
  }, [showMessages]);

  const { setRecipientId } = useContext(ChatContext);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const messagesWrapper = document.querySelector(".messages-wrapper");
      const messagesWrapperIcon = document.querySelector(".message-icon");
      if (
        messagesWrapper &&
        !messagesWrapper.contains(event.target) &&
        messagesWrapperIcon &&
        !messagesWrapperIcon.contains(event.target)
      ) {
        setShowMessages(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const seenFunction = async (id) => {
    const formData = new FormData();
    formData.append("id", id);
    // await myAxios.post(``, formData);
    const token = localStorage.getItem("user_token");
    const res = await axios.post(
      `https://www.dashboard.aqartik.com/api/chat/seen`,
      formData,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.status === 1) {
      setContacts(res.data.contacts);
      // setIsLoadingData(false);
    } else if (
      res.data.status === 0 &&
      res.data.message === "401 Unauthorized"
    ) {
      // setIsLoadingData(false);
      toast.error(
        lang === "ar"
          ? "غير مصرح، يرجى تسجيل الدخول"
          : "unauthorized, please login again"
      );
      localStorage.removeItem("user_token");
      localStorage.removeItem("userData");
      localStorage.removeItem("userMembership");
      localStorage.removeItem("userLocation");
      nav("../login");
    } else {
    }
  };

  return (
    <div className="messages-wrapper">
      {isLoading ? (
        <CircularProgress className="loader" color="success" />
      ) : (
        <>
          <h3>{t("messages_header.title")}</h3>
          {contacts?.length > 0
            ? contacts.map((ele) => {
                const messageDate =
                  ele?.lastMessage &&
                  new Date(ele?.lastMessage?.created_at)
                    .toISOString()
                    .slice(0, 10);
                return (
                  <ListItemDiv
                    $dir={lang}
                    onClick={() => {
                      setIsUserSelected(true);
                      setUserKlickedData(ele);
                      setRecipientId(ele.id);
                      seenFunction(ele.lastMessage?.id);
                    }}
                    key={ele.id}
                  >
                    <div
                      style={{
                        borderRadius: "50%",
                        width: "50px",
                        flex: "1",
                        border: "1px solid #cccccc",
                        height: "50px",
                      }}
                    >
                      <img
                        src={
                          ele?.image?.name
                            ? `https://www.dashboard.aqartik.com/assets/images/users/logo/${ele?.image?.name}`
                            : "https://www.dashboard.aqartik.com/assets/images/users/logo/avatar.png"
                        }
                        alt=""
                        style={{
                          borderRadius: "50%",
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: "4",
                        gap: "4px",
                        marginTop: "16px",
                        width: "100%",
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 500 }}>{ele.username}</span>
                        {ele.id === 1 && (
                          <VerifiedIcon
                            sx={{ color: "#14b183", fontSize: "13px" }}
                          />
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row-reverse",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontSize: "13px" }}>{messageDate}</span>
                        <p style={{ fontSize: "14px" }}>
                          {ele?.lastMessage.type === "action"
                            ? lang === "ar"
                              ? `تمت دعوتك من قبل ${
                                  JSON.parse(ele?.lastMessage.body).username
                                }`
                              : `You've been invited by ${
                                  JSON.parse(ele?.lastMessage.body).username
                                }`
                            : ele?.lastMessage.type === "html"
                            ? lang === "ar"
                              ? "اشعارات نظام"
                              : "system notification"
                            : ele?.lastMessage?.body.length > 40
                            ? ele?.lastMessage?.body.slice(0, 40) + "..."
                            : ele?.lastMessage?.body}
                        </p>
                      </div>
                    </div>
                  </ListItemDiv>
                );
              })
            : lang === "ar"
            ? "لايوجد رسائل لعرضها"
            : "no messages to show"}
        </>
      )}
    </div>
  );
};
