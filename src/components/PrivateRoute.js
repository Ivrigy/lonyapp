import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useCurrentUser } from "../contexts/CurrentUserContext";

export default function PrivateRoute({ component: Component, render, ...rest }) {
  const currentUser = useCurrentUser();

  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser ? (
          Component ? <Component {...props} /> : render ? render(props) : null
        ) : (
          <Redirect
            to={{ pathname: "/signin", state: { from: props.location } }}
          />
        )
      }
    />
  );
}