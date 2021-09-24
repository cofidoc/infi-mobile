import { useField } from "formik";
import { Box, Typography } from "@mui/material";

export function DayOfWeekField({ name, label }: { name: string; label: string }) {
  const [field, _, helpers] = useField({ name });

  return (
    <Box
      sx={{
        bgcolor: field.value ? "primary.main" : "#474747",
        p: 2,
        color: "white",
        borderRadius: 2,
      }}
      onClick={() => helpers.setValue(!field.value)}
    >
      <Typography>{label}</Typography>
    </Box>
  );
}
