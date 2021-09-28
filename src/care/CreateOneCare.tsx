import { Box } from "@mui/material";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { CareType } from "../types";
import { Header } from "../ui/Header";
import { FormCare } from "./FormCare";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { omit } from "lodash";
import { parse } from "date-fns";

function useGetDateQueryParams() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const date = searchParams.get("date") ? parse(searchParams.get("date") || "", "dd-MM-yyyy", new Date()) : new Date();
  return date;
}

export function CreateOneCare() {
  const history = useHistory();
  const { officeId, patientId } = useParams<{ officeId: string; patientId: string }>();
  const date = useGetDateQueryParams();

  return (
    <>
      <Header text="Ajouter un soin ponctuel" />
      <Box p={1}>
        <FormCare
          labelSubmit="Créer un soin"
          initialValues={{
            cares: [
              {
                start: date,
                end: date,
                everyNDays: 1,
                morning: true,
                midday: false,
                afternoon: false,
                night: false,
              } as CareType,
            ],
            pictures: [],
          }}
          onSubmit={async (values) => {
            try {
              console.log({ values });
              const ordonnance = {
                ...values,
                cares: values?.cares?.map((c) => omit(c, "acts")),
                nbTotalActs: values?.cares?.flatMap((c) => c.acts)?.length || 0,
                nbActsDo: 0,
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

              history.goBack();
            } catch (err) {
              console.error(err);
            }
          }}
        />
      </Box>
    </>
  );
}
