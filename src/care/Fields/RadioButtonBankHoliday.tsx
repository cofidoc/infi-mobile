import { useField } from "formik";
import { Radio } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export function RadioButtonBankHoliday({ name }: { name: string }) {
  const [_, meta, helpers] = useField({ name });

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Que faire les jours fériés ?</FormLabel>
      <RadioGroup
        aria-label="jours fériés"
        defaultValue="doNotRegister"
        onChange={(e) => helpers.setValue(e.target.value)}
      >
        <FormControlLabel value="doNotRegister" control={<Radio />} label="Ne pas enregistrer l'acte" />
        <FormControlLabel value="register" control={<Radio />} label="Enregister l'acte" />
        <FormControlLabel value="postpone" control={<Radio />} label="Reporter l'acte au lendemain" />
      </RadioGroup>
      {meta.error}
    </FormControl>
  );
}
