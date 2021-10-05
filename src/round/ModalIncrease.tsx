import { Box, Paper, Typography, Button, Modal } from "@mui/material";
import { Increase } from "../types";
import { useState } from "react";
import { useGetIncreases } from "./api";

type ModalIncreaseProps = {
  open: boolean;
  onClose: () => void;
  increasesInit: Increase[];
  onValidate: (increases: Increase[]) => void;
};

export function ModalIncrease({ open, onClose, increasesInit, onValidate }: ModalIncreaseProps) {
  const { data: increases = [] } = useGetIncreases();
  const [increasesSelected, setIncrease] = useState(increasesInit);

  const selectedIncrease = (increase: Increase) => () =>
    setIncrease(
      increasesSelected?.map((i) => i.id)?.includes(increase.id)
        ? increasesSelected?.filter((i) => i.id !== increase.id)
        : [increase, ...increasesSelected]
    );

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", p: 1 }}>
        <Paper sx={{ p: 2 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Ajouter des majorations
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column" }} p={2}>
            {increases
              ?.sort((a, b) => b?.label?.localeCompare(a?.label))
              ?.map((increase) => (
                <Typography
                  key={increase.id}
                  onClick={selectedIncrease(increase)}
                  mb={1}
                  fontWeight={increasesSelected?.map((i) => i.id)?.includes(increase.id) ? "bold" : "normal"}
                  color={increasesSelected?.map((i) => i.id)?.includes(increase.id) ? "primary.main" : "black"}
                >
                  {increase.label}
                </Typography>
              ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={() => {
                onValidate(increasesSelected);
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
