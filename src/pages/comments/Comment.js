import React from "react";
import { Link } from "react-router-dom";
import Stack from "react-bootstrap/Stack";
import Avatar from "../../components/Avatar";
import { MoreDropdown } from "../../components/MoreDropdown";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";
import styles from "../../styles/Comment.module.css";

const Comment = ({
  profile_id,
  profile_image,
  owner,
  updated_at,
  content,
  id,
  setPost,
  setComments,
}) => {
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`);
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count - 1,
          },
        ],
      }));
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mb-3">
      <hr />
      <Stack direction="horizontal" gap={2}>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>

        <Stack gap={1} className="flex-grow-1">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <span className={`${styles.Owner} me-2`}>{owner}</span>
              <small className={styles.Date}>{updated_at}</small>
            </div>
            {is_owner && (
              <MoreDropdown
                handleEdit={() => {}}
                handleDelete={handleDelete}
              />
            )}
          </div>
          <p className="mb-0">{content}</p>
        </Stack>
      </Stack>
    </div>
  );
};

export default Comment;
