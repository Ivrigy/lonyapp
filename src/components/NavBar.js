import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../contexts/CurrentUserContext";

const NavBar = () => {
  const currentUser = useCurrentUser();

  const loggedInIcons = <> {currentUser?.username} </>;
  const loggedOutIcons = (
    <>
      <NavLink
        to="/signin"
        activeClassName={styles.Active}
        className={styles.NavLink}
      >
        <i className="bi bi-door-open"></i> Sign in
      </NavLink>
      <NavLink
        to="/signup"
        activeClassName={styles.Active}
        className={styles.NavLink}
      >
        <i className="bi bi-door-closed-fill"></i> Sign up
      </NavLink>
    </>
  );

  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container fluid className="px-3">
        <NavLink to="/">
          <Navbar.Brand className="ps-3">
            <img src={logo} alt="logo" height="35" />{" "}
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ps-3 pe-3 ms-md-auto text-start">
            <NavLink
              exact
              to="/"
              activeClassName={styles.Active}
              className="nav-link"
            >
              <i className="bi bi-house-door"></i> Home{" "}
            </NavLink>
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
