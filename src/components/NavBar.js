
import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";

function NavBar() {
  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container fluid className="px-3">
        <NavLink to="/">
          <Navbar.Brand className="ps-3">
            <img src={logo} alt="logo" height="35" />
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto text-start">
            <NavLink
              exact
              to="/"
              className={styles.NavLink}
              activeClassName={styles.Active}
            >
              <i className="bi bi-house-door"></i> Home
            </NavLink>
            <NavLink
              to="/signin"
              className={styles.NavLink}
              activeClassName={styles.Active}
            >
              <i className="bi bi-door-open"></i> Sign in
            </NavLink>
            <NavLink
              to="/signup"
              className={styles.NavLink}
              activeClassName={styles.Active}
            >
              <i className="bi bi-door-closed-fill"></i> Sign up
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
