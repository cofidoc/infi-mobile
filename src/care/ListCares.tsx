import { Box } from "@mui/system";
import { AddLink } from "../ui/AddLink";
import { CareType, OrdonnanceType } from "../types";
import { Paper, Typography, Divider } from "@mui/material";
import { ReactNode } from "react";
import { compareAsc, isWithinInterval, format } from "date-fns";
import { useGetOrdonnances } from "./api";
import { Link, useRouteMatch } from "react-router-dom";

export function ListCares() {
  const { ordonnances } = useGetOrdonnances();
  const { url } = useRouteMatch();

  return (
    <>
      <Box pb="6em">
        {ordonnances?.map((ordonnance) => (
          <Link key={ordonnance.id} to={`${url}/ordonnances/${ordonnance.id}/show`}>
            <OrdoItem ordonnance={ordonnance} />
          </Link>
        ))}
      </Box>
      <AddLink to="/ordonnances/create" />
    </>
  );
}

function OrdoItem({ ordonnance }: { ordonnance: OrdonnanceType }) {
  const status = getStatus(ordonnance?.cares?.[0]);
  const lengthCares = ordonnance?.cares?.length - 1;

  return (
    <Paper sx={{ px: 1, py: 2, my: 1, mx: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex" }}>
          <Status type={status}>{status}</Status>
        </Box>

        <Typography>
          {ordonnance.nbActsDo || 0}/{ordonnance.nbTotalActs || 0}
        </Typography>
      </Box>

      <Box>
        {ordonnance?.cares?.map((care, index) => {
          const date = `${care.start ? format(care.start, "d MMM yyyy") : ""} - ${
            care.end ? format(care.end, "d MMM yyyy") : ""
          }`;
          const frequency = getFrequency(care);

          return (
            <>
              <Box key={care?.quotation?.name + "-" + index}>
                <Typography fontWeight="bold">
                  {`${cutString(care?.quotation?.name, 25)} (${care?.quotation?.keyLetter?.label} ${
                    care?.quotation?.coefficient?.value
                  })`}
                </Typography>

                <Typography>{date}</Typography>
                <Typography>{frequency}</Typography>

                <Box sx={{ display: "flex" }}>
                  {care.morning && <Tag>Matin</Tag>}
                  {care.midday && <Tag>Midi</Tag>}
                  {care.afternoon && <Tag>Après-midi</Tag>}
                  {care.night && <Tag>Soir</Tag>}
                </Box>
              </Box>
              {index !== lengthCares && <Divider light sx={{ my: 1 }} />}
            </>
          );
        })}
      </Box>
    </Paper>
  );
}

function getFrequency(care: CareType) {
  if (care.everyNDays) return care.everyNDays === 1 ? `Tous les jours` : `Tous les ${care.everyNDays} jours`;

  const days: string[] = [];
  if (care.monday) days.push("Lun");
  if (care.tuesday) days.push("Mar");
  if (care.wednesday) days.push("Mer");
  if (care.thursday) days.push("Jeu");
  if (care.friday) days.push("Ven");
  if (care.saturday) days.push("Sam");
  if (care.sunday) days.push("Dim");

  return `Tous les ${days.join(", ")}`;
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <Box mr={1} px="5px" py="2px" sx={{ backgroundColor: "#eee", borderRadius: 1 }}>
      <Typography color="#000" fontSize={13}>
        {children}
      </Typography>
    </Box>
  );
}

function cutString(str: string, nbToCut = 25) {
  return str?.length > nbToCut ? str.substring(0, nbToCut).concat("...") : str;
}

type ActStatusType = "En Cours" | "Pas Commencé" | "Passé";

type StatusProps = {
  children: ReactNode;
  type: ActStatusType;
};

function getBackgroundByType(type: ActStatusType) {
  switch (type) {
    case "Pas Commencé":
      return "grey";
    case "En Cours":
      return "green";
    case "Passé":
      return "orange";
    default:
      return "grey";
  }
}

function Status({ children, type }: StatusProps) {
  return (
    <div>
      <Box sx={{ bgcolor: getBackgroundByType(type), p: "0px 6px", borderRadius: "3px" }}>
        <Typography color="white" fontSize={13}>
          {children}
        </Typography>
      </Box>
    </div>
  );
}

function getStatus({ start, end }: CareType): ActStatusType {
  const currentDate = new Date();
  const isCurrentDateWithinInterval =
    start && end && start <= end ? isWithinInterval(currentDate, { start, end }) : false;
  if (isCurrentDateWithinInterval) return "En Cours";
  return compareAsc(currentDate, start || new Date()) === -1 ? "Pas Commencé" : "Passé";
}
