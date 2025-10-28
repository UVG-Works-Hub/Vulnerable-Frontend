import React from 'react';
import { SignIn, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import localization from "../../locales/es.json";

const LogIn = () => {
  const { user, isSignedIn } = useUser();
  const history = useHistory();

  useEffect(() => {
    if (isSignedIn && user) {
      const userRole = user.publicMetadata?.role;

      if (userRole === "admin") {
        history.push("/mantenimiento");
      } else {
        history.push("/interfazmedico");
      }
    }
  }, [isSignedIn, user, history]);

  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "shadow-lg border rounded-lg p-6",
        },
      }}
      localization={{
        signIn: {
          start: {
            title: localization.signIn.title,
            subtitle: localization.signIn.subtitle,
          },
        },
        formFieldLabel__emailAddress: localization.signIn.emailAddress,
        formFieldLabel__password: localization.signIn.password,
        formButtonPrimary: localization.signIn.continueButton,
      }}
    />
  );
};

export default LogIn;
