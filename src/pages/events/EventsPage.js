import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import InfiniteScroll from "react-infinite-scroll-component";

import Event from "./Event";
import PopularProfiles from "../profiles/PopularProfiles";
import Asset from "../../components/Asset";

import { axiosReq } from "../../api/axiosDefaults";
import { fetchMoreData } from "../../utils/utils";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

import NoResults from "../../assets/no-results.png";
import appStyles from "../../App.module.css";
import styles from "../../styles/EventsPage.module.css";

function EventsPage({ message = "No results found.", filter = "" }) {
  const [events, setEvents] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const { pathname } = useLocation();
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axiosReq.get(`/events/?${filter}search=${query}`);
        setEvents(data);
        setHasLoaded(true);
      } catch {
        setHasLoaded(true);
        setEvents({ results: [] });
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(fetchEvents, 800);
    return () => clearTimeout(timer);
  }, [filter, query, pathname, currentUser]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <Form onSubmit={(e) => e.preventDefault()} className={styles.SearchBar}>
          <Form.Control
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events..."
          />
        </Form>

        {hasLoaded ? (
          events.results.length ? (
            <InfiniteScroll
              children={events.results.map((event) => (
                <Event key={event.id} {...event} setEvents={setEvents} />
              ))}
              dataLength={events.results.length}
              loader={<Asset spinner />}
              hasMore={!!events.next}
              next={() => fetchMoreData(events, setEvents)}
            />
          ) : (
            <Container className={appStyles.Content}>
              <Asset src={NoResults} message={message} />
            </Container>
          )
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>

      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default EventsPage;
