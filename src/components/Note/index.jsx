import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Box,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { convertColor } from "../../constants";
import { Header } from "antd/es/layout/layout";
import noteApi from "../../api/noteApi";
import userApi from "../../api/userApi";
import ToolsNote from "../ToolsNote";
const Note = () => {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const { noteId } = useParams();

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const clipboard = (e) => {
    navigator.clipboard.writeText("http://samnotes.online/note/" + noteId);
    enqueueSnackbar("Copied to Clipboard", { variant: "success" });
    handleClose();
    console.log("Clipboard");
  };

  useEffect(() => {
    noteApi.getPublicNote(noteId).then((res) => {
      if (res.status == "200") {
        console.log(res.note);
        setData(res.note);
        const userId = res.note.idUser;
        console.log(userId);

        userApi
          .profile(userId)
          .then((response) => {
            const profileData = response.user;
            setProfile(profileData);
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }, []);

  console.log(profile);
  return (
    <>
      <Box>
        <div>
          <Link to='/'>
            <img src='./assets/logo_chua_tach_nen.png' alt='Cloudnote' />
            SAMNOTES
          </Link>
        </div>
      </Box>
      {data && data ? (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "70%",
            backgroundColor: convertColor(data.color),
            padding: "12px",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              fontSize: "20px",
              paddingBottom: "8px",
              borderBottom: "1px solid #000",
              marginBottom: "20px",
            }}
          >
            {data.title}
          </Box>
          {data.type !== "checklist" ? (
            <Box>{data.data}</Box>
          ) : (
            <Box>
              {data.data.map((item, index) => {
                <Box key={index}>
                  <Checkbox disabled checked={item.status} />
                  {item.content}
                </Box>;
              })}
            </Box>
          )}
          <ToolsNote
            type='Edit'
            options={""}
            handleChangeNote={""}
            handleOptionsNote={""}
            handleDelNote={""}
            handleNoteForm={""}
            dataItem={""}
          />
          {data.type === "image" && (
            <Box>
              <img src={data.metaData} alt='' style={{ width: "100%", objectFit: "contain" }} />
            </Box>
          )}

          <Button sx={{ marginTop: "30px" }} variant='contained' onClick={handleClickOpen}>
            Share
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Share</DialogTitle>
            <DialogContent>
              <TextField
                id='name'
                type='text'
                fullWidth
                variant='standard'
                disabled
                value={"http://samnotes.online/note/" + noteId}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={clipboard}> COPY URL</Button>
            </DialogActions>
          </Dialog>
          <Typography
            variant='subtitle1'
            sx={{
              position: "relative",
              top: "2%",
              left: "60%",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Created by: {profile && profile.name}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            height: "50%",
            padding: "12px",
            fontSize: "60px",
          }}
        >
          404
        </Box>
      )}
    </>
  );
};

export default Note;
