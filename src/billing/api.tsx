import useSWR from "swr";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router";
import { SeanceType } from "../types";

export function useGetSeances() {
  const { officeId } = useParams<{ officeId: string }>();
  return useSWR<SeanceType[]>(`/offices/${officeId}/seances`, async () => {
    const q = query(collection(db, `/offices/${officeId}/seances`), where("status", "==", "to-bill"));
    const docsSnap = await getDocs(q);
    return docsSnap.docs
      .map((d) => ({ ...d.data(), id: d.id }))
      .map(
        (d: any) =>
          ({
            ...d,
            doneAt: new Date(d?.doneAt?.seconds * 1000),
            plannedOn: new Date(d?.plannedOn?.seconds * 1000),
            id: d.id,
          } as SeanceType)
      );
  });
}
