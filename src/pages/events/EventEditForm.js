import React, { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { Form, Button, Row, Col, Container, Alert, Image } from "react-bootstrap";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import styles from "../../styles/EventCreateEditForm.module.css";

export default function EventEditForm() {
  const { id } = useParams();
  const history = useHistory();
  const imageInput = useRef(null);

  const [errors, setErrors] = useState({});
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    event_date: "",
    image: "",
  });
  const { title, description, location, event_date, image } = eventData;

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosReq.get(`/events/${id}/`);
        setEventData({
          title: data.title || "",
          description: data.description || "",
          location: data.location || "",
          // convert ISO -> yyyy-MM-ddTHH:mm for input[type=datetime-local]
          event_date: data.event_date ? new Date(data.event_date).toISOString().slice(0,16) : "",
          image: data.image || "",
        });
      } catch {
        history.push("/events");
      }
    };
    load();
  }, [id, history]);

  const handleChange = (e) => {
    setEventData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleChangeImage = (e) => {
    if (e.target.files.length) {
      if (image) URL.revokeObjectURL(image);
      setEventData((p) => ({ ...p, image: URL.createObjectURL(e.target.files[0]) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title || "");
    formData.append("description", description || "");
    formData.append("location", location || "");
    if (!event_date) {
      setErrors({ event_date: ["Please pick a date & time"] });
      return;
    }
    formData.append("event_date", new Date(event_date).toISOString());
    if (imageInput.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      await axiosReq.put(`/events/${id}/`, formData);
      history.push(`/events/${id}`);
    } catch (err) {
      if (err.response?.status !== 401) {
        setErrors(err.response?.data || { detail: ["Something went wrong"] });
      }
    }
  };

  const right = (
    <div className="text-center">
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control name="title" value={title} onChange={handleChange} />
      </Form.Group>
      {errors?.title?.map((m, i) => <Alert key={i} variant="warning">{m}</Alert>)}

      <Form.Group className="mb-3">
        <Form.Label>Date &amp; time</Form.Label>
        <Form.Control
          type="datetime-local"
          name="event_date"
          value={event_date}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.event_date?.map((m, i) => <Alert key={i} variant="warning">{m}</Alert>)}

      <Form.Group className="mb-3">
        <Form.Label>Location</Form.Label>
        <Form.Control name="location" value={location} onChange={handleChange} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={6} name="description" value={description} onChange={handleChange} />
      </Form.Group>

      <div className={styles.ButtonAddPost}>
        <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="button" onClick={() => history.goBack()}>
          cancel
        </Button>
        <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
          save
        </Button>
      </div>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}>
            <Form.Group className="text-center">
              {image ? (
                <>
                  <figure>
                    <Image className={appStyles.Image} src={image} rounded />
                  </figure>
                  <div>
                    <Form.Label className={`${btnStyles.Button} ${btnStyles.Blue} btn`} htmlFor="image-upload">
                      Change the image
                    </Form.Label>
                  </div>
                </>
              ) : (
                <div className="mb-2">No image yet</div>
              )}
              <Form.Control
                id="image-upload"
                type="file"
                accept="image/*"
                ref={imageInput}
                onChange={handleChangeImage}
              />
            </Form.Group>
            {errors?.image?.map((m, i) => <Alert key={i} variant="warning">{m}</Alert>)}
            <div className="d-md-none">{right}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{right}</Container>
        </Col>
      </Row>
    </Form>
  );
}
