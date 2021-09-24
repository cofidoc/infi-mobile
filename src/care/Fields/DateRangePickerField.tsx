import { useState, useMemo } from "react";
import { useFormikContext } from "formik";
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
  const [value, setValue] = useState([null, null] as any);

  const { values, setFieldValue } = useFormikContext<CareFormValues>();
  const acts = values?.cares?.[index]?.acts;
  const dates = useMemo(() => acts?.map((a) => format(a.plannedOn, "dd/MM/yyyy")), [acts]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDateRangePicker
        toolbarTitle=""
        toolbarFormat="d MMM"
        startText="Debut du Soin"
        endText="Fin du Soin"
        value={value}
        onChange={(newValue: any) => {
          setValue(newValue);
          setFieldValue(nameStart, newValue?.[0]);
          setFieldValue(nameEnd, newValue?.[1]);
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
