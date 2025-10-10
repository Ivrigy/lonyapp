import React from "react";
import { Card, Stack, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import styles from "../../styles/Event.module.css";

const Event = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    updated_at,
    title,
    description,
    location,
    event_date,
    image,
    comments_count,
    likes_count,
    like_id,
    setEvents,
    eventPage,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const formattedDateTime = event_date
    ? new Date(event_date).toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const handleEdit = () => history.push(`/events/${id}/edit`);

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/events/${id}/`);
      history.goBack();
    } catch {}
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post(`/likes/`, { event: id });
      setEvents?.((prev) => ({
        ...prev,
        results: prev.results.map((e) =>
          e.id === id ? { ...e, likes_count: e.likes_count + 1, like_id: data.id } : e
        ),
      }));
    } catch {}
  };

  // ✅ delete at /likes/<like_id>/
  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setEvents?.((prev) => ({
        ...prev,
        results: prev.results.map((e) =>
          e.id === id ? { ...e, likes_count: e.likes_count - 1, like_id: null } : e
        ),
      }));
    } catch {}
  };

  return (
    <Card className={styles.Event}>
      <Card.Body>
        <Stack direction="horizontal" className="align-items-center justify-content-between" gap={2}>
          <Link to={`/profiles/${profile_id}`} className="d-flex align-items-center text-decoration-none">
            <Avatar src={profile_image} height={55} />
            <span className="ms-2">{owner}</span>
          </Link>
          <div className="d-flex align-items-center">
            <span className={styles.Muted}>{updated_at}</span>
            {is_owner && eventPage && (
              <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete} />
            )}
          </div>
        </Stack>
      </Card.Body>

      {image && (
        <Link to={`/events/${id}`}>
          <Card.Img src={image} alt={title} />
        </Link>
      )}

      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}

        <div className={styles.MetaRow}>
          <i className={`bi bi-calendar-event ${styles.IconOrange}`} />
          <span className="ms-2">{formattedDateTime}</span>
        </div>

        {location && (
          <div className={styles.MetaRow}>
            <i className={`bi bi-geo-alt ${styles.IconOrange}`} />
            <span className="ms-2">{location}</span>
          </div>
        )}

        {description && <Card.Text className="mt-2">{description}</Card.Text>}

        <div className={styles.EventBar}>
          {is_owner ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>You can't like your own event!</Tooltip>}>
              <i className="bi bi-suit-heart" />
            </OverlayTrigger>
          ) : like_id ? (
            <span onClick={handleUnlike} role="button" aria-label="unlike">
              <i className="bi bi-suit-heart-fill" />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike} role="button" aria-label="like">
              <i className="bi bi-suit-heart" />
            </span>
          ) : (
            <OverlayTrigger placement="top" overlay={<Tooltip>Log in to like events!</Tooltip>}>
              <i className="bi bi-suit-heart" />
            </OverlayTrigger>
          )}
          <span className="ms-1">{likes_count}</span>

          <Link to={`/events/${id}`} className="ms-3">
            <i className="bi bi-chat" />
          </Link>
          <span className="ms-1">{comments_count}</span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Event;
