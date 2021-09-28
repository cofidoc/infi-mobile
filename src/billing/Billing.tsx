import { Box, Typography, Chip, Button, Checkbox } from "@mui/material";
import { Header } from "../ui/Header";
import { groupBy, min, max } from "lodash";
import { SeanceType } from "../types";
import format from "../utils/format";
import { useState } from "react";
import { useGetSeances } from "./api";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router";

function getFormattedSeances(seances?: SeanceType[]) {
  const patients = groupBy(seances, "patient.id");
  return Object.values(patients)?.map((seanceByPatient) => {
    const seance = seanceByPatient?.[0] || {};
    const minDate = min(seanceByPatient.map((s) => s.doneAt));
    const maxDate = max(seanceByPatient.map((s) => s.doneAt));
    return {
      ...seance.patient,
      nbSeanceToBill: seanceByPatient?.filter((a) => a.status === "to-bill")?.length,
      nbSeanceNotBill: seanceByPatient?.filter((a) => a.status === "not-bill-yet")?.length,
      minDate,
      maxDate,
    };
  });
}

export function Billing() {
  const { data: seances, mutate } = useGetSeances();
  const seancesByPatient = getFormattedSeances(seances);
  const { officeId } = useParams<{ officeId: string }>();
  console.log({ seances, seancesByPatient });

  const [selected, setSelected] = useState<string[]>([]);

  const handleClick = (spId: string) => {
    setSelected((spIds) => (spIds.includes(spId) ? spIds.filter((s) => s !== spId) : [...spIds, spId]));
  };

  const sendToBilling = async () => {
    try {
      const seancesToBill = seances?.filter((s) => selected.includes(s.patient.id)) || [];

      for (const seanceToBill of seancesToBill) {
        const ref = doc(db, `/offices/${officeId}/seances`, seanceToBill.id);
        await updateDoc(ref, { status: "sent-to-billing" });
        await mutate();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header text="Envoi Facturation" />
      <Box px={2} sx={{ height: "calc(100% - 56px)" }}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "90%" }}>
          {seancesByPatient?.map((sp) => (
            <Box key={sp.id} py={1} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }} onClick={() => handleClick(sp.id)}>
                <Checkbox checked={selected.includes(sp.id)} onChange={console.log} />
                <Box>
                  <Typography fontWeight="bold">{`${sp.firstname} ${sp.lastname}`}</Typography>
                  {sp.minDate && sp.maxDate && (
                    <Typography fontStyle="italic">{`${format(sp.minDate, "ddMMM")} - ${format(
                      sp.maxDate,
                      "ddMMM"
                    )}`}</Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: "flex" }}>
                <Chip color="primary" label={sp.nbSeanceToBill} sx={{ mr: 1 }} />
                <Chip color="secondary" label={sp.nbSeanceNotBill} />
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "flex", height: "10%", alignItems: "center", justifyContent: "center" }}>
          <Button variant="contained" onClick={sendToBilling}>
            Envoi pour facturation
          </Button>
        </Box>
      </Box>
    </>
  );
}
