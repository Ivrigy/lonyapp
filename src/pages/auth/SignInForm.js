import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Alert,
  Button,
  Col,
  Row,
  Container,
} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";

function SignInForm() {
  useRedirect("loggedIn");

  const setCurrentUser = useSetCurrentUser();
  const [signInData, setSignInData] = useState({ username: "", password: "" });
  const { username, password } = signInData;

  const [errors, setErrors] = useState({});
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      history.goBack();
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  const handleChange = (event) =>
    setSignInData({ ...signInData, [event.target.name]: event.target.value });

  return (
    <Row className={`${styles.Row} align-items-center`}>
      <Col md={6} className="my-auto p-0 p-md-2">
        <Container className={`${appStyles.Content} p-4 shadow-lg rounded`}>
          <h1 className={styles.Header}>WELCOME TO LONY</h1>
          <p className={styles.Subtitle}>
            The community platform for amazing single parents.
          </p>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleChange}
                className={styles.Input}
              />
            </Form.Group>
            {errors.username?.map((msg, idx) => (
              <Alert variant="warning" key={idx}>{msg}</Alert>
            ))}

            <Form.Group controlId="password">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleChange}
                className={styles.Input}
              />
            </Form.Group>
            {errors.password?.map((msg, idx) => (
              <Alert variant="warning" key={idx}>{msg}</Alert>
            ))}

            <Button
              type="submit"
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
            >
              Sign in
            </Button>

            {errors.non_field_errors?.map((msg, idx) => (
              <Alert variant="warning" className="mt-3" key={idx}>{msg}</Alert>
            ))}
          </Form>
        </Container>

        <Container className={`mt-3 ${appStyles.Content} shadow-lg rounded`}>
          <Link className={styles.Link} to="/signup">
            Don't have an account? <span>Sign up now!</span>
          </Link>
        </Container>
      </Col>

      <Col md={6} className="d-none d-md-flex align-items-center p-2">
        <div className={styles.Hero}>
          <img
            className={styles.HeroImg}
            src="https://res.cloudinary.com/dhhna0y51/image/upload/v1748006933/lonysignin_nhzike.jpg"
            alt="Welcome"
          />
        </div>
      </Col>
    </Row>
  );
}

export default SignInForm;
