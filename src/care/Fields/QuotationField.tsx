import { useState, ReactNode } from "react";
import { useField } from "formik";
import { Box, Button, IconButton, Typography, Modal } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { SearchField } from "../../ui/SearchField";

export function QuotationField({ name, children }: { name: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);

  const [field, _, helpers] = useField({ name });
  const c = field.value;

  const quotations = [
    {
      name: "PSC",
      keyLetter: {
        id: "ami",
        label: "ami",
        price: 5.1,
        priceDOM: 4.3,
      },
      coefficient: {
        id: "1.2",
        value: 1.2,
      },
    },
    {
      name: "Injection",
      keyLetter: {
        id: "ami",
        label: "ami",
        price: 5.1,
        priceDOM: 4.3,
      },
      coefficient: {
        id: "2",
        value: 2,
      },
    },
  ];

  return (
    <>
      {!c && (
        <Box sx={{ display: "flex", alignItems: "center" }} onClick={() => setOpen(true)}>
          <Typography sx={{ ml: 2 }}>Cotations</Typography>
          <IconButton color="primary">
            <AddIcon />
          </IconButton>
        </Box>
      )}

      {c && (
        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }} onClick={() => setOpen(true)}>
          <Typography fontWeight="bold">{`${c?.name}`}</Typography>
          <Box
            mx={1}
            sx={{
              px: 1,
              bgcolor: "primary.main",
              color: "#FFF",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >{`${c?.keyLetter?.label} ${c?.coefficient?.value}`}</Box>
          {children}
        </Box>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#eee",
            boxShadow: 24,
            p: 1,
            height: "80vh",
            width: "95%",
            borderRadius: 3,
            pt: 2,
          }}
        >
          <Typography variant="h6" component="h2" mb={2}>
            Selectionner une cotation
          </Typography>

          <SearchField />

          <Typography fontWeight="bold" my={2}>
            Top 5
          </Typography>
          <Box>
            {quotations.map((quotation) => (
              <Box key={quotation.name}>
                <Button
                  color={field?.value?.name === quotation?.name ? "secondary" : "primary"}
                  onClick={() => {
                    helpers.setValue(quotation);
                    setOpen(false);
                  }}
                >{`- ${quotation.name} ${quotation.keyLetter.label} ${quotation.coefficient.value}`}</Button>
              </Box>
            ))}
          </Box>

          <Typography fontWeight="bold" my={2}>
            Liste des Cotations
          </Typography>
          <Box mt={2}>
            {quotations.map((quotation) => (
              <Box key={quotation.name}>
                <Button
                  color={field?.value?.name === quotation?.name ? "secondary" : "primary"}
                  onClick={() => {
                    helpers.setValue(quotation);
                    setOpen(false);
                  }}
                >{`- ${quotation.name} ${quotation.keyLetter.label} ${quotation.coefficient.value}`}</Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    </>
  );
}
