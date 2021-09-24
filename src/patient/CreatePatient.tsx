import { Header } from "../ui/Header";
import { Box } from "@mui/material";
import { addDoc, collection } from "@firebase/firestore";
import { useParams, useHistory } from "react-router";
import { db } from "../firebase";
import { FormPatient } from "./FormPatient";

export function CreatePatient() {
  const { officeId } = useParams<{ officeId: string }>();
  const history = useHistory();

  return (
    <>
      <Header text="Créer un patient" />
      <Box p={1}>
        <FormPatient
          labelSubmit="Créer un patient"
          initialValues={{}}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await addDoc(
                collection(db, `offices/${officeId}/patients`),
                values
              );
              history.goBack();
            } catch (err) {
              console.error(err);
            } finally {
              setSubmitting(false);
            }
          }}
        />
      </Box>
    </>
  );
}
