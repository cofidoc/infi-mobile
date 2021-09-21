import { Header } from "../ui/Header";
import { Formik, Form, Field, FormikConfig } from "formik";
import { Box, Button, TextField } from "@mui/material";
import { addDoc, updateDoc, collection, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useHistory, useParams } from "react-router-dom";
import { useGeOfficeById } from "./useGeOfficeById";

export type OfficeType = {
  name: string;
  finess: string;
  address: string;
  city: string;
  zipCode: string;
};

export function CreateOffice() {
  const history = useHistory();

  return (
    <FormOffice
      labelSubmit="Ajouter un Cabinet"
      initialValues={{
        name: "",
        finess: "",
        address: "",
        city: "",
        zipCode: "",
      }}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const officeRef = await addDoc(collection(db, "offices"), values);
          const userId = auth.currentUser?.uid || "";
          const userRef = doc(db, "users", userId);
          await updateDoc(userRef, { officeIds: [officeRef.id] });
          history.push("/");
        } catch (err) {
          console.error(err);
        } finally {
          setSubmitting(false);
        }
      }}
    />
  );
}

export function UpdateOffice() {
  const { officeId } = useParams<{ officeId: string }>();
  const { office } = useGeOfficeById(officeId);

  if (!office) return null;

  return (
    <FormOffice
      labelSubmit="Modifier le Cabinet"
      initialValues={office}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await updateDoc(doc(db, "offices", officeId), values);
        } catch (err) {
          console.error(err);
        } finally {
          setSubmitting(false);
        }
      }}
    />
  );
}

type OfficeFormValues = OfficeType;

function FormOffice(
  props: FormikConfig<OfficeFormValues> & { labelSubmit: string }
) {
  return (
    <>
      <Header text="Cabinet" />
      <Box p={1}>
        <Formik {...props}>
          {({ isSubmitting }) => (
            <Form>
              <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
                <Field
                  name="name"
                  as={TextField}
                  variant="standard"
                  placeholder="Nom du Cabinet"
                  label="Nom du Cabinet"
                />

                <Field
                  name="finess"
                  label="Numéro finess"
                  placeholder="Numéro finess"
                  as={TextField}
                  variant="standard"
                />

                <Field
                  name="address"
                  label="Adresse"
                  placeholder="Adresse"
                  as={TextField}
                  variant="standard"
                />

                <Field
                  name="city"
                  label="ville"
                  placeholder="City"
                  as={TextField}
                  variant="standard"
                />

                <Field
                  name="zipCode"
                  placeholder="Code Postale"
                  label="Code Postale"
                  as={TextField}
                  variant="standard"
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ mt: 2 }}
                >
                  {props.labelSubmit}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
}
