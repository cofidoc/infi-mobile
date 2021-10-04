import { Box, Typography, Chip, Button, Checkbox, Paper } from "@mui/material";
import { Header } from "../ui/Header";
import format from "../utils/format";
import { useState, useMemo } from "react";
import { useGetSeances } from "./api";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams, Link, useRouteMatch, Switch, Route } from "react-router-dom";
import { getFormattedSeances } from "./utils";
import { SeanceType } from "../types";

function BillingRoot({
  seances,
  seanceNotToBill,
  onSubmit,
}: {
  seances?: SeanceType[];
  seanceNotToBill: string[];
  onSubmit: (selected: string[]) => void;
}) {
  const seancesGroupByPatient = useMemo(() => getFormattedSeances(seances), [seances]);
  const { url } = useRouteMatch();
  const [selected, setSelected] = useState<string[]>([]);

  const handleClick = (spId: string) => {
    setSelected((spIds) => (spIds.includes(spId) ? spIds.filter((s) => s !== spId) : [...spIds, spId]));
  };

  return (
    <>
      <Header text="Envoi Facturation" />
      <Box px={2} sx={{ height: "calc(100% - 56px)" }}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "90%" }}>
          {seancesGroupByPatient?.map((sp) => (
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

              <Link to={`${url}/details/patients/${sp.id}`}>
                <Box sx={{ display: "flex" }}>
                  <Chip color="primary" label={sp.nbSeanceToBill} sx={{ mr: 1 }} />
                  <Chip color="secondary" label={sp.nbSeanceNotBill + seanceNotToBill?.length} />
                </Box>
              </Link>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "flex", height: "10%", alignItems: "center", justifyContent: "center" }}>
          <Button variant="contained" onClick={() => onSubmit(selected)}>
            Envoi pour facturation
          </Button>
        </Box>
      </Box>
    </>
  );
}

function BillingDetails({ seances, onNotBill }: { seances?: SeanceType[]; onNotBill: (id: string) => void }) {
  const { patientId } = useParams<{ patientId: string }>();
  const seancesByPatient = seances?.filter((s) => s.patient.id === patientId);

  return (
    <Box>
      <Header text="Détails des séances" />
      <Box p={1}>
        {seancesByPatient?.map((sp) => (
          <Paper key={sp.id} sx={{ px: 1, py: 1, mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography fontWeight="bold">{sp.acts?.map((a) => a.quotation.name).join(", ")}</Typography>
              <Typography color="secondary">{sp.price}€</Typography>
            </Box>

            <Typography>
              Fait par {sp.doneBy?.firstname} {sp.doneBy?.lastname}
            </Typography>
            {sp.doneAt && <Typography>Le {format(sp.doneAt, "EEEE dd MMMM yyyy à hh:mm")}</Typography>}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={() => onNotBill(sp.id)}>Ne Pas facturer</Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

export function Billing() {
  const { path } = useRouteMatch();
  const { officeId } = useParams<{ officeId: string }>();
  const { data: seances, mutate } = useGetSeances();
  const [seanceNotToBill, setSeanceNotToBill] = useState<string[]>([]);

  console.log({ seanceNotToBill });

  const sendToBilling = async (selected: string[]) => {
    try {
      const seancesToBill =
        seances
          ?.filter((s) => selected.includes(s.patient.id))
          ?.filter((s) => (seanceNotToBill.includes(s.id) ? false : true)) || [];

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
    <Switch>
      <Route path={path + "/details/patients/:patientId"}>
        <BillingDetails seances={seances} onNotBill={(id: string) => setSeanceNotToBill((ids) => [...ids, id])} />
      </Route>
      setSeanceNotToBill
      <Route path={path + "/"} exact>
        <BillingRoot seances={seances} seanceNotToBill={seanceNotToBill} onSubmit={sendToBilling} />
      </Route>
    </Switch>
  );
}
