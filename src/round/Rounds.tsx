import { Box } from "@mui/material";
import { useState, useMemo } from "react";
import { Header } from "../ui/Header";
import { DateSelector } from "./DateSelector";
import { useGetActsByDate } from "./api";
import { getRounds } from "./utils";
import { RoundItem } from "./RoundItem";

export function Rounds() {
  const [date, setDate] = useState(new Date());
  const { acts } = useGetActsByDate(date);
  const rounds = useMemo(() => getRounds(acts), [acts]);

  console.log({ acts });

  return (
    <>
      <Header text="Tournées" />
      <Box p={1}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <DateSelector date={date} onChange={setDate} />
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
