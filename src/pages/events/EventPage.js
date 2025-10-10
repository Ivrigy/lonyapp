import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Asset from "../../components/Asset";
import { axiosReq } from "../../api/axiosDefaults";
import Event from "./Event";

export default function EventPage() {
  const { id } = useParams();
  const history = useHistory();
  const [event, setEvent] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axiosReq.get(`/events/${id}/`);
        setEvent(data);
        setHasLoaded(true);
      } catch (err) {
        // Not found or auth issue → go back to the list
        history.push("/events");
      }
    };
    setHasLoaded(false);
    fetchEvent();
  }, [id, history]);

  if (!hasLoaded) {
    return (
      <Container className="p-3">
        <Asset spinner />
      </Container>
    );
  }

  return (
    <Container className="p-0 p-md-2">
      <Event {...event} setEvents={setEvent} eventPage />
    </Container>
  );
}
