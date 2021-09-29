import { Formik, Form, Field, FormikConfig } from "formik";
import { Box, Button, TextField } from "@mui/material";
import { PatientType } from "../types";

type PatientFormValues = Partial<PatientType>;

type FormPatientProps = FormikConfig<PatientFormValues> & {
  labelSubmit: string;
};

export function FormPatient({ labelSubmit, ...props }: FormPatientProps) {
  return (
    <Formik {...props}>
      {({ isSubmitting }) => (
        <Form>
          <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
            <Field name="socialSecurityNumber" as={TextField} variant="filled" label="socialSecurityNumber" />
            <Field name="firstname" as={TextField} variant="filled" label="Prenom" />
            <Field name="lastname" as={TextField} variant="filled" label="Nom" />
            <Field name="birthdate" as={TextField} variant="filled" label="Date d'anniverssaire" />
            <Field name="phoneNumber" as={TextField} variant="filled" label="Numéro de téléphone" />
            <Button sx={{ mt: 2 }} type="submit" variant="contained" disabled={isSubmitting}>
              {labelSubmit}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
