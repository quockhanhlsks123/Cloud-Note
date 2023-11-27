import { useState } from "react";
import { ListAltOutlined, TextSnippetOutlined, Photo } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import KeyIcon from "@mui/icons-material/Key";
import EditForm from "../EditForm";
import "./ListView.css";
import noteApi from "../../../api/noteApi";
import { enqueueSnackbar } from "notistack";

import { checkJWT } from "../../../constants";

import { useLocation } from "react-router-dom/dist";

function ListView({
  construct = "Grid",
  data,
  setArchivedData,
  handleDelNote,
  defaultSelect,
  toolsNote,
  toggleNote,
  limitedData,
  clear,
}) {
  const location = useLocation();
  const [selected, setSelected] = useState(defaultSelect || 0);
  const [selectedID, setSelectedID] = useState(0);
  const [dialog, setDialog] = useState(true);
  const [password, setPassword] = useState("");
  const [lockData, setLockData] = useState(new Array(data.length));

  const clearA = () => {
    if (location.pathname !== "/home/archived") clear();
    else {
      setSelected(null);
    }
  };
  // const a =data.map((item,index)=>(
  //   <div key={index}>
  //     {console.log(item)}
  //   </div>
  // ))
  const unlockNote = async () => {
    try {
      const lockNote = await noteApi.openNote(data[selected].idNote, { pass_lock: password });
      setLockData((prev) => {
        const newData = [...prev];
        newData[selected] = lockNote;
        return newData;
      });
      enqueueSnackbar("Unlock note succesfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return (
    <Box
      className='root'
      sx={{
        minWidth: "250px",
        width: "calc(40% - 250px)",
        height: "80vh",
        overflowY: "scroll",
      }}
    >
      <Box
        className='scroll'
        sx={{
          width: "100%",
          display: "flex",

          flexDirection: "column",
          gap: "8px",
          padding: "0 20px",
        }}
      >
        {toggleNote === true
          ? limitedData.map((item, index) => (
            <div key={index}>

              <Button
                sx={{
                  backgroundColor: `rgba(${item.color.r},${item.color.g},${item.color.b},${item.color.a})`,
                  color: "#000",
                  padding: "10px 16px",

                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "50px 1fr",
                  textAlign: "left",

                }}
                onClick={() => {
                  setSelected(item.idNote);

                  setDialog(true);
                  window.history.pushState({}, "", `/note/${item.idNote}`);
                }}

              >

                {item.type === "text" && (
                  <ListItemIcon>
                    <TextSnippetOutlined fontSize='small' />
                  </ListItemIcon>
                )}
                {item.type === "checklist" && (
                  <ListItemIcon>
                    <ListAltOutlined fontSize='small' />
                  </ListItemIcon>
                )}
                {item.type === "image" && (
                  <ListItemIcon className='none'>
                    <Photo fontSize='small' />
                  </ListItemIcon>
                )}
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "flex",
                    alignItems: "center",
                  }}
                  title={item.title}
                >
                  {item.lock && <KeyIcon style={{ color: "#33f" }} />}
                  {item.title.length === 0 ? "No title" : item.title}
                </span>
                {item.type === "image" && (
                  <img
                    src={item.metaData}
                    alt={item.title}
                    style={{ width: "100%", objectFit: "contain", gridColumn: "span 2" }}
                  />
                )}
              </Button>
            </div>
          ))
          : data.slice(0, 50).map((item, index) => (
            <div key={index}>


              <Button
                sx={{
                  backgroundColor: `rgba(${item.color.r},${item.color.g},${item.color.b},${item.color.a})`,
                  color: "#000",
                  padding: "10px 16px",
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "50px 1fr",
                  textAlign: "left",
                }}
                onClick={() => {
                  if (checkJWT()) {
                    return window.location.assign("/login");
                  }
                  // setSelected(item.idNote);
                  setSelected(index);

                  setDialog(true);
                  if (item.notePublic === 1) {
                    return window.history.pushState({}, "", `/note/${item.idNote}`);
                  }
                  window.history.pushState({}, "", "/home/archived");
                }}
              >

                {item.type === "text" && (
                  <ListItemIcon>
                    <TextSnippetOutlined fontSize='small' />
                  </ListItemIcon>
                )}
                {item.type === "checklist" && (
                  <ListItemIcon>
                    <ListAltOutlined fontSize='small' />
                  </ListItemIcon>
                )}
                {item.type === "image" && (
                  <ListItemIcon>
                    <Photo fontSize='small' />
                  </ListItemIcon>
                )}

                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "flex",
                    alignItems: "center",
                  }}
                  title={item.title}
                >
                  {item.lock && <KeyIcon style={{ color: "#33f" }} />}
                  {item.title.length === 0 ? "No title" : item.title}
                </span>
                {item.type === "image" && (
                  <img
                    src={item.metaData}
                    alt={item.title}
                    style={{ width: "100%", objectFit: "contain", gridColumn: "span 2" }}
                  />
                )}
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: "14px",
                    background: "rgba(255, 255, 255, 0.160784)",
                    borderRadius: "3px",
                    display: "inline-block",
                    color: "rgb(79 73 73 / 80%)",
                    padding: "5px 8px",
                    position: "relative",
                    width: "235px",
                    marginRight: "15px",
                  }}
                >
                  Update at:
                  <span>{" "}
                    {new Date().toLocaleDateString() ===new Date(item.updateAt).toLocaleDateString() ? (
                      new Date(item.updateAt).getHours() === new Date().getHours() ? (
                        new Date(item.updateAt).getMinutes() === new Date().getMinutes() ? (
                          "Just now"
                        ) : (
                          new Date(item.updateAt).getMinutes() + " minutes ago"
                        )
                      ) : (
                        new Date(item.updateAt).getHours() + " hours ago"
                      )
                    ) : new Date().getDate() - new Date(item.updateAt).getDate() === 1 ? (
                      "Yesterday"
                    ) : (
                      new Date(item.updateAt).toLocaleString()
                    )}</span>
                </div>
              </Button>
            </div>
          ))}
      </Box>

      {data[selected] &&
        (!data[selected].lock ? (
          <EditForm
            limitedData={limitedData}
            key={selected}
            dataItem={data[selected]}
            handleDelNote={handleDelNote}
            setArchivedData={setArchivedData}
            construct={construct}
            clear={clearA}
            toggleNote={toggleNote}
          />
        ) : (
          lockData[selected] && (
            <EditForm
              key={selected}
              datas={data}
              dataItem={lockData[selected].note}
              handleDelNote={handleDelNote}
              setArchivedData={setArchivedData}
              construct={construct}
              clear={clearA}
            />
          )
        ))}

      {data[selected] && data[selected].lock && !lockData[selected] && (
        <div>
          <Dialog open={dialog} onClose={() => setDialog(false)}>
            <DialogTitle>Unlock Note</DialogTitle>
            <DialogContent>
              <DialogContentText>What is your password?</DialogContentText>
              <TextField
                autoFocus
                margin='dense'
                id='name'
                label='Password'
                type='passowrd'
                fullWidth
                variant='standard'
                onChange={(e) => setPassword(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialog(false)}>Cancel</Button>
              <Button
                onClick={(e) => {
                  setDialog(false);
                  unlockNote();
                }}
              >
                Unlock
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </Box>
  );
}

export default ListView;
