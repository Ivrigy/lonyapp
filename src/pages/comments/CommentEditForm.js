import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { axiosRes } from "../../api/axiosDefaults";
import styles from "../../styles/CommentCreateEditForm.module.css";

function CommentEditForm({ id, content, setShowEditForm, setComments }) {
  const [formContent, setFormContent] = useState(content);

  const handleChange = (event) => {
    setFormContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/comments/${id}/`, {
        content: formContent.trim(),
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) =>
          comment.id === id
            ? {
                ...comment,
                content: formContent.trim(),
                updated_at: "now",
              }
            : comment
        ),
      }));
      setShowEditForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Stack gap={2}>
        <Form.Group>
          <Form.Control
            className={styles.Form}
            as="textarea"
            value={formContent}
            onChange={handleChange}
            rows={2}
          />
        </Form.Group>
        <div className="text-end">
          <button
            type="button"
            className={`${styles.Button} me-2`}
            onClick={() => setShowEditForm(false)}
          >
            cancel
          </button>
          <button
            type="submit"
            className={styles.Button}
            disabled={!formContent.trim()}
          >
            save
          </button>
        </div>
      </Stack>
    </Form>
  );
}

export default CommentEditForm;
