import { add, sub } from "date-fns";
import format from "../utils/format";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";

type DateSelectorProps = {
  date: Date;
};

export function DateSelector({ date }: DateSelectorProps) {
  const start = format(sub(date, { days: 1 }), "dd-MM-yyyy");
  const end = format(add(date, { days: 1 }), "dd-MM-yyyy");

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton component={Link} replace to={{ search: `date=${start}` }}>
        <ArrowBackIosIcon />
      </IconButton>
      <Typography sx={{ textAlign: "center" }} fontWeight="bold" fontSize={16}>
        {format(date, "eeee dd MMMM yyyy")}
      </Typography>
      <IconButton component={Link} replace to={{ search: `date=${end}` }}>
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
}
