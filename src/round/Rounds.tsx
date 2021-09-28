import { Box } from "@mui/material";
import { useMemo } from "react";
import { Header } from "../ui/Header";
import { DateSelector } from "./DateSelector";
import { useGetActsByDate } from "./api";
import { getRounds } from "./utils";
import { RoundItem } from "./RoundItem";

export function Rounds() {
  const { acts } = useGetActsByDate();
  const rounds = useMemo(() => getRounds(acts), [acts]);

  return (
    <>
      <Header text="Tournées" />
      <Box p={1}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <DateSelector />
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
