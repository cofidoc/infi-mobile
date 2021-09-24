import { useField } from "formik";
import { TextField } from "@mui/material";

export function GenDayField({ name }: { name: string }) {
  const [field, _, helpers] = useField({ name });

  const handleChange = (event: any) => {
    helpers.setValue(Number(event.target.value));
  };

  return (
    <TextField
      type="number"
      label="Gen jours"
      value={String(field.value === 0 ? "" : field.value)}
      onChange={handleChange}
    />
  );
}
