import { Header } from "../ui/Header";
import { Formik, Form, Field, FormikConfig } from "formik";
import { Box, Button, TextField } from "@mui/material";
import { OfficeType } from "../types";

type OfficeFormValues = OfficeType;

type FormOfficeProps = FormikConfig<OfficeFormValues> & { labelSubmit: string };

export function FormOffice(props: FormOfficeProps) {
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
