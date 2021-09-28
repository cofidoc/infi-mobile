import { Box, Paper, Typography, Button, Modal, IconButton, ToggleButtonGroup, ToggleButton } from "@mui/material";
import CalendarPicker from "@mui/lab/CalendarPicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { useState } from "react";
import { Clear } from "@mui/icons-material";
import { Time } from "../types";

export type DataReport = { plannedOn: Date; time: Time };

type ModalReportProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onValidate: (data: DataReport) => void;
};

export function ModalReport({ open, title, onClose, onValidate }: ModalReportProps) {
  const [plannedOn, setPlannedOn] = useState<Date | null>();
  const [time, setTime] = useState<Time>("morning");

  const handleChange = (_: any, value: Time) => {
    setTime(value);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", p: 1 }}>
        <Paper sx={{ p: 1 }}>
          <Box mb={2} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" component="h2" ml={2}>
              {title}
            </Typography>
            <IconButton onClick={onClose}>
              <Clear />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <ToggleButtonGroup color="primary" value={time} exclusive onChange={handleChange}>
              <ToggleButton value="morning">Matin</ToggleButton>
              <ToggleButton value="midday">Midi</ToggleButton>
              <ToggleButton value="afternoon">Après midi</ToggleButton>
              <ToggleButton value="night">Soir</ToggleButton>
            </ToggleButtonGroup>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CalendarPicker date={plannedOn} onChange={(newDate) => setPlannedOn(newDate)} />
            </LocalizationProvider>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              disabled={!plannedOn || !time}
              onClick={() => {
                if (!plannedOn || !time) return;

                onValidate({ plannedOn, time });
                onClose();
              }}
            >
              Valider
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
}
