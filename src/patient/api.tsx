import { doc, getDoc, collection, getDocs } from "@firebase/firestore";
import { db } from "../firebase";
import useSWR from "swr";
import { useParams } from "react-router-dom";

import { PatientType } from "../types";

export function useGePatientById(officeId: string, patientId: string) {
  const { data: patient } = useSWR<PatientType>(`/offices/${officeId}/patients/${patientId}`, async () => {
    const docRef = doc(db, `/offices/${officeId}/patients`, patientId);
    const docSnap = await getDoc(docRef);
    return docSnap.data() as PatientType;
  });
  return { patient };
}

export function useGetPatients() {
  const { officeId } = useParams<{ officeId: string }>();
  const { data: patients } = useSWR<PatientType[]>(`/offices/${officeId}/patients`, async () => {
    console.log("start fetch patients");
    const docSnap = await getDocs(collection(db, `/offices/${officeId}/patients`));
    const data = docSnap.docs.map((d) => ({ id: d.id, ...d.data() } as PatientType));
    console.log("end fetch patients", data);
    return data;
  });
  return { patients };
}
