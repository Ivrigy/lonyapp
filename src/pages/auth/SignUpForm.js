import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Image,
  Col,
  Row,
  Container,
  Alert,
} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { useRedirect } from "../../hooks/useRedirect";

const SignUpForm = () => {
  useRedirect("loggedIn");

  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
  });
  const { username, password1, password2 } = signUpData;

  const [errors, setErrors] = useState({});
  const history = useHistory();

  const handleChange = (e) =>
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/dj-rest-auth/registration/", signUpData);
      history.push("/signin");
    } catch (err) {
      setErrors(err.response?.data || {});
    }
  };

  return (
    <Row className={`${styles.Row} align-items-center`}>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className={`${appStyles.Content} p-4 shadow-lg rounded`}>
          <h1 className={styles.Header}>CREATE NEW ACCOUNT</h1>
          <p className={styles.Subtitle}>
            The community platform for amazing single parents.
          </p>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Control
                className={styles.Input}
                type="text"
                placeholder="username"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.username?.map((msg, idx) => (
              <Alert variant="warning" key={idx}>{msg}</Alert>
            ))}

            <Form.Group controlId="password1">
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="password"
                name="password1"
                value={password1}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password1?.map((msg, idx) => (
              <Alert variant="warning" key={idx}>{msg}</Alert>
            ))}

            <Form.Group controlId="password2">
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="confirm password"
                name="password2"
                value={password2}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password2?.map((msg, idx) => (
              <Alert variant="warning" key={idx}>{msg}</Alert>
            ))}

            <Button
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
              type="submit"
            >
              Sign up
            </Button>

            {errors.non_field_errors?.map((msg, idx) => (
              <Alert variant="warning" className="mt-3" key={idx}>{msg}</Alert>
            ))}
          </Form>
        </Container>

        <Container className={`mt-3 ${appStyles.Content} shadow-lg rounded`}>
          <Link className={styles.Link} to="/signin">
            Already have an account? <span>Sign in</span>
          </Link>
        </Container>
      </Col>

      <Col md={6} className="d-none d-md-flex align-items-center p-2">
        <div className={styles.Hero}>
          <Image
            className={styles.HeroImg}
            src="https://res.cloudinary.com/dhhna0y51/image/upload/v1747916199/lonysignup_bdnwa5.jpg"
            alt="Join"
          />
        </div>
      </Col>
    </Row>
  );
};

export default SignUpForm;
