import React, { useContext, useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import FooterTwo from "./FooterTwo";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import { io } from "socket.io-client";
import { ChatDialogStyle } from "../../styledComponents/MainPageStyles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ChatContext from "../../context/chatContext";
import { useTranslation } from "react-i18next";
import { toast, Toaster } from "react-hot-toast";
import useDataFetcher from "../../api/useDataFetcher ";

import DownloadingIcon from "@mui/icons-material/Downloading";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import { myAxios } from "../../api/myAxios";
const Layout = ({ children, showNavFooter = true, contentStyles = {} }) => {
  const location = useLocation();
  const { pathname } = location;
  const hideFooter = location.pathname.includes("/mappage");
  const hideNavAndFooter =
    location.pathname.includes("/details") || pathname === "/deals";
  const { isUserSelected, setIsUserSelected } = useContext(ChatContext);

  const theme = useTheme();
  // Use Mui useMediaQuery to check if screen size is medium (md) and below
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  // for socket states
  const [showMessages, setShowMessages] = useState(false);
  // for socket states

  // for notifiacetion
  const { data, isLoading, get } = useDataFetcher();
  const [notificationData, setNotificationData] = useState([]);

  useEffect(() => {
    const isUser = localStorage.getItem("user_token") ? true : false;
    if (isUser) {
      get("api/user/get_user_notifications");
    }
  }, []);
  useEffect(() => {
    if (data) {
      setNotificationData(data);
    }
  }, [data]);

  return (
    <div>
      {showNavFooter && (!hideNavAndFooter || !isMediumScreen) && (
        <Nav
          showMessages={showMessages}
          setShowMessages={setShowMessages}
          isUserSelected={isUserSelected}
          setIsUserSelected={setIsUserSelected}
          notificationData={notificationData}
        />
      )}
      <main style={contentStyles}>{children}</main>
      {showNavFooter &&
        !hideFooter &&
        (!hideNavAndFooter || !isMediumScreen) && <FooterTwo />}

      {isUserSelected && <ChatDialog setIsUserSelected={setIsUserSelected} />}
    </div>
  );
};

const ChatDialog = () => {
  const {
    message,
    setMessage,
    socket,
    messages,
    setIsUserSelected,
    setIsSendMessage,
    recipientId,
    user,
    file,
    setFile,
    userKlickedData,
    setUserKlickedData,
    fileData,
    setFileData,
  } = useContext(ChatContext);
  const nav = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const fileInputRef = useRef(null);

  const [isActionsHide, setIsActionHide] = useState(false);

  const handleSend = async () => {
    const formData = new FormData();
    formData.append("message", message);
    formData.append("to_user_id", recipientId);
    formData.append("file", file);
    cancelSelectedFile();
    setIsSendMessage((prev) => !prev);
    const token = localStorage.getItem("user_token");
    const res = await axios.post(
      `https://www.dashboard.aqartik.com/api/chat/sendMessage`,
      formData,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.status === 1) {
      // setContacts(re.data.contacts);
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
      nav("../login");
    } else {
    }
    // await fetch("https://www.dashboard.aqartik.com/api/chat/sendMessage", {
    //   method: "POST",
    //   headers: {
    //     authorization: `Bearer ${localStorage.getItem("user_token")}`,
    //   },
    //   body: formData,
    // });
  };
  const handleAttachFile = () => {
    fileInputRef.current.click();
  };

  const cancelSelectedFile = () => {
    setFile(null);
  };

  function createBlobUrl(base64Data, contentType) {
    // Extract base64-encoded data from the data URL
    const cleanedBase64Data = base64Data.split(",")[1];
    const byteCharacters = atob(cleanedBase64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return URL.createObjectURL(blob);
  }

  const handleAcceptInvite = async (user_id, message_id) => {
    console.log(user_id, message_id);
    await myAxios.get(
      `/api/user/invitation_action?status=accept&user_id=${user_id}&message_id=${message_id}`
    );
    setIsActionHide(true);
  };

  const handleDenyInvite = () => {
    setIsActionHide(true);
  };

  return (
    <ChatDialogStyle $dir={lang}>
      <header>
        <div className="header-data">
          <img
            style={{
              objectPosition: "center",
            }}
            src={
              userKlickedData?.image?.name
                ? `https://www.dashboard.aqartik.com/assets/images/users/logo/${userKlickedData?.image?.name}`
                : "https://www.dashboard.aqartik.com/assets/images/users/logo/avatar.png"
            }
            alt=""
          />
          <span>{userKlickedData?.username}</span>
        </div>
        <CloseRoundedIcon
          className="close-icon"
          onClick={() => {
            setIsUserSelected(false);
            setUserKlickedData(null);
          }}
        />
      </header>

      <main>
        {messages &&
          messages.map((ele, i) => {
            // Calculate the time difference
            const backendDate = new Date(ele.created_at); // Assuming createdAt holds the message's creation date
            const currentDate = new Date();
            const timeDifference = currentDate - backendDate;
            const secondsDifference = Math.floor(timeDifference / 1000);

            let timeAgo;
            if (secondsDifference < 60) {
              timeAgo =
                lang === "en"
                  ? `${secondsDifference} seconds ago`
                  : `${secondsDifference} ثانية مضت`;
            } else if (secondsDifference < 3600) {
              const minutes = Math.floor(secondsDifference / 60);
              timeAgo =
                lang === "en"
                  ? `${minutes} minutes ago`
                  : `${minutes} دقيقة مضت`;
            } else if (secondsDifference < 86400) {
              const hours = Math.floor(secondsDifference / 3600);
              timeAgo =
                lang === "en" ? `${hours} hours ago` : `${hours} ساعة مضت`;
            } else {
              const days = Math.floor(secondsDifference / 86400);
              timeAgo = lang === "en" ? `${days} days ago` : `${days} يوم مضى`;
            }

            return (
              <div
                className={`message-container ${
                  ele?.senderId === user?.id || ele?.from_id === user?.id
                    ? "send-container"
                    : "recieve-container"
                }`}
                key={i}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {ele.type === "normal" ? (
                    <>
                      <div
                        className={`message ${
                          ele?.senderId === user?.id ||
                          ele?.from_id === user?.id
                            ? "sended-message"
                            : "recieved-message"
                        }`}
                      >
                        <p>{ele?.message || ele.body}</p>

                        {ele?.fileData && (
                          <a
                            style={{
                              textDecoration: "none",
                              color: "white",
                              backgroundColor: "rgba(200,200,200,.5)",
                              padding: "8px 4px",
                              borderRadius: "8px",
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                              marginTop: ".5rem",
                            }}
                            href={createBlobUrl(
                              ele.fileData.fileData,
                              "application/pdf"
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={ele.fileData.fileName}
                          >
                            <span>{ele.fileData.fileName}</span>
                            <DownloadingIcon />
                          </a>
                        )}
                        {ele?.attachment && (
                          <a
                            style={{
                              textDecoration: "none",
                              color: "white",
                              backgroundColor: "rgba(200,200,200,.5)",
                              padding: "8px 4px",
                              borderRadius: "8px",
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                              marginTop: ".5rem",
                            }}
                            href={`https://www.dashboard.aqartik.com/assets/chat/attachment/${ele.attachment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            // download
                          >
                            <span>{ele.attachment}</span>
                            <DownloadingIcon />
                          </a>
                        )}
                      </div>
                      <span
                        style={{
                          alignSelf:
                            ele?.senderId === user?.id ||
                            ele?.from_id === user?.id
                              ? "flex-start"
                              : "flex-end",
                          fontSize: "12px",
                          padding: "2px",
                        }}
                      >
                        {timeAgo}
                      </span>
                    </>
                  ) : ele.type === "action" ? (
                    <div class="customized-msg">
                      <div class="message custom-message">
                        <p>
                          {" "}
                          {lang === "ar"
                            ? `تمت دعوتك من قبل ${
                                JSON.parse(ele?.body).username
                              }`
                            : `You've been invited by ${
                                JSON.parse(ele?.body).username
                              }`}
                        </p>
                      </div>
                      <div class="msg-btns-con">
                        {isActionsHide ? (
                          ""
                        ) : (
                          <>
                            <a
                              onClick={() =>
                                handleAcceptInvite(
                                  JSON.parse(ele.body).user_id,
                                  ele.id
                                )
                              }
                              class="msg-btn btn-success"
                            >
                              {lang === "ar" ? "أوافق" : "accept"}
                            </a>
                            <a
                              onClick={handleDenyInvite}
                              class="msg-btn btn-deny"
                            >
                              {lang === "ar" ? "رفض" : "deny"}
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  ) : ele.type === "html" ? (
                    <>
                      <div
                        className={`message ${
                          ele?.senderId === user?.id ||
                          ele?.from_id === user?.id
                            ? "sended-message"
                            : "recieved-message"
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: ele.body,
                        }}
                      ></div>
                      <span
                        style={{
                          alignSelf:
                            ele?.senderId === user?.id ||
                            ele?.from_id === user?.id
                              ? "flex-start"
                              : "flex-end",
                          fontSize: "12px",
                          padding: "2px",
                        }}
                      >
                        {timeAgo}
                      </span>
                    </>
                  ) : (
                    <>
                      <div
                        className={`message ${
                          ele?.senderId === user?.id ||
                          ele?.from_id === user?.id
                            ? "sended-message"
                            : "recieved-message"
                        }`}
                      >
                        <p>{ele?.message || ele.body}</p>

                        {ele?.fileData && (
                          <a
                            style={{
                              textDecoration: "none",
                              color: "white",
                              backgroundColor: "rgba(200,200,200,.5)",
                              padding: "8px 4px",
                              borderRadius: "8px",
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                              marginTop: ".5rem",
                            }}
                            href={createBlobUrl(
                              ele.fileData.fileData,
                              "application/pdf"
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={ele.fileData.fileName}
                          >
                            <span>{ele.fileData.fileName}</span>
                            <DownloadingIcon />
                          </a>
                        )}
                        {ele?.attachment && (
                          <a
                            style={{
                              textDecoration: "none",
                              color: "white",
                              backgroundColor: "rgba(200,200,200,.5)",
                              padding: "8px 4px",
                              borderRadius: "8px",
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                              marginTop: ".5rem",
                            }}
                            href={`https://www.dashboard.aqartik.com/assets/chat/attachment/${ele.attachment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            // download
                          >
                            <span>{ele.attachment}</span>
                            <DownloadingIcon />
                          </a>
                        )}
                      </div>
                      <span
                        style={{
                          alignSelf:
                            ele?.senderId === user?.id ||
                            ele?.from_id === user?.id
                              ? "flex-start"
                              : "flex-end",
                          fontSize: "12px",
                          padding: "2px",
                        }}
                      >
                        {timeAgo}
                      </span>
                    </>
                  )}
                </div>
                {/* {!(ele?.socketID == socket?.id) && (
              <img src={userData?.image?.name} alt="" />
            )} */}
              </div>
            );
          })}
      </main>

      <footer>
        {file && (
          <div className="selected-file">
            <span>{file?.name}</span>
            <ClearIcon onClick={cancelSelectedFile} />
          </div>
        )}
        <div className="footer-container">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            rows={"1"}
            placeholder={lang === "ar" ? "رسالتك هنا..." : "your text here..."}
          ></textarea>
          <button>
            <AttachFileIcon onClick={handleAttachFile} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => {
              // Handle the selected file
              const selectedFile = e.target.files[0];
              setFile(selectedFile);
              const reader = new FileReader();
              reader.onload = (fileEvent) => {
                const fileData = fileEvent.target.result;
                const fileInfo = { fileName: selectedFile.name, fileData };
                setFileData(fileInfo);
              };
              reader.readAsDataURL(selectedFile);
            }}
          />
          <button onClick={handleSend}>
            <SendIcon
              sx={{
                transform: lang === "ar" ? "rotate(180deg)" : "",
              }}
            />
          </button>
        </div>
      </footer>
    </ChatDialogStyle>
  );
};
export { Layout };
