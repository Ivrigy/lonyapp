import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import { axiosRes } from "../../api/axiosDefaults";
import styles from "../../styles/CommentCreateEditForm.module.css";
import btnStyles from "../../styles/Button.module.css";

function CommentEditForm({ id, content, setShowEditForm, setComments }) {
  const [formContent, setFormContent] = useState(content);

  const handleChange = (e) => setFormContent(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosRes.put(`/comments/${id}/`, { content: formContent.trim() });
      setComments((prev) => ({
        ...prev,
        results: prev.results.map((c) =>
          c.id === id ? { ...c, content: formContent.trim(), updated_at: "now" } : c
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
          <Button
            type="button"
            className={`${btnStyles.Button} ${btnStyles.OutlineUnfollow} me-2`}
            onClick={() => setShowEditForm(false)}
          >
            cancel
          </Button>
          <Button
            type="submit"
            className={`${btnStyles.Button} ${btnStyles.AccentFollow}`}
            disabled={!formContent.trim()}
          >
            save
          </Button>
        </div>
      </Stack>
    </Form>
  );
}

export default CommentEditForm;
