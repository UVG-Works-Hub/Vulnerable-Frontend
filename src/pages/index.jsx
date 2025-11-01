import { Switch, Route, Redirect } from "react-router-dom";

import LogIn from "./LogIn";
import SignIn from "./SignIn";
import Welcome from "./Welcome";
import Mantenimiento from "./Mantenimiento";
import InterfazMedico from "./InterfazMedico";
import { ProtectedRoute } from "../routes/protectedRoute";

const navigate = (page) => {
  globalThis.location = `/?route=${page}`;
};

const Page = () => {
  // escoger la pagina

  return (
    <Switch>
      <Route path="/login">
        <LogIn />
      </Route>
      <Route path="/signin">
        <SignIn />
      </Route>
      <Route path="/interfazmedico">
        <ProtectedRoute>
          <InterfazMedico />
        </ProtectedRoute>
      </Route>
      <Route path="/mantenimiento">
        <ProtectedRoute>
          <Mantenimiento />
        </ProtectedRoute>
      </Route>
      <Route path="/welcome">
        <ProtectedRoute>
          <Welcome />
        </ProtectedRoute>
      </Route>
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
    </Switch>
  );
};

export { navigate };
export default Page;
