import { Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { ListCares } from "../care/ListCares";
import { Header } from "../ui/Header";
import { UpdatePatient } from "./UpdatePatient";
import { useParams } from "react-router-dom";
import { useGePatientById } from "./api";

type Params = {
  officeId: string;
  patientId: string;
};

export function Patient() {
  const [value, setValue] = useState("care");
  const { officeId, patientId } = useParams<Params>();
  const { patient } = useGePatientById(officeId, patientId);

  return (
    <>
      <Header text={`${patient?.firstname} ${patient?.lastname}` || "Patient"} />
      <Box>
        <Tabs
          value={value}
          onChange={(_: any, v: string) => setValue(v)}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab value="care" label="Prescriptions" />
          <Tab value="infos" label="Infos" />
        </Tabs>
      </Box>
      {value === "care" && <ListCares />}
      {value === "infos" && <UpdatePatient />}
    </>
  );
}
