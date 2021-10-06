import { Box } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import { CareType } from "../types";
import { Header } from "../ui/Header";
import { FormCare } from "./FormCare";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { omit } from "lodash";

export function CreateCare() {
  const history = useHistory();
  const { officeId, patientId } = useParams<{ officeId: string; patientId: string }>();

  return (
    <>
      <Header text="Création d'une prescription médicale" />
      <Box p={1}>
        <FormCare
          labelSubmit="Créer la prescription médicale"
          initialValues={{
            cares: [{ everyNDays: 1, morning: true, midday: false, afternoon: false, night: false } as CareType],
            pictures: [],
          }}
          onSubmit={async (values) => {
            try {
              const ordonnance = {
                ...values,
                cares: values?.cares?.map((c) => omit(c, "acts")),
                nbTotalActs: values?.cares?.flatMap((c) => c.acts)?.length || 0,
                nbActsDo: 0,
                createdAt: new Date(),
              };
              const docRef = await addDoc(
                collection(db, `offices/${officeId}/patients/${patientId}/ordonnances`),
                ordonnance
              );

              const patientDoc = await getDoc(doc(db, `offices/${officeId}/patients`, patientId));
              const patient = { ...patientDoc.data(), id: patientDoc.id };

              const acts =
                values?.cares
                  ?.flatMap((c) => c.acts)
                  ?.map((a) => ({
                    ...a,
                    idOrdonnances: docRef.id,
                    patient,
                  })) || [];

              for (const act of acts) {
                await addDoc(collection(db, `offices/${officeId}/acts`), act);
              }

              history.replace(`/offices/${officeId}/patients/${patientId}`);
            } catch (err) {
              console.error(err);
            }
          }}
        />
      </Box>
    </>
  );
}
