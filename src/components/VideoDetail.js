import React, { useContext } from "react";
import { ApiContext } from "../context/ApiContext";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import ReactPlayer from "react-player";
import TextField from "@material-ui/core/TextField";
import { IoLogoYoutube } from "react-icons/io";
import Button from "@material-ui/core/Button";
import CommentList from "./CommentList.js";

const useStyles = makeStyles((theme) => ({
  title: {
    paddingLeft: theme.spacing(2),
  },
  delete: {
    margin: theme.spacing(2),
  },
  like: {
    paddingTop: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1),
    width: 50,
    heigh: 15,
  },
}));

const VideoDetail = () => {
  const classes = useStyles();
  const { selectedVideo, deleteVideo, setContent, newComment } = useContext(
    ApiContext
  );

  if (!selectedVideo)
    return (
      <div className="container">
        <button className="wait">
          <IoLogoYoutube />
        </button>
      </div>
    );
  return (
    <>
      <div className="wrapper">
        <ReactPlayer
          className="player"
          url={selectedVideo.video}
          width="100%"
          height="100%"
          playing
          controls
          speed
          volume
          disablePictureInPicture
          config={{
            file: {
              attributes: {
                controlsList: "nodownload",
                disablePictureInPicture: true,
              },
            },
          }}
        />
      </div>
      <Grid container alignItems="center">
        <Grid item xs={9}>
          <Typography className={classes.title} variant="h6">
            {selectedVideo.title}
          </Typography>
          <Typography>作成日: {selectedVideo.create_on}</Typography>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}>
          <Fab
            className={classes.delete}
            color="primary"
            aria-label="delete"
            onClick={() => deleteVideo()}
          >
            <DeleteIcon />
          </Fab>
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="text"
            placeholder="comment..."
            onChange={(event) => setContent(event.target.value)}
          />
          <Button
            onClick={() => newComment()}
            variant="contained"
            color="primary"
            className={classes.button}
          >
            送信
          </Button>
          <br />
          <CommentList />
        </Grid>
      </Grid>
    </>
  );
};

export default VideoDetail;
