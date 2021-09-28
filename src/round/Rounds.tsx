import { Box } from "@mui/material";
import { useMemo } from "react";
import { Header } from "../ui/Header";
import { DateSelector } from "./DateSelector";
import { useGetActsByDate } from "./api";
import { getRounds } from "./utils";
import { RoundItem } from "./RoundItem";
import { useLocation } from "react-router-dom";
import { parse } from "date-fns";

function useGetDateQueryParams() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const date = searchParams.get("date") ? parse(searchParams.get("date") || "", "dd-MM-yyyy", new Date()) : new Date();
  return date;
}

export function Rounds() {
  const date = useGetDateQueryParams();
  const { acts } = useGetActsByDate(date);
  const rounds = useMemo(() => getRounds(acts), [acts]);

  return (
    <>
      <Header text="Tournées" />
      <Box p={1}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <DateSelector date={date} />
        </Box>

        <Box mt={2}>
          {rounds?.map((round) => (
            <RoundItem key={round.id} round={round} />
          ))}
        </Box>
      </Box>
    </>
  );
}
