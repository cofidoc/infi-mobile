import { add, sub } from "date-fns";
import format from "../utils/format";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type DateSelectorProps = {
  date: Date;
  onChange: (date: Date) => void;
};

export function DateSelector({ date, onChange }: DateSelectorProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton onClick={() => onChange(sub(date, { days: 1 }))}>
        <ArrowBackIosIcon />
      </IconButton>

      <Typography sx={{ textAlign: "center" }} fontWeight="bold" fontSize={16}>
        {format(date, "eeee dd MMMM yyyy")}
      </Typography>

      <IconButton onClick={() => onChange(add(date, { days: 1 }))}>
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
}
