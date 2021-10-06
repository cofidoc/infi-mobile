import { useField } from "formik";
import { Box, Typography, IconButton } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

export function GenDayField({ name }: { name: string }) {
  const [field, _, helpers] = useField({ name });

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography>Tous les</Typography>
      <IconButton color="primary" onClick={() => helpers.setValue(field.value + 1)}>
        <Add />
      </IconButton>
      <Typography>{String(field.value)}</Typography>
      <IconButton
        color="primary"
        disabled={field.value === 0}
        onClick={() => helpers.setValue(field.value <= 0 ? 0 : field.value - 1)}
      >
        <Remove />
      </IconButton>
      <Typography>jours</Typography>
    </Box>
  );
}
