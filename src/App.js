import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";

import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";

import PostCreateForm from "./pages/posts/PostCreateForm";
import PostEditForm from "./pages/posts/PostEditForm";
import PostPage from "./pages/posts/PostPage";
import PostsPage from "./pages/posts/PostsPage";

import { useCurrentUser } from "./contexts/CurrentUserContext";
import ProfilePage from "./pages/profiles/ProfilePage";

import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";

import EventsPage from "./pages/events/EventsPage";
import EventCreateForm from "./pages/events/EventCreateForm";
import EventEditForm from "./pages/events/EventEditForm";
import EventPage from "./pages/events/EventPage";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          {/* public */}
          <Route
            exact
            path="/"
            render={() => (
              <PostsPage message="No results found. Adjust the search keyword." />
            )}
          />
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route exact path="/posts/:id" render={() => <PostPage />} />
          <Route
            exact
            path="/events"
            render={() => (
              <EventsPage message="No events found. Adjust the search keyword." />
            )}
          />
          <Route exact path="/events/:id" render={() => <EventPage />} />
          <Route exact path="/profiles/:id" render={() => <ProfilePage />} />

          {/* protected */}
          <PrivateRoute
            exact
            path="/feed"
            render={() => (
              <PostsPage
                message="No results found. Adjust the search keyword or follow a user."
                filter={`owner__followed__owner__profile=${profile_id}&`}
              />
            )}
          />
          <PrivateRoute
            exact
            path="/liked"
            render={() => (
              <PostsPage
                message="No results found. Adjust the search keyword or like a post."
                filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
              />
            )}
          />
          <PrivateRoute exact path="/posts/create" render={() => <PostCreateForm />} />
          <PrivateRoute exact path="/posts/:id/edit" render={() => <PostEditForm />} />

          <PrivateRoute exact path="/events/create" render={() => <EventCreateForm />} />
          <PrivateRoute exact path="/events/:id/edit" render={() => <EventEditForm />} />

          <PrivateRoute
            exact
            path="/profiles/:id/edit/username"
            render={() => <UsernameForm />}
          />
          <PrivateRoute
            exact
            path="/profiles/:id/edit/password"
            render={() => <UserPasswordForm />}
          />
          <PrivateRoute
            exact
            path="/profiles/:id/edit"
            render={() => <ProfileEditForm />}
          />

          {/* 404 */}
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
