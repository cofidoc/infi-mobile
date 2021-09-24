import { addDoc, collection } from "@firebase/firestore";
import { useParams, useHistory } from "react-router";
import { db } from "../firebase";
import { FormPatient } from "./FormPatient";
import { Loader } from "../ui/Loader";
import { useGePatientById } from "./api";

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
