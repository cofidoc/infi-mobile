import { Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { ListCares } from "../care/ListCares";
import { Header } from "../ui/Header";
import { UpdatePatient } from "./UpdatePatient";

export function Patient() {
  const [value, setValue] = useState("care");

  return (
    <>
      <Header text="Patient" />
      <Box>
        <Tabs
          value={value}
          onChange={(_: any, v: string) => setValue(v)}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab value="care" label="Soins" />
          <Tab value="infos" label="Infos" />
        </Tabs>
      </Box>
      {value === "care" && <ListCares />}
      {value === "infos" && <UpdatePatient />}
    </>
  );
}
