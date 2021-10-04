import { Formik, Form, Field, FormikConfig } from "formik";
import { Box, Button, TextField } from "@mui/material";
import { PatientType } from "../types";
import { useState, useEffect, useRef } from "react";

type PatientFormValues = Partial<PatientType>;

type FormPatientProps = FormikConfig<PatientFormValues> & {
  labelSubmit: string;
};

export function FormPatient({ labelSubmit, ...props }: FormPatientProps) {
  const [nir, setNIR] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [urlCaptcha, setUrlCaptcha] = useState("");

  const [patients, setPatients] = useState([]);

  const ref = useRef<any>();

  useEffect(() => {
    ref.current = (window as any).io("https://infi-mobile.ew.r.appspot.com/");

    ref.current.on("urlCaptcha", function (urlCaptcha: any) {
      console.log({ urlCaptcha });
      setUrlCaptcha(urlCaptcha);
    });

    ref.current.on("patients", function (patients: any) {
      console.log({ patients });
      setPatients(patients);
    });

    ref.current.on("error", function (err: any) {
      console.log({ err });
      ref.current.disconnect().connect();
    });

    return () => {
      ref.current.disconnect();
    };
  }, []);

  const handleSearch = () => {
    const username = "312555014";
    const password = "3199931z";
    const nir = "187079202603071";
    console.log("search", { username, password, captcha, nir });
    ref.current.emit("getCaptcha", { username, password, captcha, nir });
  };

  console.log({ patients });

  return (
    <Formik {...props}>
      {({ isSubmitting }) => (
        <Form>
          <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
            <TextField label="nir" value={nir} onChange={(e) => setNIR(e.target.value)} />
            <TextField label="captcha" value={captcha} onChange={(e) => setCaptcha(e.target.value)} />
            <img src={urlCaptcha} alt="urlCaptcha" width="100%" height="100px" />
            <Button onClick={handleSearch}>search</Button>

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
