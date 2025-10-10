import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Asset from "../../components/Asset";
import { axiosReq } from "../../api/axiosDefaults";
import Event from "./Event";
import Comment from "../comments/Comment";
import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

export default function EventPage() {
  const { id } = useParams();
  const history = useHistory();
  const currentUser = useCurrentUser();

  const [event, setEvent] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [comments, setComments] = useState({ results: [] });
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axiosReq.get(`/events/${id}/`);
        setEvent(data);
        setHasLoaded(true);
      } catch {
        history.push("/events");
      }
    };
    setHasLoaded(false);
    fetchEvent();
  }, [id, history]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const { data } = await axiosReq.get(`/comments/?event=${id}`);
        setComments(data);
      } catch {
        setComments({ results: [] });
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [id]);

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

      {currentUser && (
        <CommentCreateForm
          event={Number(id)}
          setEvent={setEvent}
          setComments={setComments}
          profileImage={currentUser.profile_image}
          profile_id={currentUser.profile_id}
        />
      )}

      {loadingComments ? (
        <Asset spinner />
      ) : (
        comments.results.map((c) => (
          <Comment
            key={c.id}
            {...c}
            setComments={setComments}
            setEvent={setEvent}
          />
        ))
      )}
    </Container>
  );
}
