import { useMemo } from "react";
import { useField, useFormikContext } from "formik";
import { Box, TextField } from "@mui/material";
import StaticDateRangePicker from "@mui/lab/StaticDateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateRangePickerDay from "@mui/lab/DateRangePickerDay";
import { format } from "date-fns";
import { CareFormValues } from "../FormCare";

type DateRangePickerFieldProps = {
  nameStart: string;
  nameEnd: string;
  index: number;
};

export function DateRangePickerField({ nameStart, nameEnd, index }: DateRangePickerFieldProps) {
  const [fieldStart, , helpersStart] = useField<Date>({ name: nameStart });
  const [fieldEnd, , helpersEnd] = useField<Date>({ name: nameEnd });

  const { values } = useFormikContext<CareFormValues>();
  const acts = values?.cares?.[index]?.acts;
  const dates = useMemo(() => acts?.map((a) => format(a.plannedOn, "dd/MM/yyyy")), [acts]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDateRangePicker
        toolbarTitle=""
        toolbarFormat="d MMM"
        startText="Debut du Soin"
        endText="Fin du Soin"
        value={[fieldStart.value || null, fieldEnd.value || null] as any}
        onChange={(newValue: any) => {
          helpersStart.setValue(newValue?.[0]);
          helpersEnd.setValue(newValue?.[1]);
        }}
        inputFormat="dd/MM/yyyy"
        renderDay={(date: Date, dateRangePickerDayProps) => {
          return (
            <DateRangePickerDay
              {...dateRangePickerDayProps}
              isHighlighting={
                dateRangePickerDayProps.isStartOfHighlighting || dateRangePickerDayProps.isEndOfHighlighting
                  ? false
                  : dates?.includes(format(date, "dd/MM/yyyy")) || false
              }
            />
          );
        }}
        renderInput={(startProps: any, endProps: any) => (
          <>
            <TextField {...startProps} />
            <Box sx={{ mx: 1 }}> au </Box>
            <TextField {...endProps} />
          </>
        )}
      />
    </LocalizationProvider>
  );
}
