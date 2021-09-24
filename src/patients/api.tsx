import { doc, getDoc } from "@firebase/firestore";
import { db } from "../firebase";
import { PatientType } from "../types";
import useSWR from "swr";

export function useGePatientById(officeId: string, patientId: string) {
  const { data: patient } = useSWR<PatientType>(
    `/offices/${officeId}/patients/${patientId}`,
    async () => {
      const docRef = doc(db, `/offices/${officeId}/patients`, patientId);
      const docSnap = await getDoc(docRef);
      return docSnap.data() as PatientType;
    }
  );
  return { patient };
}
