import { groupBy, min, max } from "lodash";
import { SeanceType } from "../types";

export function getFormattedSeances(seances?: SeanceType[]) {
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
