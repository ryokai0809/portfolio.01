import React from "react";
import Typography from "@material-ui/core/Typography";

const CommentItem = ({ comment }) => {
  return (
    <div>
      <h5>{comment.author}</h5>
      <Typography variant="h5"> {comment.content} </Typography>
      <h5> {comment.date_posted}</h5>
      <hr />
    </div>
  );
};

export default CommentItem;
