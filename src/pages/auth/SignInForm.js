import React, { useState } from "react";
import { Form, Alert, Button, Col, Row, Container, Image } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import api from "../../api/axiosDefaults";  


function SignInForm() {
  const setCurrentUser = useSetCurrentUser();
  const history = useHistory();
  const [signInData, setSignInData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const { data } = await api.post("/dj-rest-auth/login/", signInData);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
    } catch (err) {
      setErrors(err.response?.data || {});
      return;
    }

    try {
      const { data: userData } = await api.get("/dj-rest-auth/user/");
      setCurrentUser(userData);
    } catch {}

    history.push("/");
  };

  return (
    <Row className={styles.Row}>
      <Col md={6} className="my-auto p-0 p-md-2">
        <Container className={`${appStyles.Content} p-4 shadow-lg rounded`}>
          <h1 className={styles.Header}>sign in</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Control
                type="text"
                placeholder="username"
                name="username"
                value={signInData.username}
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
                placeholder="password"
                name="password"
                value={signInData.password}
                onChange={handleChange}
                className={styles.Input}
              />
            </Form.Group>
            {errors.password?.map((msg, idx) => (
              <Alert variant="warning" key={idx}>{msg}</Alert>
            ))}

            <Button className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`} type="submit">
              Sign in
            </Button>
            {errors.non_field_errors?.map((msg, idx) => (
              <Alert variant="warning" key={idx} className="mt-3">{msg}</Alert>
            ))}
          </Form>
        </Container>
        <Container className={`mt-3 ${appStyles.Content} shadow-lg rounded`}>
          <Link className={styles.Link} to="/signup">
            Don't have an account? <span>Sign up now!</span>
          </Link>
        </Container>
      </Col>
      <Col md={6} className={`d-none d-md-block p-2 ${styles.SignInCol}`}>
        <Image
          src="https://res.cloudinary.com/dhhna0y51/image/upload/v1748006933/lonysignin_nhzike.jpg"
          className={appStyles.FillerImage}
        />
      </Col>
    </Row>
  );
}

export default SignInForm;