import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [Comments,setComments ] =useState(comments)
  const [commentwriting, setcommentwriting] = useState('');

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };



  const addComment = async() => {
    console.log(loggedInUserId.picturePath);
    const comment = {
      "userId": `${loggedInUserId._id}`,
      "username" : `${loggedInUserId.firstName} ${loggedInUserId.lastName}`,
      "postid": `${postId}`,
      "comment": `${commentwriting}`,
      "profile": `${loggedInUserId.picturePath}`
    }
    const updatedPost = await fetch(`http://localhost:3001/posts/comment/post` ,
     {method:"PUT" , 
     headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
     body:JSON.stringify(comment)});

    setComments(Comments.concat(comment));
    dispatch(setPost({ post: updatedPost }));

  }


  const handleComment = () => {
    addComment();
  }

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{Comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          <Divider />
          <input type="text" placeholder="Add Comments" 
          style={{width: "85%",outline: "none", borderRadius: "0.5rem" , padding: "5px",marginTop: "10px" ,color: main}}
          onChange={(e) => setcommentwriting(e.target.value)}
          />
          <button style={{width: "15%",padding: "5px",borderRadius: "0.5rem", cursor: "pointer"}} onClick={handleComment}>post</button>
          {Comments.map((item, i) => (
            <Box key={`${item.username}-${i}`}>
              <div style={{ alignItems: "center" ,marginTop : "10px"}}>
                <div style={{display:"flex" , alignItems:"center"}}> 

                <img style={{width : "2rem",height: "2rem",borderRadius:"50%"}} src={item.profile ? `http://localhost:3001/assets/${item.profile}` : `https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`} className="PostImage" alt="" />

                  <p style={{ marginLeft: "6px" , fontSize:15, marginTop:6 ,color: main}}>{item.username}</p>
                </div>
                <p style={{ marginLeft: "55px" , textAlign:'start' , marginTop:-14 ,color: main}}>{item.comment}</p>
              </div>


{/* 
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment.comment}
              </Typography> */}
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
