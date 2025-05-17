// import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../assets/logo.png";

const NavBar = () => {
    return (
    <Navbar expand="md" fixed="top">
      <Container fluid className="px-3">
        <Navbar.Brand className="ps-3"> <img src={logo} alt="logo" height="35" /> </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ps-3 pe-3 ms-md-auto text-start">
            <Nav.Link>
                <i class="bi bi-house"></i>{' '}
                Home
                </Nav.Link>
            <Nav.Link>
                <i class="bi bi-box-arrow-in-right"></i>{' '}
                Sign in
                </Nav.Link>
            <Nav.Link>
                <i class="bi bi-door-open"></i>{' '}
                Sign up
                </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
