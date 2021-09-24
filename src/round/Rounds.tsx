import { Box } from "@mui/material";
import { useState } from "react";
import { Header } from "../ui/Header";
import { DateSelector } from "./DateSelector";

export function Rounds() {
  const [date, setDate] = useState(new Date());

  return (
    <>
      <Header text="Tournées" />
      <Box p={1} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <DateSelector date={date} onChange={setDate} />
      </Box>
    </>
  );
}
