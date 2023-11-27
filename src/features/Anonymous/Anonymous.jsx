import { AppBar, Box, Stack, TextField, Typography, Toolbar } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button } from "antd";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import MessageIcon from "@mui/icons-material/Message";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import "./index.css";
import userApi from "../../api/userApi";
import { useEffect } from "react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import SearchIcon from "@mui/icons-material/Search";

import { FaSmile, FaSadTear, FaGrin, FaDizzy, FaAngry, FaMeh } from "react-icons/fa";
const Anonymous = () => {
  const [CountMessage, setCountMessage] = useState(0);
  const [getMessage, setGetMessageuser] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [searchContent, setSearchContent] = useState("");
  const [listUserOnline, setlistUserOnline] = useState([]);
  const [UserOnlineId, setUserOnlineId] = useState(10);
  const [UserIdSend, setUserIdSend] = useState([]);
  const [statusMess, setstatusMess] = useState();
  const [inputUser, setInputUser] = useState("");
  const [togglSearch, setTogglSearch] = useState(false);
  const [toggleOption, setToggleOption] = useState(false);
  const [toggleBlock, setToggleBlock] = useState(true);
  const [toggleRemoveBlock, setToggleRemoveBlock] = useState(true);
  const [toggleSearchContext, setToggleSearchContext] = useState(false);
  const [file, setFile] = useState(null);
  const [listInputUser, setListInputUser] = useState([]);
  const [listSearchUser, setListSearchUser] = useState([]);
  const [toggleIcon, setToggleIcon] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const My_button = styled(Button)({ backgroundColor: "#5BE260", color: "#fff" });
  const My_text = styled(Typography)({
    color: "#fff",
  });
  const users =
    useSelector((state) => state.user.current) || JSON.parse(localStorage.getItem("user"));
  // console.log(users);
  const handle_delete = () => {
    const deleteUser = document.querySelectorAll(".deleteUser");
    deleteUser.forEach((el) => {
      el.addEventListener("click", () => {
        const parent = el.parentElement.parentElement;
        parent.classList.add("none");
      });
    });
  };
  useEffect(() => {
    //
    setCountMessage(getMessage.length);
    console.log(CountMessage);
    document.title = `Bạn đang có ${getMessage.length} tin nhắn`;
  }, [CountMessage]);
  useEffect(() => {
    const check = listUserOnline.filter((user, index) => user.name.includes(inputUser));
    setListInputUser(check);
    if (check.length >= 1) {
      setTogglSearch(!togglSearch);
      // document.querySelector("#BoxBtnQuit").style.display = "block";
    }
    // check
    //   ? (document.querySelector("#BoxBtnQuit").style.display = "block")
    //   : (document.querySelector("#BoxBtnQuit").style.display = "none");

    // listUserOnline.forEach((user, index) => {
    //   // const display = document.querySelector("#BoxBtnQuit");

    //   if (user.name.includes(inputUser)) {
    //     setListInputUser(user);
    //     document.querySelector("#BoxBtnQuit").style.display = "block";
    //     setTogglSearch(!togglSearch);
    //   } else {
    //     document.querySelector("#BoxBtnQuit").style.display = "none";
    //   }
    // });
  }, [inputUser]);
  const HandleMessage = () => {
    const messageAnoymous = document.querySelectorAll(".messageAnoymous");
    messageAnoymous.forEach((el, index) => {
      el.addEventListener("click", (e) => {
        console.log(el.getAttribute("data-id"));
        const dataId = el.getAttribute("data-id");
        console.log(dataId);
        const [checkUser] = listUserOnline.filter((user) => user.id == dataId);
        console.log(checkUser);
        setUserOnlineId(checkUser);
      });
    });
    userApi.getMessage(UserOnlineId && UserOnlineId.id).then((data) => {
      setGetMessageuser(data.data);
    });
  };

  useEffect(() => {
    userApi.userOnline().then((res) => {
      const status = res.users.filter((user) => user.statesLogin === 1);
      setlistUserOnline(status);
    });
  }, [messageContent]);

  const sendMessage = () => {
    const data = axios({
      method: "POST",
      url: `http://14.225.7.221:18011/message/chat-unknown/${UserOnlineId.id}`,
      data: {
        content: messageContent,
        id: "",
        idReceive: UserOnlineId.id,
        idSend: users.id,
        sendAt: new Date().toISOString(),
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    data.then((datas) => {
      setstatusMess(datas.data.message);
    });
    setMessageContent("");
  };

  //////////////////////////////
  useEffect(() => {
    userApi.getMessage(users.id).then((data) => {
      setUserIdSend(data.data);
    });
  }, [messageContent]);
  useEffect(() => {
    document.querySelector(".inputMessageAnoymous").addEventListener("keydown", function (e) {
      if (e.keyCode === 13) {
        // console.log(1);
        // sendMessage();
      }
    });
  });
  ///serach
  useEffect(() => {
    const Content = getMessage.filter((mess) => mess.content.includes(searchContent));
    const received = UserIdSend.filter((mes) => mes.content.includes(searchContent));

    setListSearchUser(Content.concat(received));
    console.log(listSearchUser);
    if (listSearchUser.length >= 1) {
      document.querySelector(".Box_message").style.display = "none";
    } else {
      document.querySelector(".Box_message").style.display = "block";
    }
    // Content
    //   ? (document.querySelector(".Box_message").style.display = "none")
    //   : (document.querySelector(".Box_message").style.display = "block");
    // document.querySelector(".seachAnoymours").addEventListener("keydown", function (e) {
    //   if (e.keyCode === 13) {
    //     if (getMessage.length >= 1) {
    //       const Content = getMessage.filter((mess) => mess.content == searchContent);
    //       Content.forEach((message, index) => {
    //         document.querySelector(".HylinkSearch").setAttribute("href", `#${+message.id}`);
    //         const idContentSearch = document.querySelector(".HylinkSearch").getAttribute("href");
    //         setCurrentMessageId(idContentSearch);
    //       });
    //     } else if (getMessage == null) {
    //       console.log("null");
    //     } else {
    //       console.log("err");
    //     }
    //     const idContent = document.querySelectorAll(".contentMessage");
    //     idContent.forEach((id, index) => {
    //       const test = id.getAttribute("id");

    //       if (currentMessageId == `#${test}`) {
    //         id.style.backgroundColor = "#000";
    //         id.style.color = "#fff";
    //       } else {
    //         console.log("lỗi");
    //       }
    //     });
    //   }
    // });
  }, [searchContent]);
  //// xu ly file
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(file);
    };
  }, [file]);
  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
    console.log(URL.createObjectURL(file));
  });
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  /// block message
  const handleBlock = () => {
    setToggleOption(!toggleOption);
    if (UserOnlineId && !UserOnlineId.id) {
      return enqueueSnackbar("vui lòng chọn user", { variant: "error" });
    }
    setToggleBlock(!toggleBlock);
    const input = document.querySelector(".ChatMessage");
    const notifityBlock = document.querySelector(".notifityBlock");
    input.style.display = "none";
    notifityBlock.style.display = "block";
    enqueueSnackbar("Chặn tin nhắn thành công", { variant: "success" });
  };
  /// hủy block
  const handleRemoveBlock = () => {
    setToggleOption(!toggleOption);
    if (UserOnlineId && !UserOnlineId.id) {
      return enqueueSnackbar("vui lòng chọn user", { variant: "error" });
    }
    setToggleRemoveBlock(!toggleRemoveBlock);
    const input = document.querySelector(".ChatMessage");
    const notifityBlock = document.querySelector(".notifityBlock");
    input.style.display = "block";
    notifityBlock.style.display = "none";
    enqueueSnackbar(" Hủy chặn tin nhắn thành công", { variant: "success" });
  };
  ///search messge

  const handleSearch = () => {
    setToggleOption(!toggleOption);
    if (UserOnlineId == users.id) {
      return enqueueSnackbar(" vui lòng chọn user ", { variant: "error" });
    } else {
      const search = document.querySelector(".seachAnoymours");
      setToggleSearchContext(!toggleSearchContext);
      search.style.display = `${toggleSearchContext ? "none" : "block"}`;

      enqueueSnackbar(" tìm kiếm tin nhắn", { variant: "success" });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box
        className='SideBarAy'
        sx={{
          maxWidth: 430 + "px",
          backgroundColor: "#000000",
          paddingLeft: 40 + "px",
          paddingRight: 35 + "px",
          paddingTop: 24 + "px",
          paddingBottom: 24 + "px",
        }}
      >
        <Link to={"/home/profile/"}>
          <Stack>
            <Stack direction='row' alignItems='center' justifyContent='space-around'>
              <img
                style={{
                  width: 60 + "px",
                  height: 60 + "px",
                }}
                src={`${process.env.PUBLIC_URL + "/assets/andanh.png"}`}
              ></img>
              <My_text className='marginAnoy' mr={20} variant='h5'>
                Anonymous
              </My_text>
              <SettingsIcon
                style={{
                  color: "#fff",
                  fontSize: 35 + "px",
                }}
              />
            </Stack>
          </Stack>
        </Link>
        <Stack>
          <TextField
            onChange={(e) => {
              setInputUser(e.target.value);
            }}
            value={inputUser}
            sx={{
              borderRadius: 30 + "px",
              backgroundColor: "#DADADA",
              "&:focus": {
                outline: "none",
              },
            }}
            placeholder='Search User'
          ></TextField>
        </Stack>
        <Box
          className='box_anoymous'
          id='BoxBtnQuit'
          sx={{
            width: 100 + "%",
            height: 220 + "px",
            display: "flex",
            flexDirection: "column",
            borderRadius: 12 + "px",
            marginTop: 20 + "px",
            marginBottom: 20 + "px",
          }}
        >
          <Stack direction='row' alignItems='center' justifyContent='center'>
            <img
              style={{
                width: 45 + "px",
                height: 45 + "px",
              }}
              src={`${process.env.PUBLIC_URL + "/assets/andanh.png"}`}
            ></img>
            <My_text variant='h5'>Anonymous</My_text>
          </Stack>
          <My_text textAlign='center' variant='subtitle1'>
            You now in anonymous mode. You can chat with others anonymously
          </My_text>
          <Link to={"/home/profile"}>
            <My_button
              style={{
                marginBottom: 10 + "px",
                marginTop: 10 + "px",
                fontSize: 18 + "px",
                height: 50 + "px",
                width: 100 + "%",
              }}
              color={My_button}
            >
              Quit
            </My_button>
          </Link>
        </Box>
        <Stack
          className='boxUserOnline'
          sx={{
            backgroundColor: "#636363",
            padding: 15 + "px",
            paddingLeft: 30 + "px",
            paddingRight: 30 + "px",
            borderRadius: 28 + "px",
            marginBottom: 15 + "px",
          }}
        >
          <Stack direction='row' justifyContent='space-between'>
            <My_text
              style={{
                fontSize: 20 + "px",
              }}
            >
              Online User
            </My_text>
            <MoreHorizIcon
              style={{
                color: "#fff",
              }}
            />
          </Stack>
          <Box>
            {togglSearch == false
              ? listUserOnline.map((user, index) => {
                  return (
                    users.id != user.id && (
                      <Stack
                        className='User_mess'
                        key={index}
                        direction='row'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <Stack
                          className='messageAnoymous hiddle'
                          data-id={user.id}
                          onClick={HandleMessage}
                          direction='row'
                          alignItems='center'
                          mt={2}
                          mb={1}
                          style={{ cursor: "pointer", position: "relative" }}
                          // className='anonymos_img'
                        >
                          <img
                            style={{
                              width: 60 + "px",
                              height: 60 + "px",
                              borderRadius: 50 + "px",
                            }}
                            src={user.img}
                            alt=''
                          />
                          <My_text ml={1}>{user.name}</My_text>
                        </Stack>

                        <Stack direction='row' alignItems='center'>
                          <DeleteIcon
                            className='deleteUser hiddle'
                            data={index}
                            onClick={handle_delete}
                            style={{
                              fontSize: 30 + "px",
                              cursor: "pointer",
                              color: "#fff",
                            }}
                          />
                          <MessageIcon
                            // className='messageAnoymous hiddle'
                            // data-id={user.id}
                            // onClick={HandleMessage}
                            style={{
                              color: "#fff",
                              padding: 4 + "px",
                              fontSize: 35 + "px",
                              cursor: "pointer",
                            }}
                          />
                        </Stack>
                      </Stack>
                    )
                  );
                })
              : listInputUser &&
                listInputUser.map((user, index) => {
                  return (
                    users.id != user.id && (
                      <Stack
                        className='User_mess'
                        key={index}
                        direction='row'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <Stack
                          direction='row'
                          alignItems='center'
                          mt={2}
                          mb={1}
                          style={{ cursor: "pointer", position: "relative" }}
                          className='anonymos_img'
                        >
                          <img
                            style={{
                              width: 60 + "px",
                              height: 60 + "px",
                              borderRadius: 50 + "px",
                            }}
                            src={user.img}
                            alt=''
                          />
                          <My_text ml={1}>{user.name}</My_text>
                        </Stack>

                        <Stack direction='row' alignItems='center'>
                          <DeleteIcon
                            className='deleteUser hiddle'
                            data={index}
                            onClick={handle_delete}
                            style={{
                              fontSize: 30 + "px",
                              cursor: "pointer",
                              color: "#fff",
                            }}
                          />
                          <MessageIcon
                            className='messageAnoymous hiddle'
                            data-id={user.id}
                            onClick={HandleMessage}
                            style={{
                              color: "#fff",
                              padding: 4 + "px",
                              fontSize: 35 + "px",
                              cursor: "pointer",
                            }}
                          />
                        </Stack>
                      </Stack>
                    )
                  );
                })}
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          width: 100 + "%",
        }}
      >
        <img
          style={{
            width: 100 + "%",
            height: 100 + "%",
            objectFit: "cover",
          }}
          src={"https://st.quantrimang.com/photos/image/2018/01/05/bo-suu-tap-hinh-nen-3.jpg"}
          alt=''
        />
        {/*  */}
        <Box>
          <header
            className='box_anoymous'
            style={{
              position: "absolute",
              width: 65 + "%",
              display: "flex",
              height: 80 + "px",
              alignItems: "center",
              justifyContent: "space-between",
              top: 0,
            }}
          >
            <Link to={`/profile/${(UserOnlineId && UserOnlineId.id) || users.id}`}>
              <Stack direction='row' alignItems='center'>
                <img
                  style={{
                    width: 60 + "px",
                    height: 60 + "px",
                    borderRadius: 50 + "px",
                    marginRight: 10 + "px",
                  }}
                  src={(UserOnlineId && UserOnlineId.img) || `${users.Avarta}`}
                  alt=''
                />
                <My_text>{(UserOnlineId && UserOnlineId.name) || users.name}</My_text>
              </Stack>
            </Link>
            <MoreHorizIcon
              onClick={() => {
                setToggleOption(!toggleOption);
              }}
              style={{
                position: "relative",
                color: "#fff",
              }}
            />
            <Stack
              style={{
                display: `${toggleOption ? "block" : "none"}`,
                minWidth: 150 + "px",
                zIndex: 100,
                height: 100 + "%",
                borderRadius: 12 + "px",
                padding: 10 + "px",
                backgroundColor: "#fff",
                position: "absolute",
                top: 60,
                right: 30,
                color: "#000",
              }}
              direction={"column"}
            >
              <p
                onClick={handleSearch}
                style={{
                  cursor: "pointer",
                }}
              >
                Tìm kiếm
              </p>
              <p
                style={{
                  cursor: "pointer",
                  marginTop: 4 + "px",
                }}
                onClick={handleBlock}
              >
                Chặn tin nhắn
              </p>
              <p
                onClick={handleRemoveBlock}
                style={{
                  cursor: "pointer",
                  marginTop: 4 + "px",
                }}
              >
                Hủy chặn tin nhắn
              </p>
            </Stack>
          </header>
        </Box>

        {/*  */}
        <Box
          className='seachAnoymours'
          sx={{
            color: "#fff",
            display: "none",
            zIndex: 1300,
          }}
        >
          <header
            className='box_anoymous'
            style={{
              position: "absolute",
              width: 65 + "%",
              display: "flex",
              height: 80 + "px",
              alignItems: "center",
              justifyContent: "space-between",
              top: 81,
              color: "#fff",
            }}
          >
            <Stack
              style={{
                width: 100 + "%",
              }}
              direction='row'
              alignItems='center'
            >
              <SearchIcon
                style={{
                  fontSize: 35 + "px",
                }}
              />

              <input
                className='inputSearchcontent'
                value={searchContent}
                onChange={(e) => setSearchContent(e.target.value)}
                style={{
                  width: 100 + "%",
                  height: 50 + "px",
                  padding: 2 + "px",
                  fontSize: 17 + "px",
                  borderStyle: "solid",
                  borderWidth: 1 + "px",
                  backgroundColor: "rgba(255, 255, 255, 10%)",
                  outline: "none",
                }}
              />
              <a className='HylinkSearch' style={{ color: "#fff", cursor: "pointer" }}>
                <ArrowDownwardIcon />
              </a>
            </Stack>
          </header>
        </Box>
        {/*  */}
        <Box
          className='Box_message box_anoymous'
          sx={{
            position: "absolute",
            maxWidth: 800 + "px",
            borderRadius: 32 + "px",
            marginBottom: 30 + "px",
            right: 0,
            top: 200,
          }}
        >
          {UserOnlineId &&
            getMessage.map((message, index) => {
              return UserOnlineId.id == message.idSend ? (
                <Stack key={message.id} mt={4} direction='column' alignItems='center'>
                  <Stack
                    style={{
                      marginRight: 100 + "px",
                      padding: 10 + "px",
                      borderRadius: 50 + "px",
                    }}
                    className='received'
                    direction={"row"}
                    mt={2}
                  >
                    <>
                      <img
                        style={{ width: 60 + "px", height: 60 + "px", borderRadius: 50 + "px" }}
                        src={`${UserOnlineId.img || process.env.PUBLIC_URL + "/assets/user.png"}`}
                        alt=''
                      ></img>
                      <Box
                        // className={`${message.idSend == `${users.id}` ? "sent" : "received"}`}
                        classList={"received"}
                        ml={2}
                        sx={{
                          width: 450 + "px",
                          padding: 10 + "px",
                          minHeight: 50 + "px",
                          borderRadius: 24 + "px",
                        }}
                      >
                        <div id={`${message.id}`}>
                          <p className='contentMessage' id={message.id} style={{ fontWeight: 600 }}>
                            {message.content}
                          </p>
                          <p>Đã gửi:{message.sendAt} </p>
                        </div>
                      </Box>
                    </>
                  </Stack>
                </Stack>
              ) : (
                ""
              );
            })}
          {UserOnlineId &&
            UserIdSend.map((message) => {
              return UserOnlineId.id == message.idReceive ? (
                <Stack mt={4} direction='column' alignItems='center'>
                  <Stack
                    style={{
                      marginLeft: 100 + "px",
                      backgroundColor: "#5BE260",
                      padding: 10 + "px",
                      borderRadius: 50 + "px",
                    }}
                    direction={"row"}
                    mt={2}
                  >
                    <>
                      <img
                        style={{ width: 60 + "px", height: 60 + "px" }}
                        src={`${process.env.PUBLIC_URL + "/assets/anoymous.png"}`}
                        alt=''
                      ></img>
                      <Box
                        classList={"sent"}
                        ml={2}
                        sx={{
                          width: 450 + "px",
                          padding: 10 + "px",
                          minHeight: 50 + "px",
                          borderRadius: 24 + "px",
                        }}
                      >
                        <div>
                          <p id={message.id} className='contentMessage' style={{ fontWeight: 600 }}>
                            {message.content}
                          </p>
                          <p>Đã gửi:{message.sendAt} </p>
                        </div>
                      </Box>
                    </>
                  </Stack>
                </Stack>
              ) : (
                ""
              );
            })}
          ;
          {file && (
            <div>
              <img style={{ marginTop: 15 + "px" }} src={URL.createObjectURL(file)} alt='' />
              <My_text>{file.name}</My_text>
              <a
                style={{
                  color: "#fff",
                }}
                href={URL.createObjectURL(file)}
                download
              >
                {" "}
                Download
              </a>
            </div>
          )}
        </Box>
        {listSearchUser &&
          listSearchUser.map((mess) => {
            return (
              <a
                href={`#${mess.id}`}
                onClick={() => {
                  document.querySelector(".Box_message").style.display = "block";
                  console.log(document.getElementById(`${mess.id}`));
                  document.getElementById(`${mess.id}`).style.backgroundColor = "#000";
                  document.getElementById(`${mess.id}`).style.color = "#fff";
                  document.getElementById(`${mess.id}`).style.borderRadius = 12 + "px";
                  setListSearchUser("");
                }}
              >
                <p
                  style={{
                    position: "absolute",
                    maxWidth: 800 + "px",
                    borderRadius: 32 + "px",
                    marginBottom: 30 + "px",
                    color: "#fff",
                    left: 500,
                    top: 200,
                  }}
                >
                  {mess.content}
                </p>
              </a>
            );
          })}
      </Box>

      <Box
        className='ChatMessage input_mea '
        mt={5}
        sx={{
          position: "absolute",
          bottom: -100,
          left: 45 + "%",
        }}
      >
        <Stack direction='row' alignItems='center'>
          <img
            style={{ width: 60 + "px", height: 60 + "px" }}
            src={`${process.env.PUBLIC_URL + "/assets/anoymous.png"}`}
            alt=''
          />
          <div {...getRootProps()}>
            {isDragActive ? (
              <AttachFileIcon
                {...getInputProps()}
                className='File'
                style={{
                  fontSize: 35 + "px",
                  color: "#fff",
                  cursor: "pointer",
                }}
              />
            ) : (
              <AttachFileIcon
                className='File'
                style={{
                  fontSize: 35 + "px",
                  color: "#fff",
                  cursor: "pointer",
                }}
              />
            )}
          </div>
          <div
            onClick={() => {
              setToggleIcon(!toggleIcon);
            }}
            style={{ cursor: "pointer", marginRight: 2 + "px", position: "relative" }}
          >
            <FaSmile size={35} color='#FFF' />
          </div>
          <Stack
            direction={"row"}
            a
            sx={{
              display: "flex",
              display: `${toggleIcon ? "block" : "none"}`,
              position: "absolute",
              top: -205 + "px",
              flexWrap: "wrap",
              width: 200 + "px",
              height: 200 + "px",
              backgroundColor: "#fff",
            }}
          >
            <FaSmile size={32} color='yellow' />
            <FaSadTear size={32} color='blue' />
            <FaGrin size={32} color='green' />
            <FaDizzy size={32} color='purple' />
            <FaAngry size={32} color='red' />
            <FaMeh size={32} color='orange' />
          </Stack>
          <TextField
            className={"inputMessageAnoymous"}
            style={{
              backgroundColor: "#D3D3D3",
              width: 550 + "px",
              borderRadius: 32 + "px",
            }}
            placeholder='Give a comment'
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          ></TextField>
          <img
            onClick={sendMessage}
            style={{ width: 60 + "px", height: 60 + "px", cursor: "pointer" }}
            src={`${process.env.PUBLIC_URL + "/assets/send.png"}`}
            alt=''
          />
        </Stack>
      </Box>
      <Typography
        className='notifityBlock'
        mt={1}
        sx={{
          display: "none",
          position: "absolute",
          bottom: 0,
          left: 45 + "%",
          color: "#fff",
          fontSize: 22 + "px",
        }}
      >
        Người này đã đang bị chặn , Bạn không thể liên lạc
      </Typography>
    </Box>
  );
};

export default Anonymous;
