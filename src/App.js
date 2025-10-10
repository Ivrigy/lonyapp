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
          {/* 🔒 Protected: Home feed */}
          <PrivateRoute exact path="/">
            <PostsPage message="No results found. Adjust the search keyword." />
          </PrivateRoute>

          {/* 🔒 Protected: personalized feeds */}
          <PrivateRoute exact path="/feed">
            <PostsPage
              message="No results found. Adjust the search keyword or follow a user."
              filter={`owner__followed__owner__profile=${profile_id}&`}
            />
          </PrivateRoute>

          <PrivateRoute exact path="/liked">
            <PostsPage
              message="No results found. Adjust the search keyword or like a post."
              filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
            />
          </PrivateRoute>

          {/* Public auth routes */}
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />

          {/* 🔒 Protected: create/edit */}
          <PrivateRoute exact path="/posts/create">
            <PostCreateForm />
          </PrivateRoute>
          <PrivateRoute exact path="/posts/:id/edit">
            <PostEditForm />
          </PrivateRoute>
          <PrivateRoute exact path="/events/create">
            <EventCreateForm />
          </PrivateRoute>
          <PrivateRoute exact path="/events/:id/edit">
            <EventEditForm />
          </PrivateRoute>

          {/* Public: view content */}
          <Route exact path="/posts/:id" render={() => <PostPage />} />
          <Route exact path="/events" render={() => (
            <EventsPage message="No events found. Adjust the search keyword." />
          )} />
          <Route exact path="/events/:id" render={() => <EventPage />} />

          {/* Public: profiles (view) */}
          <Route exact path="/profiles/:id" render={() => <ProfilePage />} />

          {/* 🔒 Protected: profile settings */}
          <PrivateRoute exact path="/profiles/:id/edit/username">
            <UsernameForm />
          </PrivateRoute>
          <PrivateRoute exact path="/profiles/:id/edit/password">
            <UserPasswordForm />
          </PrivateRoute>
          <PrivateRoute exact path="/profiles/:id/edit">
            <ProfileEditForm />
          </PrivateRoute>

          {/* 404 */}
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
