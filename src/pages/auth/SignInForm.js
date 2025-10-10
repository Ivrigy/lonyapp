// src/pages/auth/SignInForm.js
import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import { Link, useHistory } from "react-router-dom";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";

function SignInForm() {
  useRedirect("loggedIn");

  const setCurrentUser = useSetCurrentUser();
  const history = useHistory();

  const [signInData, setSignInData] = useState({ username: "", password: "" });
  const { username, password } = signInData;
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      history.push("/");
      window.scrollTo(0, 0);
    } catch (err) {
      setErrors(err.response?.data || { detail: ["Unable to sign in"] });
    }
  };

  const handleChange = (event) =>
    setSignInData({ ...signInData, [event.target.name]: event.target.value });

  return (
    <Row className={styles.Row}>
      <Col md={6} className="my-auto p-0 p-md-2">
        <Container className={`${appStyles.Content} p-4 shadow-lg rounded`}>
          <div className="text-center mb-4">
            <h2 className={styles.Header}>Welcome to LONY</h2>
            <p className={styles.Subtitle}>
              The community platform for amazing single parents.
            </p>
          </div>

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group controlId="username" className="mb-3">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleChange}
                autoComplete="username"
                className={styles.Input}
              />
            </Form.Group>
            {errors.username?.map((msg, idx) => (
              <Alert variant="warning" key={`u-${idx}`}>
                {msg}
              </Alert>
            ))}

            <Form.Group controlId="password" className="mb-3">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleChange}
                autoComplete="current-password"
                className={styles.Input}
              />
            </Form.Group>
            {errors.password?.map((msg, idx) => (
              <Alert variant="warning" key={`p-${idx}`}>
                {msg}
              </Alert>
            ))}

            {errors.non_field_errors?.map((msg, idx) => (
              <Alert variant="warning" className="mt-2" key={`nf-${idx}`}>
                {msg}
              </Alert>
            ))}

            <Button
              type="submit"
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright} w-100 mt-2`}
            >
              Sign in
            </Button>
          </Form>
        </Container>

        <Container className={`mt-3 ${appStyles.Content} shadow-lg rounded`}>
          <Link className={styles.Link} to="/signup">
            Don&apos;t have an account? <span>Sign up now!</span>
          </Link>
        </Container>
      </Col>

      <Col md={6} className={`d-none d-md-block p-2 ${styles.SignInCol}`}>
        <div className={styles.Hero}>
          <Image
            alt="Smiling child with a thumbs-up and a speech bubble"
            src="https://res.cloudinary.com/dhhna0y51/image/upload/v1748006933/lonysignin_nhzike.jpg"
            className={styles.HeroImg}
            loading="eager"
          />
        </div>
      </Col>
    </Row>
  );
}

export default SignInForm;
