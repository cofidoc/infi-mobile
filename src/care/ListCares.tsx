import { Box } from "@mui/system";
import { AddLink } from "../ui/AddLink";
import { CareType, OrdonnanceType } from "../types";
import { Paper, Typography } from "@mui/material";
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

          return (
            <Box key={care?.quotation?.name + "-" + index}>
              <Typography fontWeight="bold">
                {`${cutString(care?.quotation?.name, 25)} (${care?.quotation?.keyLetter?.label} ${
                  care?.quotation?.coefficient?.value
                })`}
              </Typography>

              <Typography>{date}</Typography>

              <Box sx={{ display: "flex" }}>
                {care.morning && <Tag>Matin</Tag>}
                {care.midday && <Tag>Midi</Tag>}
                {care.afternoon && <Tag>Après-midi</Tag>}
                {care.night && <Tag>Soir</Tag>}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <Box mr={1} px="5px" py="2px" sx={{ backgroundColor: "#eee", borderRadius: 2 }}>
      <Typography color="#000">{children}</Typography>
    </Box>
  );
}

function cutString(str: string, nbToCut = 25) {
  return str?.length > nbToCut ? str.substring(0, nbToCut).concat("...") : str;
}

type ActStatusType = "pending" | "notStarted" | "over";

type StatusProps = {
  children: ReactNode;
  type: ActStatusType;
};

function getBackgroundByType(type: ActStatusType) {
  switch (type) {
    case "notStarted":
      return "grey";
    case "pending":
      return "green";
    case "over":
      return "orange";
    default:
      return "grey";
  }
}

function Status({ children, type }: StatusProps) {
  return (
    <Box sx={{ bgcolor: getBackgroundByType(type), p: "2px 6px", borderRadius: "5px" }}>
      <Typography color="white">{children}</Typography>
    </Box>
  );
}

function getStatus({ start, end }: CareType): ActStatusType {
  const currentDate = new Date();
  const isCurrentDateWithinInterval =
    start && end && start <= end ? isWithinInterval(currentDate, { start, end }) : false;
  if (isCurrentDateWithinInterval) return "pending";
  return compareAsc(currentDate, start || new Date()) === -1 ? "notStarted" : "over";
}
