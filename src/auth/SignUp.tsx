import { Box, Button, TextField } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import logo from "../assets/images/cofidoc-black.png";
import { updateProfile, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { ErrorField } from "../ui/ErrorField";
import { Header } from "../ui/Header";
import { doc, setDoc } from "@firebase/firestore";
import { useHistory } from "react-router-dom";

export function SignUp() {
  const history = useHistory();

  return (
    <Box>
      <Header text="SignUp" />
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <img src={logo} alt="Logo" width="80%" />
      </Box>
      <Formik
        initialValues={{
          email: "",
          password: "",
          passwordVerification: "",
          firstname: "",
          lastname: "",
          phoneNumber: "",
        }}
        validate={(values) => {
          const errors: any = {};

          if (values.password !== values.passwordVerification) {
            errors.passwordVerification =
              "les mots de passe doivent être identique";
          }
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const { email, password, firstname, lastname } = values;
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
            if (auth.currentUser)
              await updateProfile(auth.currentUser, {
                displayName: `${firstname} ${lastname}`,
              });

            await setDoc(doc(db, "users", userCredential.user.uid), {
              email,
              firstname,
              lastname,
            });
            setSubmitting(false);
            history.push("/create-office");
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
              <Field
                type="email"
                name="email"
                as={TextField}
                variant="filled"
                placeholder="Email*"
              />
              <ErrorMessage name="email" component={ErrorField} />
              <Field
                type="password"
                name="password"
                as={TextField}
                variant="filled"
                placeholder="Mot de passe*"
              />
              <ErrorMessage name="password" component={ErrorField} />
              <Field
                type="password"
                name="passwordVerification"
                as={TextField}
                variant="filled"
                placeholder="Mot de passe*"
              />
              <ErrorMessage
                name="passwordVerification"
                component={ErrorField}
              />
              <Field
                name="firstname"
                as={TextField}
                variant="filled"
                placeholder="Prénom*"
              />
              <Field
                name="lastname"
                as={TextField}
                variant="filled"
                placeholder="Nom*"
              />
              <Button type="submit" variant="text" disabled={isSubmitting}>
                Créer mon compte
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
