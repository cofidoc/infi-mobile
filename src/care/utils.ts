import { isBankHoliday } from "./isBankHoliday";
import {
  eachDayOfInterval,
  parse,
  isMonday,
  isTuesday,
  isWednesday,
  isThursday,
  isFriday,
  isSaturday,
  isSunday,
  add,
} from "date-fns";
import { pick } from "lodash";
import { CareType } from "../types";

export function getGeneratedActs(care?: CareType): any[] {
  if (!care) return [];

  const { start, end, bankHoliday, everyNDays, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = care;

  if (!start || !end) return [];

  const eachDayOfActInterval = eachDayOfInterval({ start, end });

  const isHolidayNotRegister = (day: Date) => bankHoliday !== "doNotRegister" || !isBankHoliday(day);

  const nbDayInInterval = eachDayOfActInterval.length - 1;

  const getByDayInterval = (intervalDay: number) => (day: Date, index: number) =>
    index === nbDayInInterval || index === 0 ? true : index % intervalDay === 0;

  const isChooseDay = (day: Date) =>
    (monday && isMonday(day)) ||
    (tuesday && isTuesday(day)) ||
    (wednesday && isWednesday(day)) ||
    (thursday && isThursday(day)) ||
    (friday && isFriday(day)) ||
    (saturday && isSaturday(day)) ||
    (saturday && isSaturday(day)) ||
    (sunday && isSunday(day));

  const acts = eachDayOfActInterval
    .filter(everyNDays ? getByDayInterval(everyNDays) : isChooseDay)
    .filter(isHolidayNotRegister)
    .map((day) => {
      const isHoliday = isBankHoliday(day);
      const isPostpone = bankHoliday === "postpone";
      const plannedOn = isHoliday && isPostpone ? add(day, { days: 1 }) : day;

      return {
        ...care,
        plannedOn,
        status: "todo" as const,
      };
    });

  const results2 = duplicateActByDay(acts);
  const results3 = results2?.map((a: any) => ({
    ...pick(a, ["plannedOn", "time", "quotation", "status", "comment"]),
  }));

  return results3;
}

function duplicateActByDay(acts: any[]) {
  return acts?.flatMap((act: any) => {
    const data: any[] = [];
    if (act.morning) {
      const plannedOn = parse(act.preferredScheduledMorning || "08:00", "HH:mm", act.plannedOn);
      data.push({ ...act, time: "morning", plannedOn });
    }
    if (act.midday) {
      const plannedOn = parse(act.preferredScheduledMidday || "12:00", "HH:mm", act.plannedOn);

      data.push({ ...act, time: "midday", plannedOn });
    }
    if (act.afternoon) {
      const plannedOn = parse(act.preferredScheduledAfternoon || "14:00", "HH:mm", act.plannedOn);
      data.push({ ...act, time: "midday", plannedOn });
    }
    if (act.night) {
      const plannedOn = parse(act.preferredScheduledNight || "18:00", "HH:mm", act.plannedOn);
      data.push({ ...act, time: "night", plannedOn });
    }
    const plannedOn = parse(act.preferredScheduledMorning || "08:00", "HH:mm", act.plannedOn);

    return data.length ? data : [{ ...act, time: "morning", plannedOn }];
  });
}
