import React, { useState } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

import styles from "../../styles/CommentCreateEditForm.module.css";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";

function CommentCreateForm({ post, setPost, setComments, profileImage, profile_id }) {
  const [content, setContent] = useState("");

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosRes.post("/comments/", { content, post });
      setComments(prev => ({
        ...prev,
        results: [data, ...prev.results],
      }));
      setPost(prev => ({
        results: [
          {
            ...prev.results[0],
            comments_count: prev.results[0].comments_count + 1,
          },
        ],
      }));
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
          className={styles.Button}
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
