import { Component, ReactNode } from "react";
import { Box, Button, Typography } from "@mui/material";
// import { firebase } from "../firebase";

function ErrorFallBack() {
  return (
    <Box width="100vw" height="100vh" justifyContent="center" alignItems="center" flexDirection="column">
      <Box
        sx={{
          borderRadius: "50%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white.main",
          width: "30vh",
          height: "30vh",
        }}
      >
        <img src="/img/failure.svg" alt="failure" style={{ width: "10vh", height: "10vh" }} />
      </Box>
      <Box p={1} />
      <Typography fontSize="3em">Oups!</Typography>
      <Box p={1} />
      <Typography>Il semblerait qu'il y ait une erreur</Typography>
      <Box p={2} />
      <Box>
        <Button onClick={() => window?.location?.replace("/")}>Retour</Button>
      </Box>
    </Box>
  );
}

export class ErrorBoundary extends Component<{ fallback?: ReactNode }> {
  state = { error: false };

  componentDidCatch(error: any, info: any) {
    console.error(error, info);
    //  firebase.analytics().logEvent("error_boundary_admin", { description: JSON.stringify(error) });
    this.setState({ error: info.componentStack });
  }

  render() {
    if (this.state.error) return this.props.fallback || <ErrorFallBack />;
    return this.props.children;
  }
}
