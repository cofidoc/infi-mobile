import { useEffect, useMemo, useState } from "react";
import { add, set } from "date-fns/fp";
import useSWR from "swr";
import { useParams } from "react-router";
import { collection, query, where, getDocs, onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";
import { ActType, Increase, SeanceType } from "../types";
import { Timestamp } from "firebase/firestore";
import { useGetDateQueryParams } from "./utils";

export type ActFirebase = Omit<ActType, "plannedOn"> & { plannedOn: Timestamp };

export function useGetActsByDate() {
  const date = useGetDateQueryParams();
  const { officeId } = useParams<{ officeId: string }>();
  const start = set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }, date);
  const end = add({ days: 1 }, set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }, date));

  const { data, ...props } = useSWR<ActFirebase[]>(
    `/offices/${officeId}/acts?start=${start.toDateString()}&end=${end.toDateString()}`,
    async () => {
      const actsRef = collection(db, `/offices/${officeId}/acts`);
      const q = query(actsRef, where("plannedOn", ">", start), where("plannedOn", "<", end));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id } as ActFirebase));
    }
  );

  const acts: ActType[] | undefined = useMemo(
    () => data?.map((item) => ({ ...item, plannedOn: new Date(item.plannedOn.seconds * 1000) })),
    [data]
  );

  return { acts, ...props };
}

export function useGetIncreases() {
  return useSWR<Increase[]>(`/increases`, async () => {
    const querySnapshot = await getDocs(collection(db, `increases`));
    return querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Increase));
  });
}

export function useSeanceById(id: string) {
  const { officeId } = useParams<{ officeId: string }>();
  const [seance, setSeance] = useState<SeanceType>();

  useEffect(() => {
    onSnapshot(doc(db, `/offices/${officeId}/seances`, id), (docSnap) => {
      setSeance(docSnap.data() as SeanceType);
    });
  }, [officeId, id]);

  return { seance };
}
