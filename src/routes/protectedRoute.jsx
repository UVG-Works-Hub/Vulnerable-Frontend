import { useUser } from "@clerk/clerk-react";
import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div>Cargando...</div>;
  }

  if (!isSignedIn) {
    return <Redirect to="/login" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
