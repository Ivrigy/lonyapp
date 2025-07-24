import React from 'react';
import { Dropdown } from 'react-bootstrap';
import styles from '../styles/MoreDropdown.module.css';

const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <i
    className="bi bi-three-dots-vertical"
    ref={ref}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

export const MoreDropdown = ({ handleEdit, handleDelete }) => (
  <Dropdown className="ms-auto" drop="start">
    <Dropdown.Toggle as={ThreeDots} />

    <Dropdown.Menu className="text-center" popperConfig={{ strategy: 'fixed' }}>
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
