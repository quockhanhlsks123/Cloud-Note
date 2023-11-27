import { Link, useParams } from "react-router-dom";
import { Box, createTheme, Typography, Button, Stack, TextField } from "@mui/material";
import rectangleImage from "./img/Rectangle 1.png";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import messImg from "./img/messImg.svg";
import React, { useEffect, useState } from "react";
import classes from "../Groups/styles.module.css";
import "./index.scss";
import classNames from "classnames";
import userApi from "../../api/userApi";
import { useSelector } from "react-redux";
import Message from "../../components/Message/Message";
import { profileUser } from "../../features/Auth/userSlice";
import { checkJWT } from "../../constants";
import ListView from "../Archived/ListView/index";
function Profile({ usergg, data, handleDelNote, setArchivedData, toolsNote }) {
  const theme = createTheme({
    components: {
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            h1: "h2",
            h2: "h2",
            h3: "h2",
            h4: "h2",
            h5: "h2",
            h6: "h2",
            subtitle1: "h2",
            subtitle2: "h2",
            body1: "span",
            body2: "span",
          },
        },
      },
    },
  });
  const dispatch = useDispatch();
  useEffect(() => {
    document.querySelectorAll(" .content ").forEach((item) => {
      item.addEventListener("click", function (e) {
        if (item.classList.contains("content")) {
          item.classList.remove("content");
          item.classList.remove("title");
          item.classList.add("expanded");
          item.classList.add("title-expand");
        } else {
          item.classList.remove("expanded");
          item.classList.remove("title-expand");
          item.classList.add("title");

          item.classList.add("content");
        }
      });
    });
    document.querySelectorAll(".title  ").forEach((item) => {
      item.addEventListener("click", function (e) {
        if (item.classList.contains("title")) {
          item.classList.remove("title");
          item.classList.add("title-expand");
        } else {
          item.classList.remove("title-expand");
          item.classList.add("title");
        }
      });
    });
  }, []);

  const handle_message = () => {
    set_togle_Message(!togle_Message);
  };
  const user =
    useSelector((state) => state.user.current) || JSON.parse(localStorage.getItem("user"));

  const [selected, setSelected] = useState(0);
  const [profile, setProfile] = useState([]);
  const [profileInfo, setProfileInfo] = useState([]);
  const [limitedDataPrv, setLimitedDataPrv] = useState([]);
  const [limitedDataPbl, setLimitedDataPbl] = useState([]);
  const [toggleData, setToggleData] = useState([]);
  const [maxRecordsToShow, setMaxRecordsToShow] = useState(12);
  const [togle_Message, set_togle_Message] = useState(false);
  const [userOnline, setUserOnline] = useState([]);
  const [toggleNote, setToggleNote] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [listSearchUser, setListSearchUser] = useState([]);

  const ConvertTypeNoteToComponent = ({ note }) => {
    switch (note.type) {
      case "screenshot":
        return (
          <div
            style={{
              height: "70%",
              width: "30%",
              overflow: "hidden",
              display: "grid",
              placeItems: "center",
              position: "relative",
            }}
          >
            <img
              style={{ objectFit: "cover", height: "80%", width: "80%" }}
              src={note.metaData}
              alt='note img'
            />
          </div>
        );
      case "text":
        return <p className='content'>{note.data}</p>;
      case "checkList":
        return note.data.map((e) => (
          <div>
            <p
              style={{
                fontSize: "22px",
                fontWeight: "600",
                width: "200px",
              }}
              key={e.id}
            >
              {e.content}
            </p>
          </div>
        ));
      default:
        return <></>;
    }
  };

  const handleNote = (id, noteArr) => {
    setToggleData(noteArr);
    setSelected(noteArr.findIndex((e) => e.idNote === id));
    setToggleNote(!toggleNote);
  };
  useEffect(() => {
    (async () => {
      const res = await userApi.profile(user.id);
      // const res = await dispatch(profileUser(user.id))
      let sorted = res.note.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

      setProfileInfo(res.user);

      setLimitedDataPrv(sorted.filter((e) => !Boolean(e.notePublic)).slice(0, maxRecordsToShow));
      setLimitedDataPbl(sorted.filter((e) => Boolean(e.notePublic)).slice(0, maxRecordsToShow));
    })();
    userApi.userOnline().then((res) => {
      const status = res.users.filter((user) => user.statesLogin === 1);
      setUserOnline(status);
    });
  }, []);
  ///search user

  useEffect(() => {
    userApi.getSearchUsers(searchUser).then((data) => {
      const newlistSearchUser = data.search_user.filter(
        (user) =>
          user.name.toLocaleLowerCase().includes(searchUser.toLocaleLowerCase()) ||
          user.gmail.toLocaleLowerCase().includes(searchUser.toLocaleLowerCase())
      );

      setListSearchUser(newlistSearchUser);
      console.log(listSearchUser);
    });
  }, [searchUser]);
  const handleShowMore = () => {
    const newRecordsToShow = maxRecordsToShow + 4;

    if (newRecordsToShow <= 50) {
      setMaxRecordsToShow(newRecordsToShow);
      setLimitedDataPbl(profile.slice(1, newRecordsToShow));
    }
  };

  return (
    <div className={`${classes.root} RootProfile`}>
      <div className={classNames()}>
        <div className='i' style={{ position: "relative" }}>
          <img
            className='avaProfle'
            style={{ width: "100%", marginLeft: "16px", height: "20rem" }}
            src={
              user.AvtProfile ||
              usergg.picture ||
              "https://quantrithcs.vinhphuc.edu.vn/UploadImages/thcstthoason/anh-phong-canh-dep-nhat-the-gioi.jpg"
            }
            alt='note'
          />
          <Box
            className='boxNav'
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "25%",
              position: "absolute",
              top: "10%",
              marginLeft: "20%",
            }}
          >
            <Box
              className='boxNav2'
              sx={{
                height: "65px",
                display: "flex",
                justifyContent: "space-around",
                padding: "20px 24px",
                backgroundColor: "rgba(255, 255, 255, 0.4)",

                gap: "30px",
                color: "#fff",

                alignItems: "center",
                borderRadius: "32px",
              }}
            >
              <Link to={"/"}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "22px",
                      fontWeight: "600",
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    SAMNOTES
                  </Typography>
                </Box>
              </Link>
              <Box
                className='BoxNav3'
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  gap: "90px",
                  width: "29rem",
                  fontSize: "1.2rem",
                  fontWeight: "400",
                  "& .MuiTypography-body1:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                <Typography variant='body1'>Help</Typography>
                <Typography variant='body1'>Home</Typography>
                <Typography variant='body1'>Contact Us</Typography>
                <Typography variant='body1'>Blog</Typography>
              </Box>
            </Box>

            <Box
              sx={{
                position: "relative",
                // top: "10px",
                width: "48px",
                height: "48px",
                position: "relative",
                cursor: "pointer",
              }}
              className='Message'
            >
              <img onClick={handle_message} src={messImg}></img>
              <div className='numberMessIcon'>1</div>
              <Message listUserOnline={userOnline} togle={togle_Message} />
            </Box>
          </Box>
        </div>

        <Box
          sx={{
            backgroundColor: "#fff",
            marginLeft: "16px",
            position: "relative",
            top: "-67px",
          }}
        >
          <Box
            className='gapProfile'
            sx={{
              display: "flex",
              gap: "30px",
              alignItems: "center",
              position: "relative",
              left: "13%",
              top: "-21px",
            }}
          >
            <img
              style={{ borderRadius: "50%", height: "111px", width: "111px" }}
              src={
                user.Avarta ||
                usergg.picture ||
                "https://i.pinimg.com/736x/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.jpg" ||
                profileInfo.Avarta
              }
            ></img>
            <Box>
              <Typography variant='h5' fontWeight={500}>
                {user.name || usergg.name}
              </Typography>
              <Typography className='none' variant='h6' fontWeight={400}>
                {usergg.email || profileInfo.createAccount}
              </Typography>
              {console.log(user)}
              <Typography variant='h6' fontWeight={400}>
                {user.gmail}
              </Typography>
            </Box>
            <Stack
              direction={"row"}
              alignItems={"center"}
              style={{
                paddingLeft: 70 + "px",
              }}
            >
              <input
                className='inputSearchName'
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder='Tìm kiếm tên/Email'
                style={{}}
              />
              <SearchIcon
                className='sicon'
                style={{
                  fontSize: 38 + "px",
                  color: "#1d1d1d",
                }}
              />
            </Stack>
          </Box>
          <div className='SearchName'>
            {listSearchUser.map((user) => {
              console.log(user);
              return (
                <div className='textSearch'>
                  <Link to={`/profile/${user.id}`}>
                    {" "}
                    <p style={{}}>{user.name || user.gmail}</p>{" "}
                  </Link>
                </div>
              );
            })}
          </div>
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: "repeat(1, 1fr)",
            }}
          >
            {toggleNote === true ? (
              <ListView
                limitedData={toggleData}
                data={toggleData}
                defaultSelect={selected}
                setArchivedData={setArchivedData}
                handleDelNote={handleDelNote}
                toolsNote={toolsNote}
                clear={() => setToggleNote(false)}
              />
            ) : (
              <>
                <Box
                  // className={toggleNote === true ? "box_note_hidden" : "box_note_diplay"}
                  className='NoteMoblie'
                  sx={{
                    width: "72%",
                    marginRight: "14%",
                    minHeight: "630px",
                    backgroundColor: "rgba(162, 221, 159, 1)",
                    backgroundImage:
                      "linear-gradient(90deg, rgba(162, 221, 159, 1), rgba(238, 146, 196, 1))",
                    borderRadius: "32px",
                    marginLeft: "14%",
                    padding: "57px 44px",
                  }}
                >
                  <Typography sx={{ color: "#fff", fontSize: "24px", fontWeight: "600" }}>
                    Latest PublicNote
                  </Typography>

                  <div
                    className='wrap-record'
                    style={{ height: maxRecordsToShow <= 50 ? "auto" : "477px" }}
                  >
                    {limitedDataPbl &&
                      limitedDataPbl.map((limitedData, index) => {
                        return (
                          <>
                            <div
                              style={{ cursor: "pointer", maxHeight: "150px" }}
                              className='record'
                              key={index}
                              onClick={() => {
                                handleNote(limitedData.idNote, limitedDataPbl);
                              }}
                            >
                              <p style={{ width: "50px" }} className='number'>
                                {index + 1}
                              </p>
                              <p className='title'>{limitedData.title} </p>

                              <ConvertTypeNoteToComponent note={limitedData} />

                              <p className='date-post'>{limitedData.createAt}</p>
                            </div>
                          </>
                        );
                      })}
                  </div>

                  {profile.length > maxRecordsToShow && (
                    <Button sx={{ marginLeft: "40%" }} variant='text' onClick={handleShowMore}>
                      View more
                    </Button>
                  )}
                </Box>
              </>
            )}
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default Profile;
