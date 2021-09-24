import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import { useGetOfficeById } from "./api";
import { FormOffice } from "./FormOffice";
import { Loader } from "../ui/Loader";

export function UpdateOffice() {
  const { officeId } = useParams<{ officeId: string }>();
  const { office } = useGetOfficeById(officeId);

  if (!office) return <Loader />;

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
