import { IconButton } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

export function BackButton() {
  const history = useHistory();
  return (
    <IconButton color="primary" aria-label="back" size="large" onClick={() => history.goBack()}>
      <ArrowBack fontSize="large" />
    </IconButton>
  );
}
