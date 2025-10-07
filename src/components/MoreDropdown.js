import React from "react";
import { Dropdown } from "react-bootstrap";
import { useHistory } from "react-router";
import styles from "../styles/MoreDropdown.module.css";

const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <i
    className="bi bi-three-dots-vertical"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

export const MoreDropdown = ({ handleEdit, handleDelete }) => (
  <Dropdown className="ms-auto" drop="start">
    <Dropdown.Toggle as={ThreeDots} />
    <Dropdown.Menu className="text-center" popperConfig={{ strategy: "fixed" }}>
      <Dropdown.Item
        className={styles.DropdownItem}
        onClick={handleEdit}
        aria-label="edit"
      >
        <i className="bi bi-pencil-square" />
      </Dropdown.Item>
      <Dropdown.Item
        className={styles.DropdownItem}
        onClick={handleDelete}
        aria-label="delete"
      >
        <i className="bi bi-trash" />
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

export const ProfileEditDropdown = ({ id }) => {
  const history = useHistory();

  return (
    <Dropdown className={`ms-auto px-3 ${styles.Absolute}`} drop="start">
      <Dropdown.Toggle as={ThreeDots} />
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit`)}
          aria-label="edit-profile"
        >
          <i className="bi bi-pencil-square" /> edit profile
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/username`)}
          aria-label="edit-username"
        >
          <i className="bi bi-person-badge" /> change username
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/password`)}
          aria-label="edit-password"
        >
          <i className="bi bi-key" /> change password
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
