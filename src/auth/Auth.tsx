import { Switch, Route } from "react-router-dom";
import { CreateOffice } from "../office/CreateOffice";
import { Login } from "./Login";
import { ResetPassword } from "./ResetPassword";
import { SignUp } from "./SignUp";

export function AuthRoutes() {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/sign-up">
        <SignUp />
      </Route>
      <Route path="/reset-password">
        <ResetPassword />
      </Route>
      <Route path="/create-office">
        <CreateOffice />
      </Route>
    </Switch>
  );
}
