import { addDoc, collection, doc, getDoc } from "@firebase/firestore";
import { useParams, useHistory } from "react-router";
import { db } from "../firebase";
import { PatientType } from "../types";
import useSWR from "swr";
import { FormPatient } from "./FormPatient";
import { Loader } from "../ui/Loader";

type Params = {
  officeId: string;
  patientId: string;
};

export function UpdatePatient() {
  const { officeId, patientId } = useParams<Params>();
  const { patient } = useGePatientById(officeId, patientId);
  const history = useHistory();

  if (!patient) return <Loader />;

  return (
    <FormPatient
      labelSubmit="Modifier le patient"
      initialValues={patient}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await addDoc(collection(db, `offices/${officeId}/patients`), values);
          history.goBack();
        } catch (err) {
          console.error(err);
        } finally {
          setSubmitting(false);
        }
      }}
    />
  );
}

function useGePatientById(officeId: string, patientId: string) {
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
