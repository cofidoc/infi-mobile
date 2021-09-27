import { useField } from "formik";
import { TextField } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDatePicker from "@mui/lab/MobileDatePicker";

export function DatePickerField({ name, label }: { name: string; label: string }) {
  const [field, _, helpers] = useField({ name });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale="fr">
      <MobileDatePicker
        label={label}
        value={field.value}
        toolbarFormat="d MMM"
        inputFormat="dd/MM/yyyy"
        onChange={(newValue) => {
          helpers.setValue(newValue);
        }}
        renderInput={(params) => <TextField variant="standard" {...params} />}
      />
    </LocalizationProvider>
  );
}
