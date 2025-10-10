import React, { useRef } from "react";
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
  const busy = useRef(false);

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

  const bump = (delta, newLikeId) => {
    if (eventPage) {
      setEvents?.((prev) => ({
        ...prev,
        likes_count: Math.max(0, (prev?.likes_count ?? 0) + delta),
        like_id: newLikeId ?? prev?.like_id ?? null,
      }));
    } else {
      setEvents?.((prev) => ({
        ...prev,
        results: prev.results.map((e) =>
          e.id === id
            ? {
                ...e,
                likes_count: Math.max(0, e.likes_count + delta),
                like_id: newLikeId ?? e.like_id ?? null,
              }
            : e
        ),
      }));
    }
  };

  const handleLike = async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      const { data } = await axiosRes.post(
        "/likes/",
        { event: id },
        { headers: { "Content-Type": "application/json" } }
      );
      bump(+1, data.id);
    } catch (err) {
      if (err.response?.status === 400) {
        try {
          const { data } = await axiosRes.get("/likes/", {
            params: { event: id },
          });
          const mine = data.results?.find(
            (l) => l.owner === currentUser?.username
          );
          if (mine?.id) bump(0, mine.id);
        } catch {}
      }
    }
    busy.current = false;
  };

  const handleUnlike = async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      let toDelete = like_id;
      if (!toDelete) {
        const { data } = await axiosRes.get("/likes/", {
          params: { event: id },
        });
        const mine = data.results?.find(
          (l) => l.owner === currentUser?.username
        );
        toDelete = mine?.id;
        if (!toDelete) {
          busy.current = false;
          return;
        }
      }
      await axiosRes.delete(`/likes/${toDelete}/`);
      bump(-1, null);
    } catch {}
    busy.current = false;
  };

  return (
    <Card className={styles.Event}>
      <Card.Body>
        <Stack
          direction="horizontal"
          className="align-items-center justify-content-between"
          gap={2}
        >
          <Link
            to={`/profiles/${profile_id}`}
            className="d-flex align-items-center text-decoration-none"
          >
            <Avatar src={profile_image} height={55} />
            <span className="ms-2">{owner}</span>
          </Link>
          <div className="d-flex align-items-center">
            <span className={styles.Muted}>{updated_at}</span>
            {is_owner && eventPage && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </Stack>
      </Card.Body>

      {image && (
        <Link to={`/events/${id}`}>
          <Card.Img
            src={image}
            alt={title}
            className={eventPage ? styles.EventImageLarge : styles.EventImage}
          />
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
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own event!</Tooltip>}
            >
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
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like events!</Tooltip>}
            >
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
