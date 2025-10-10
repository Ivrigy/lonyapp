import React, { useEffect, useState } from "react";
import { Row, Col, Container, Button, Image, Tabs, Tab } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

import Asset from "../../components/Asset";
import NoResults from "../../assets/no-results.png";

import Post from "../posts/Post";
import Event from "../events/Event";

import { fetchMoreData } from "../../utils/utils";
import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import PopularProfiles from "./PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import { useProfileData, useSetProfileData } from "../../contexts/ProfileDataContext";
import { ProfileEditDropdown } from "../../components/MoreDropdown";

function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [activeKey, setActiveKey] = useState("posts");

  const [profilePosts, setProfilePosts] = useState({ results: [] });
  const [profileEvents, setProfileEvents] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const { id } = useParams();

  const { setProfileData, handleFollow, handleUnfollow } = useSetProfileData();
  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results || [];
  const is_owner = currentUser?.username === profile?.owner;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageProfileData }, { data: postsData }, { data: eventsData }] =
          await Promise.all([
            axiosReq.get(`/profiles/${id}/`),
            axiosReq.get(`/posts/?owner__profile=${id}`),
            axiosReq.get(`/events/?owner__profile=${id}`),
          ]);

        setProfileData((prev) => ({
          ...prev,
          pageProfile: { results: [pageProfileData] },
        }));
        setProfilePosts(postsData);
        setProfileEvents(eventsData);
        setHasLoaded(true);
      } catch {
        setHasLoaded(true);
      }
    };
    setHasLoaded(false);
    fetchData();
  }, [id, setProfileData]);

  const mainProfile = (
    <>
      {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
      <Row className="px-3 text-center g-0">
        <Col lg={3} className="text-lg-start">
          <Image className={styles.ProfileImage} roundedCircle src={profile?.image} />
        </Col>

        <Col lg={6}>
          <h3 className="m-2">{profile?.owner}</h3>
          <Row className="justify-content-center g-0">
            <Col xs={3} className="my-2">
              <div>{profile?.posts_count}</div>
              <div>posts</div>
            </Col>
            <Col xs={3} className="my-2">
              <div>{profile?.followers_count}</div>
              <div>followers</div>
            </Col>
            <Col xs={3} className="my-2">
              <div>{profile?.following_count}</div>
              <div>following</div>
            </Col>
            <Col xs={3} className="my-2">
              <div>{profile?.events_count}</div>
              <div>events</div>
            </Col>
          </Row>
        </Col>

        <Col lg={3} className="text-lg-end">
          {currentUser && !is_owner && (
            profile?.following_id ? (
              <Button
                className={`${btnStyles.Button} ${btnStyles.OutlineUnfollow} btn-sm`}
                onClick={() => handleUnfollow(profile)}
              >
                unfollow
              </Button>
            ) : (
              <Button
                className={`${btnStyles.Button} ${btnStyles.AccentFollow} btn-sm`}
                onClick={() => handleFollow(profile)}
              >
                follow
              </Button>
            )
          )}
        </Col>

        {profile?.content && <Col className="p-3">{profile.content}</Col>}
      </Row>
    </>
  );

  const postsTab = (
    <>
      {profilePosts.results.length ? (
        <InfiniteScroll
          children={profilePosts.results.map((post) => (
            <Post key={post.id} {...post} setPosts={setProfilePosts} />
          ))}
          dataLength={profilePosts.results.length}
          loader={<Asset spinner />}
          hasMore={!!profilePosts.next}
          next={() => fetchMoreData(profilePosts, setProfilePosts)}
        />
      ) : (
        <Asset
          src={NoResults}
          message={`No results found, ${profile?.owner} hasn't posted yet.`}
        />
      )}
    </>
  );

  const eventsTab = (
    <>
      {profileEvents.results.length ? (
        <InfiniteScroll
          children={profileEvents.results.map((event) => (
            <Event key={event.id} {...event} setEvents={setProfileEvents} />
          ))}
          dataLength={profileEvents.results.length}
          loader={<Asset spinner />}
          hasMore={!!profileEvents.next}
          next={() => fetchMoreData(profileEvents, setProfileEvents)}
        />
      ) : (
        <Asset
          src={NoResults}
          message={`No results found, ${profile?.owner} has no events yet.`}
        />
      )}
    </>
  );

  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <Container className={`${appStyles.Content} position-relative`}>
          {hasLoaded ? (
            <>
              {mainProfile}
              <hr />
              <Tabs
                id="profile-tabs"
                activeKey={activeKey}
                onSelect={(k) => setActiveKey(k)}
                className="mt-2"
              >
                <Tab eventKey="posts" title="Posts">
                  <div className="mt-3">{postsTab}</div>
                </Tab>
                <Tab eventKey="events" title="Events">
                  <div className="mt-3">{eventsTab}</div>
                </Tab>
              </Tabs>
            </>
          ) : (
            <Asset spinner />
          )}
        </Container>
      </Col>

      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default ProfilePage;
