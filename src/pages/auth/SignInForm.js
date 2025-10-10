import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import { Link, useHistory, useLocation } from "react-router-dom";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";

function SignInForm() {
  useRedirect("loggedIn");

  const setCurrentUser = useSetCurrentUser();
  const history = useHistory();
  const location = useLocation();

  const [signInData, setSignInData] = useState({ username: "", password: "" });
  const { username, password } = signInData;
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      const dest = location.state?.from?.pathname || "/";
      history.replace(dest);
    } catch (err) {
      setErrors(err.response?.data || {});
    }
  };

  const handleChange = (e) =>
    setSignInData({ ...signInData, [e.target.name]: e.target.value });

  return (
    <Row className={styles.Row}>
      <Col md={6} className="my-auto p-0 p-md-2">
        <Container className={`${appStyles.Content} p-4 shadow-lg rounded`}>
          <h1 className={styles.Header}>welcome to LONY</h1>
          <p className={styles.Subtitle}>
            The community platform for amazing single parents.
          </p>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label className="d-none">Username</Form.Label>
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
              <Alert key={idx} variant="warning">{msg}</Alert>
            ))}

            <Form.Group controlId="password">
              <Form.Label className="d-none">Password</Form.Label>
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
              <Alert key={idx} variant="warning">{msg}</Alert>
            ))}

            <Button type="submit" className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}>
              Sign in
            </Button>

            {errors.non_field_errors?.map((msg, idx) => (
              <Alert className="mt-3" key={idx} variant="warning">{msg}</Alert>
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