import { ReactNode, useState } from "react";
import { IconButton, SwipeableDrawer } from "@material-ui/core";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, Typography } from "@mui/material";
import { Link, LinkProps, useRouteMatch, useParams, useHistory } from "react-router-dom";
import { signOut } from "@firebase/auth";
import { auth } from "../firebase";
import { useGetOfficeById } from "../office/api";
import { useAuth } from "../auth/authContext";
import { capitalize } from "lodash";

export function Home() {
  const [open, setOpen] = useState(false);
  const { officeId } = useParams<{ officeId: string }>();
  const { office } = useGetOfficeById(officeId);
  const { user } = useAuth();
  const history = useHistory();

  return (
    <div>
      <IconButton aria-label="open drawer" size="large" onClick={() => setOpen((o) => !o)}>
        <MenuIcon fontSize="large" />
      </IconButton>

      <SwipeableDrawer anchor="left" open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
        <Box
          sx={{
            width: "200px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <LinkNavBar to="/office">Cabinet</LinkNavBar>
          <LinkNavBar to="/office-members">Utilisateur</LinkNavBar>

          <Box p={2} mt={5}>
            <Button
              onClick={async () => {
                try {
                  await signOut(auth);
                  history.push("/login");
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              Deconnexion
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>

      <Box
        sx={{
          display: "flex",
          height: "80vh",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography px={2} textAlign="center" fontWeight="bold" fontSize={22} component="h1">
            {capitalize(office?.name)}
          </Typography>
          <Typography px={2} textAlign="center" fontSize={16} component="h2">
            {office?.address} <br /> {office?.zipCode} {office?.city}
          </Typography>

          <Typography p={2} textAlign="center" sx={{ fontWeight: "bold" }}>
            {`Bienvenue ${capitalize(user?.firstname)} ${capitalize(user?.lastname)}`}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mx: 2,
            }}
          >
            <Tile to="/patients" text="Patients" bg="#118ab2" />
            <Tile to="/rounds" text="Tournées" bg="#ef476f" />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
              width: "100%",
              mx: 2,
            }}
          >
            <Tile to="/billings" text="Envoi Facturaction" bg="#fcbe2f" />
            <Tile to="/transmissions" text="Mes Transmissions" bg="#073b4c" />
          </Box>
        </Box>
      </Box>
    </div>
  );
}

function LinkNavBar({ to, children }: { to: LinkProps["to"]; children: ReactNode }) {
  const { url } = useRouteMatch();
  return (
    <Box p={2} sx={{ borderBottom: 1 }}>
      <Link to={url + to}>{children}</Link>
    </Box>
  );
}

function Tile({ to, text, bg }: any) {
  const { url } = useRouteMatch();
  return (
    <Link
      to={url + to}
      style={{
        display: "flex",
        width: "140px",
        margin: "0 10px",
        textDecoration: "none",
      }}
    >
      <Box
        sx={{
          background: bg,
          width: "100%",
          height: 110,
          borderRadius: 5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow:
            "rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px",
        }}
      >
        <Typography color="white" px={2} textAlign="center" sx={{ fontWeight: "bold" }}>
          {text}
        </Typography>
      </Box>
    </Link>
  );
}
