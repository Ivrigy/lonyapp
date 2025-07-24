import React from "react";
import { Link } from "react-router-dom";
import { Card, Stack, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";
import styles from "../../styles/Post.module.css";
import { axiosRes } from "../../api/axiosDefaults";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const Post = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    likes_count,
    like_id,
    title,
    content,
    image,
    updated_at,
    postPage,
    setPosts,
    handleEdit,
    handleDelete,
  } = props;

  // figure out the real image URL
  let finalImageSrc = null;
  if (image) {
    finalImageSrc = image.startsWith("http")
      ? image
      : `${BACKEND}${image}`;
  }

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { post: id });
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : post;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };
  
  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count - 1, like_id: null }
            : post;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card className={styles.Post}>
      <Card.Body>
        <Stack
          direction="horizontal"
          className="align-items-center justify-content-between"
        >
          <Link
            to={`/profiles/${profile_id}`}
            className="d-flex align-items-center text-decoration-none"
          >
            <Avatar src={profile_image} height={55} />
            <span className="ms-2">{owner}</span>
          </Link>

          <div className="d-flex align-items-center">
            <small className="text-muted">{updated_at}</small>
            {is_owner && postPage && (
              <>
                <span
                  onClick={handleEdit}
                  className="ms-3 text-primary"
                  style={{ cursor: "pointer" }}
                >
                  Edit
                </span>
                <span
                  onClick={handleDelete}
                  className="ms-3 text-danger"
                  style={{ cursor: "pointer" }}
                >
                  Delete
                </span>
              </>
            )}
          </div>
        </Stack>
      </Card.Body>

      {finalImageSrc && (
        <Link to={`/posts/${id}`}>
          <Card.Img src={finalImageSrc} alt={title} />
        </Link>
      )}

      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        {content && <Card.Text>{content}</Card.Text>}

        <div className={styles.PostBar}>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own post!</Tooltip>}
            >
              <i className="bi bi-suit-heart" />
            </OverlayTrigger>
          ) : like_id ? (
            <span  onClick={handleUnlike}>
              <i className="bi bi-suit-heart-fill" />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike}>
              <i className="bi bi-suit-heart" />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like posts!</Tooltip>}
            >
              <i className="bi bi-suit-heart" />
            </OverlayTrigger>
          )}
          <span className="ms-1">{likes_count}</span>

          <Link to={`/posts/${id}`} className="ms-3">
            <i className="bi bi-chat" />
          </Link>
          <span className="ms-1">{comments_count}</span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Post;