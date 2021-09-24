import { useField } from "formik";
import { Switch, FormControlLabel } from "@mui/material";

export function SwitchField({ name, label, ...props }: any) {
  const [field, _, helpers] = useField({ name });
  return (
    <FormControlLabel
      control={
        <Switch
          checked={field.value}
          onChange={(e) => helpers.setValue(e.target.checked)}
          {...props}
        />
      }
      label={label}
    />
  );
}
