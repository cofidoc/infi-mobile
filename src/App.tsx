import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { AuthRoutes } from "./auth/Auth";
import { AuthProvider } from "./auth/authContext";
import { Home } from "./home/Home";
import { UpdateOffice } from "./office/UpdateOffice";
import { Patient } from "./patient/Patient";
import { CreatePatient } from "./patient/CreatePatient";
import { Patients } from "./patient/Patients";
import { CreateCare } from "./care/CreateCare";
import { ShowCare } from "./care/ShowCare";
import { Rounds } from "./round/Rounds";
import { ErrorBoundary } from "./ui/ErrorBoundary";
import { Billing } from "./billing/Billing";
import { Transmissions } from "./transmission/Transmissions";
import { OfficeMembers } from "./office-member/OfficeMembers";
import { CreateOneCare } from "./care/CreateOneCare";
import { SWRConfig } from "swr";

export function App() {
  return (
    <SWRConfig value={{ refreshInterval: 1000 * 10, revalidateOnFocus: false }}>
      <ErrorBoundary>
        <Router>
          <AuthProvider>
            <Switch>
              <Route path="/offices/:officeId/office-members">
                <OfficeMembers />
              </Route>
              <Route path="/offices/:officeId/office">
                <UpdateOffice />
              </Route>
              <Route path="/offices/:officeId/rounds">
                <Rounds />
              </Route>
              <Route path="/offices/:officeId/transmissions">
                <Transmissions />
              </Route>
              <Route path="/offices/:officeId/billings">
                <Billing />
              </Route>
              <Route path="/offices/:officeId/patients/create">
                <CreatePatient />
              </Route>
              <Route path="/offices/:officeId/patients/:patientId/ordonnances/:ordonnanceId/show">
                <ShowCare />
              </Route>
              <Route path="/offices/:officeId/patients/:patientId/ordonnances/create">
                <CreateCare />
              </Route>
              <Route path="/offices/:officeId/patients/:patientId/ordonnances/create-one">
                <CreateOneCare />
              </Route>
              <Route path="/offices/:officeId/patients/:patientId">
                <Patient />
              </Route>
              <Route path="/offices/:officeId/patients">
                <Patients />
              </Route>
              <Route path="/offices/:officeId" exact>
                <Home />
              </Route>
              <Route path="/" exact>
                <Redirect to="/login" />
              </Route>
            </Switch>
            <AuthRoutes />
          </AuthProvider>
        </Router>
      </ErrorBoundary>
    </SWRConfig>
  );
}
