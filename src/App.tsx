import { Box } from "@mui/material";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthRoutes } from "./auth/Auth";
import { AuthProvider } from "./auth/authContext";
import { Home } from "./Home";
import { UpdateOffice } from "./office/UpdateOffice";
import { Patient } from "./patient/Patient";
import { CreatePatient } from "./patient/CreatePatient";
import { Patients } from "./patient/Patients";
import { Header } from "./ui/Header";
import { CreateCare } from "./care/CreateCare";
import { ShowCare } from "./care/ShowCare";
import { Rounds } from "./round/Rounds";
import { ErrorBoundary } from "./ui/ErrorBoundary";

function OfficeMembers() {
  return (
    <>
      <Header text="Utilisateurs" />
      <Box p={2}>Utilisateurs</Box>
    </>
  );
}

function Billing() {
  return (
    <>
      <Header text="Envoi Facturation" />
      <Box p={2}>Envoi Facturation</Box>
    </>
  );
}

function Transmissions() {
  return (
    <>
      <Header text="Transmissions" />
      <Box p={2}>Transmissions</Box>
    </>
  );
}

export default function App() {
  return (
    // <ErrorBoundary>
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

          <Route path="/offices/:officeId/patients/:patientId">
            <Patient />
          </Route>
          <Route path="/offices/:officeId/patients">
            <Patients />
          </Route>

          <Route path="/offices/:officeId" exact>
            <Home />
          </Route>
        </Switch>
        <AuthRoutes />
      </AuthProvider>
    </Router>
    // </ErrorBoundary>
  );
}
