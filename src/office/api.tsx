import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import useSWR from "swr";
import { OfficeType } from "../types";

export function useGetOfficeById(officeId: string) {
  const { data: office } = useSWR(`/offices/${officeId}`, async () => {
    const docRef = doc(db, "offices", officeId);
    const docSnap = await getDoc(docRef);
    return docSnap.data() as OfficeType;
  });
  return { office };
}
