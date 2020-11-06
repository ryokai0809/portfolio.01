import React, { createContext, useState, useEffect } from "react";
import { withCookies } from "react-cookie";
import axios from "axios";
export const ApiContext = createContext();

const ApiContextProvider = (props) => {
  const token = props.cookies.get("current-token");
  const [profile, setProfile] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [editedProfile, setEditedProfile] = useState({ id: "", nickName: "" });
  const [askList, setAskList] = useState([]);
  const [askListFull, setAskListFull] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [cover, setCover] = useState([]);
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const getMyProfile = async () => {
      try {
        const resmy = await axios.get(
          "http://localhost:8000/api/user/myprofile/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const res = await axios.get(
          "http://localhost:8000/api/user/approval/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        resmy.data[0] && setProfile(resmy.data[0]);
        resmy.data[0] &&
          setEditedProfile({
            id: resmy.data[0].id,
            nickName: resmy.data[0].nickName,
          });
        resmy.data[0] &&
          setAskList(
            res.data.filter((ask) => {
              return resmy.data[0].proUser === ask.askTo;
            })
          );
        setAskListFull(res.data);
      } catch {
        console.log("error");
      }
    };

    const getProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/user/profile/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setProfiles(res.data);
      } catch {
        console.log("error");
      }
    };
    const getInbox = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/dm/inbox/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setInbox(res.data);
      } catch {
        console.log("error");
      }
    };

    const getVideos = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/post/video/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        setVideos(res.data);
      } catch {
        console.log("error");
      }
    };

    const getAllComment = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/post/comment/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        setComments(res.data);
      } catch {
        console.log("error");
      }
    };

    getVideos();
    getMyProfile();
    getProfile();
    getInbox();
    getAllComment();
  }, [token, profile.id]);

  const newComment = async () => {
    const uploadComment = new FormData();
    uploadComment.append("content", content);
    uploadComment.append("author", profile.nickName);
    uploadComment.append("post_connected", selectedVideo.id);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/post/comment/",
        uploadComment,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      uploadComment.append("user", res.data.id);
      setComments([...comments, res.data]);
      setContent("");
      alert("You just created comment!");
    } catch {
      console.log("new Comment is not working");
    }
  };

  const newVideo = async () => {
    const uploadVideo = new FormData();
    uploadVideo.append("title", title);
    uploadVideo.append("video", video, video.name);
    uploadVideo.append("thumbnail", thumbnail, thumbnail.name);
    uploadVideo.append("uploader", profile.nickName);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/post/video/",
        uploadVideo,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      uploadVideo.append("user", res.data.id);
      setVideos([...videos, res.data]);
      setModalIsOpen(false);
      setTitle("");
      setVideo(null);
      setThumbnail(null);
    } catch {
      console.log("newVide is not wroking");
    }
  };

  const deleteVideo = async () => {
    try {
      let num = selectedVideo.user - 1;
      if (profile.id === num) {
        await axios.delete(
          `http://127.0.0.1:8000/api/post/video/${selectedVideo.id}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );
        setSelectedVideo(null);
        setVideos(videos.filter((item) => item.id !== selectedVideo.id));
      } else {
        alert("You have no authority to delete this video");
      }
    } catch {
      console.log("error");
    }
  };

  const createProfile = async () => {
    const createData = new FormData();
    createData.append("nickName", editedProfile.nickName);
    cover.name && createData.append("proImg", cover, cover.name);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/user/profile/",
        createData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      setProfile(res.data);
      setEditedProfile({ id: res.data.id, nickName: res.data.nickName });
    } catch {
      console.log("error");
    }
  };

  const deleteProfile = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/user/profile/${profile.id}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      setProfiles(profiles.filter((dev) => dev.id !== profile.id));
      setProfile([]);
      setEditedProfile({ id: "", nickName: "" });
      setCover([]);
      setAskList([]);
    } catch {
      console.log("error");
    }
  };

  const editProfile = async () => {
    const editData = new FormData();
    editData.append("nickName", editedProfile.nickName);
    cover.name && editData.append("proImg", cover, cover.name);
    console.log(cover.name);
    try {
      const res = await axios.put(
        `http://localhost:8000/api/user/profile/${profile.id}/`,
        editData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      setProfile(res.data);
    } catch {
      console.log("error");
    }
  };

  const newRequestFriend = async (askData) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/user/approval/`,
        askData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      setAskListFull([...askListFull, res.data]);
    } catch {
      console.log("error");
    }
  };

  const sendDMCont = async (uploadDM) => {
    try {
      await axios.post(`http://localhost:8000/api/dm/message/`, uploadDM, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
    } catch {
      console.log("error");
    }
  };

  const changeApprovalRequest = async (uploadDataAsk, ask) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/user/approval/${ask.id}/`,
        uploadDataAsk,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      setAskList(askList.map((item) => (item.id === ask.id ? res.data : item)));

      const newDataAsk = new FormData();
      newDataAsk.append("askTo", ask.askFrom);
      newDataAsk.append("approved", true);

      const newDataAskPut = new FormData();
      newDataAskPut.append("askTo", ask.askFrom);
      newDataAskPut.append("askFrom", ask.askTo);
      newDataAskPut.append("approved", true);

      const resp = askListFull.filter((item) => {
        return item.askFrom === profile.proUser && item.askTo === ask.askFrom;
      });

      !resp[0]
        ? await axios.post(
            `http://localhost:8000/api/user/approval/`,
            newDataAsk,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
              },
            }
          )
        : await axios.put(
            `http://localhost:8000/api/user/approval/${resp[0].id}/`,
            newDataAskPut,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
              },
            }
          );
    } catch {
      console.log("error");
    }
  };

  return (
    <ApiContext.Provider
      value={{
        profile,
        profiles,
        cover,
        setCover,
        askList,
        askListFull,
        inbox,
        newRequestFriend,
        createProfile,
        editProfile,
        deleteProfile,
        changeApprovalRequest,
        sendDMCont,
        editedProfile,
        setEditedProfile,
        video,
        setVideo,
        title,
        setTitle,
        videos,
        setVideos,
        thumbnail,
        setThumbnail,
        modalIsOpen,
        setModalIsOpen,
        newVideo,
        deleteVideo,
        newComment,
        comments,
        setComments,
        setContent,
        content,
        setSelectedVideo,
        selectedVideo,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

export default withCookies(ApiContextProvider);
