import { Route, Redirect } from "react-router-dom";
import { useCurrentUser } from "./contexts/CurrentUserContext";

export default function PrivateRoute({ children, ...rest }) {
  const currentUser = useCurrentUser();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        currentUser ? (
          children
        ) : (
          <Redirect to={{ pathname: "/signin", state: { from: location } }} />
        )
      }
    />
  );
}
