import { compareAsc } from "date-fns";

export function JoursFeries(year: number): Date[] {
  const JourAn = new Date(year, 0, 1);
  const FeteTravail = new Date(year, 4, 1);
  const Victoire1945 = new Date(year, 4, 8);
  const FeteNationale = new Date(year, 6, 14);
  const Assomption = new Date(year, 7, 15);
  const Toussaint = new Date(year, 10, 1);
  const Armistice = new Date(year, 10, 11);
  const Noel = new Date(year, 11, 25);
  // const SaintEtienne = new Date(year, 11, 26);

  const G = year % 19;
  const C = Math.floor(year / 100);
  const H = (C - Math.floor(C / 4) - Math.floor((8 * C + 13) / 25) + 19 * G + 15) % 30;
  const I = H - Math.floor(H / 28) * (1 - Math.floor(H / 28) * Math.floor(29 / (H + 1)) * Math.floor((21 - G) / 11));
  const J = (year + Math.floor(year / 4) + I + 2 - C + Math.floor(C / 4)) % 7;
  const L = I - J;
  const MoisPaques = 3 + Math.floor((L + 40) / 44);
  const JourPaques = L + 28 - 31 * Math.floor(MoisPaques / 4);
  const Paques = new Date(year, MoisPaques - 1, JourPaques);
  // const VendrediSaint = new Date(year, MoisPaques - 1, JourPaques - 2);
  const LundiPaques = new Date(year, MoisPaques - 1, JourPaques + 1);
  const Ascension = new Date(year, MoisPaques - 1, JourPaques + 39);
  const Pentecote = new Date(year, MoisPaques - 1, JourPaques + 49);
  const LundiPentecote = new Date(year, MoisPaques - 1, JourPaques + 50);

  return [
    JourAn,
    // VendrediSaint,
    Paques,
    LundiPaques,
    FeteTravail,
    Victoire1945,
    Ascension,
    Pentecote,
    LundiPentecote,
    FeteNationale,
    Assomption,
    Toussaint,
    Armistice,
    Noel,
    // SaintEtienne,
  ];
}

export const isBankHoliday = (day: Date) => {
  let match = false;
  JoursFeries(day.getFullYear()).forEach((jourFerie) => {
    if (compareAsc(day, jourFerie) === 0) {
      match = true;
    }
  });
  return match;
};
