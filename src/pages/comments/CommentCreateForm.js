import React, { useState } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import styles from "../../styles/CommentCreateEditForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";

function CommentCreateForm({
  post,
  event,
  setPost,
  setEvent,
  setComments,
  profileImage,
  profile_id,
}) {
  const [content, setContent] = useState("");

  const handleChange = (e) => setContent(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { content: content.trim() };
      if (post) payload.post = post;
      if (event) payload.event = event;

      const { data } = await axiosRes.post("/comments/", payload);

      setComments((prev) => ({ ...prev, results: [data, ...prev.results] }));

      if (setPost) {
        setPost((prev) => ({
          results: [
            {
              ...prev.results[0],
              comments_count: prev.results[0].comments_count + 1,
            },
          ],
        }));
      }

      if (setEvent) {
        setEvent((prev) => ({
          ...prev,
          comments_count: (prev?.comments_count || 0) + 1,
        }));
      }

      setContent("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
      <Form.Group>
        <InputGroup>
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profileImage} />
          </Link>
          <Form.Control
            className={styles.Form}
            as="textarea"
            rows={2}
            placeholder="my comment..."
            value={content}
            onChange={handleChange}
          />
        </InputGroup>
      </Form.Group>
      <div className="d-flex justify-content-end mt-2">
        <Button
          className={`${btnStyles.Button} ${btnStyles.AccentFollow}`}
          disabled={!content.trim()}
          type="submit"
        >
          post
        </Button>
      </div>
    </Form>
  );
}

export default CommentCreateForm;
