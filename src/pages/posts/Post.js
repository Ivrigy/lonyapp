import React from "react";
import { Link } from "react-router-dom";
import { Card, Stack, OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";

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
  } = props;

  let finalImageSrc = null;
  if (image) {
    if (image.startsWith("http")) {
      finalImageSrc = image;
    } else {
      finalImageSrc = `${BACKEND}${image}`;
    }
  }

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

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
            {is_owner && postPage && <span className="ms-2">…</span>}
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
            <span onClick={() => { /* unlike */ }}>
              <i className="bi bi-suit-heart-fill" />
            </span>
          ) : currentUser ? (
            <span onClick={() => { /* like */ }}>
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