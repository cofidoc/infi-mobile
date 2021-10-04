import * as functions from "firebase-functions";

export const syncPatient = functions.firestore.document("/offices/{officeId}/patients").onUpdate((change) => {
  const document = change.after.exists ? change.after.data() : null;
  console.log({ document });
  return null;
});
