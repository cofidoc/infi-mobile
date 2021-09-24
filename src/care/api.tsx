import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import useSWR from "swr";
import { useParams } from "react-router";
import { OrdonnanceType } from "../types";
import { useMemo } from "react";

export function useGetOrdonnances() {
  const { officeId, patientId } = useParams<{ officeId: string; patientId: string }>();
  const { data: _ordonnances } = useSWR<OrdonnanceType[]>(
    `/offices/${officeId}/patients/${patientId}/ordonnances`,
    async () => {
      const docRef = await getDocs(collection(db, `/offices/${officeId}/patients/${patientId}/ordonnances`));
      return docRef.docs.map((d) => ({ ...d.data(), id: d.id } as OrdonnanceType));
    }
  );

  const ordonnances = useMemo(
    () =>
      _ordonnances?.map((ordonnance) => ({
        ...ordonnance,
        cares: ordonnance?.cares?.map((care: any) => ({
          ...care,
          start: new Date((care?.start?.seconds || 0) * 1000),
          end: new Date((care?.end?.seconds || 0) * 1000),
        })),
      })),
    [_ordonnances]
  );

  return { ordonnances };
}

export function useGetOrdonnance() {
  const { officeId, patientId, ordonnanceId } =
    useParams<{ officeId: string; patientId: string; ordonnanceId: string }>();
  const { data: ordonnance, ...props } = useSWR<OrdonnanceType>(
    `/offices/${officeId}/patients/${patientId}/ordonnances/${ordonnanceId}`,
    async () => {
      const docSnap = await getDoc(doc(db, `/offices/${officeId}/patients/${patientId}/ordonnances`, ordonnanceId));
      return { ...docSnap.data(), id: docSnap.id } as OrdonnanceType;
    }
  );

  return { ordonnance, ...props };
}
