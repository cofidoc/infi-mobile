import { Box } from "@mui/material";
import { Link, LinkProps, useRouteMatch } from "react-router-dom";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

export function AddLink({ to, ...props }: LinkProps) {
  const { url } = useRouteMatch();
  return (
    <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}>
      <Link to={url + to} {...props}>
        <Fab color="primary" aria-label="add patient">
          <AddIcon />
        </Fab>
      </Link>
    </Box>
  );
}
