import { useFormikContext } from "formik";
import { Box, Radio, FormControl, FormLabel, FormControlLabel } from "@mui/material";
import { ReactNode, useState } from "react";

type RadioGroupDayProps = {
  index: number;
  renderByNbDay: ReactNode;
  renderByWeek: ReactNode;
};

export function RadioGroupDay({ index, renderByNbDay, renderByWeek }: RadioGroupDayProps) {
  const [open, setOpen] = useState("byNbDay");
  const { setFieldValue } = useFormikContext();

  return (
    <FormControl component="fieldset" sx={{ width: "100%" }}>
      <FormLabel component="legend">Méthodes de génération</FormLabel>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <FormControlLabel
          control={
            <Radio
              checked={open === "byNbDay"}
              onChange={() => {
                setOpen("byNbDay");
                setFieldValue(`cares.${index}.everyNDays`, 1);
                setFieldValue(`cares.${index}.monday`, false);
                setFieldValue(`cares.${index}.tuesday`, false);
                setFieldValue(`cares.${index}.wednesday`, false);
                setFieldValue(`cares.${index}.thursday`, false);
                setFieldValue(`cares.${index}.friday`, false);
                setFieldValue(`cares.${index}.saturday`, false);
                setFieldValue(`cares.${index}.sunday`, false);
              }}
            />
          }
          label={renderByNbDay}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControlLabel
            control={
              <Radio
                checked={open === "byWeek"}
                onChange={() => {
                  setOpen("byWeek");
                  setFieldValue(`cares.${index}.everyNDays`, 0);

                  setFieldValue(`cares.${index}.monday`, true);
                  setFieldValue(`cares.${index}.tuesday`, true);
                  setFieldValue(`cares.${index}.wednesday`, true);
                  setFieldValue(`cares.${index}.thursday`, true);
                  setFieldValue(`cares.${index}.friday`, true);
                  setFieldValue(`cares.${index}.saturday`, true);
                  setFieldValue(`cares.${index}.sunday`, true);
                }}
              />
            }
            label="Toutes les semaines"
          />
        </Box>
        {open === "byWeek" && renderByWeek}
      </Box>
    </FormControl>
  );
}
