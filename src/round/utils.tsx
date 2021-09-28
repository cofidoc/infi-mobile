import { isSunday, parse } from "date-fns";
import { sum, groupBy } from "lodash";
import { ActType, Increase, PatientType, Time, LinkedQuotation } from "../types";
import { useLocation } from "react-router-dom";

export type RoundType = {
  id: string;
  patient: PatientType;
  acts: ActType[];
  time: Time;
};

export function getRounds(acts?: ActType[]): RoundType[] {
  const byKey = groupBy(
    acts?.map((a) => ({ ...a, key: `${a.patient?.id}-${a.time}` })),
    "key"
  );

  const rounds = Object.entries(byKey).map(([key, actsByPatient]) => {
    const patient = actsByPatient?.[0]?.patient;

    return {
      id: key,
      patient,
      acts: actsByPatient as ActType[],
      time: actsByPatient?.[0]?.time,
    };
  });

  return rounds;
}

export function groupActsByDay(patientAct: RoundType[]) {
  const morning = patientAct.filter((a) => a.time === "morning");
  const midday = patientAct.filter((a) => a.time === "midday");
  const afternoon = patientAct.filter((a) => a.time === "afternoon");
  const night = patientAct.filter((a) => a.time === "night");

  const getSection = (title: string, data: RoundType[]) => (data?.length ? { title, data } : undefined);

  return [
    getSection("Matin", morning),
    getSection("Midi", midday),
    getSection("Apres Midi", afternoon),
    getSection("Soir", night),
  ].filter(Boolean);
}

type getPriceProps = {
  acts: ActType[];
  increases: Increase[];
  patient: PatientType;
  haveIk: boolean;
};

export function getPrice({ acts, increases, patient, haveIk }: getPriceProps, linkedQuotations?: LinkedQuotation[]) {
  const sumIncrease = sum(increases.map((i) => i.unitPrice));

  function getIk() {
    if (!haveIk || !patient?.relocation) return 0;
    if (haveIk && patient?.relocation.id === "ifd") return patient?.relocation?.unitPrice;
    return patient?.relocation?.unitPrice * (patient?.kmSupp || 1);
  }
  const ik = getIk();

  const idLinkedQuotation = acts
    ?.filter((act) => act.status !== "not-do")
    .map((a) => a.quotation.id)
    .sort((a, b) => a.localeCompare(b))
    .join("_");

  const linkedQuotation = linkedQuotations?.find((l) => l.id === idLinkedQuotation);

  if (linkedQuotation) {
    const exceptionPrice = sum(
      linkedQuotation.quotations.map(
        (quotation: any) =>
          quotation.keyLetter.unitPrice * quotation.coefficient.value + (quotation?.increase?.unitPrice || 0)
      )
    );
    const price = exceptionPrice + sumIncrease + ik;
    return [price, true] as const;
  }

  const prices = acts
    ?.filter((act) => act.status !== "not-do")
    ?.map(
      (a) => a.quotation.keyLetter.unitPrice * a.quotation.coefficient.value + (a.quotation?.increase?.unitPrice || 0)
    )
    ?.sort((a, b) => b - a);

  const [first = 0, second = 0] = prices;
  const half = second / 2;
  const price = first + half + sumIncrease + ik;
  return [price, false] as const;
}

export function getIncreases(acts: ActType[], patient: any, increases: Increase[]): Increase[] {
  const increasesStatic = [] as any[]; //acts?.map((a) => a.increase)?.filter(Boolean) || [];
  const firstAct = acts?.[0];
  const age = getAge(patient?.birth);
  const mie = age <= 7 && increases?.find((i) => i.id === "mie");
  const sunday =
    isSunday(firstAct?.plannedOn) &&
    increasesStatic?.every((i) => i?._id !== "20Ha23H_5Ha8H" && i?._id !== "23Ha5H") &&
    increases?.find((i) => i.id === "dimanche");

  const getMAU = () => {
    if (acts?.length !== 1) return false;
    return 1; //firstAct.keyLetter._id === "ami" && firstAct.coef.value <= 1.5;
  };
  const mau = getMAU() && increases?.find((i) => i.id === "mau");

  return [...increasesStatic, mie, sunday, mau].filter((i): i is Increase => Boolean(i));
}

export function getAge(date?: Date) {
  if (!date) return 0;
  let diff = Date.now() - date?.getTime();
  let age = new Date(diff);
  return Math.abs(age.getUTCFullYear() - 1970);
}

export function useGetDateQueryParams() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const date = searchParams.get("date") ? parse(searchParams.get("date") || "", "dd-MM-yyyy", new Date()) : new Date();
  return date;
}
