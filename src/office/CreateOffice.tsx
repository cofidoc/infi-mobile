import { addDoc, updateDoc, collection, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useHistory } from "react-router-dom";
import { FormOffice } from "./FormOffice";

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
