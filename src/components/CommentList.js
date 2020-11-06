import React, { useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import CommentItem from "./CommentItem";

const CommentList = () => {
  const { comments, selectedVideo } = useContext(ApiContext);

  const listOfComments =
    selectedVideo &&
    comments.filter((fil) => {
      return selectedVideo.id === fil.post_connected;
    });
  const list =
    listOfComments &&
    listOfComments.map((comment) => (
      <CommentItem key={comment.id} comment={comment} />
    ));

  return (
    <div className="comment-list">
      <div className="task-list">{list}</div>
    </div>
  );
};

export default CommentList;
