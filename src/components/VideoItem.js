import React, { useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";

const useStyles = makeStyles((theme) => ({
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 2,
  },
  cardcont: {
    padding: theme.spacing(1),
    height: "50px",
  },
}));

const VideoItem = ({ video }) => {
  const classes = useStyles();
  const { setSelectedVideo } = useContext(ApiContext);

  return (
    <Card className={classes.card} onClick={() => setSelectedVideo(video)}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="thumbnail"
          height="200"
          image={video.thumbnail}
        />
        <CardContent className={classes.cardcont}>
          <h4 className="video-title">{video.title}</h4>
          <dev className="video-items-detail">
            <dev className="video-item"> {video.uploader}</dev>
          </dev>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default VideoItem;
