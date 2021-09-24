import { Formik, Form, FieldArray, FormikConfig } from "formik";
import { Box, Button, IconButton, Typography, Paper, Fab } from "@mui/material";
import { OrdonnanceType } from "../types";
import { SwitchField } from "../ui/SwitchField";
import AddIcon from "@mui/icons-material/Add";
import { TogglePanel } from "../ui/TogglePanel";
import { Clear } from "@mui/icons-material";
import { DayOfWeekField } from "./Fields/DayOfWeekField";
import { GenDayField } from "./Fields/GenDayField";
import { RadioButtonBankHoliday } from "./Fields/RadioButtonBankHoliday";
import { DateRangePickerField } from "./Fields/DateRangePickerField";
import { QuotationField } from "./Fields/QuotationField";
import { ActsField } from "./Fields/ActsField";
import { PictureField } from "./Fields/PictureField";

export type CareFormValues = Partial<OrdonnanceType>;

type FormPareProps = FormikConfig<CareFormValues> & { labelSubmit: string };

export function FormCare(props: FormPareProps) {
  return (
    <Formik {...props}>
      {({ isSubmitting, values }) => (
        <Form>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <PictureField name="pictures" />

            <FieldArray
              name="cares"
              render={(arrayHelpers) => (
                <>
                  {values.cares?.map((_, index) => (
                    <Paper key={index} sx={{ px: 1, py: 2, mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <QuotationField name={`cares.${index}.quotation`}>
                          {Boolean(values?.cares?.[index]?.acts?.length) && (
                            <Typography ml={2} fontWeight="bold">
                              {values?.cares?.[index]?.acts?.length} acts
                            </Typography>
                          )}
                        </QuotationField>

                        {index !== 0 && (
                          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <IconButton onClick={() => arrayHelpers.remove(index)}>
                              <Clear />
                            </IconButton>
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ display: "flex" }}>
                        <Box
                          ml={2}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-around",
                            width: "40%",
                          }}
                        >
                          <SwitchField name={`cares.${index}.morning`} label="Matin" />
                          <SwitchField name={`cares.${index}.midday`} label="Midi" />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-around",
                          }}
                        >
                          <SwitchField name={`cares.${index}.afternoon`} label="Apres- Midi" />
                          <SwitchField name={`cares.${index}.night`} label="Soir" />
                        </Box>
                      </Box>

                      <DateRangePickerField
                        nameStart={`cares.${index}.start`}
                        nameEnd={`cares.${index}.end`}
                        index={index}
                      />

                      <ActsField name={`cares.${index}.acts`} index={index} />

                      <TogglePanel
                        title={
                          <Typography ml={2} fontWeight="bold">
                            Génération de jours avancées
                          </Typography>
                        }
                      >
                        <Box py={1} />
                        <RadioButtonBankHoliday name={`cares.${index}.bankHoliday`} />
                        <Box py={1} />
                        <GenDayField name={`cares.${index}.everyNDays`} />
                        <Box
                          mt={2}
                          sx={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <DayOfWeekField name={`cares.${index}.monday`} label="L" />
                          <DayOfWeekField name={`cares.${index}.tuesday`} label="M" />
                          <DayOfWeekField name={`cares.${index}.wednesday`} label="M" />
                          <DayOfWeekField name={`cares.${index}.thursday`} label="J" />
                          <DayOfWeekField name={`cares.${index}.friday`} label="V" />
                          <DayOfWeekField name={`cares.${index}.saturday`} label="S" />
                          <DayOfWeekField name={`cares.${index}.sunday`} label="D" />
                        </Box>
                      </TogglePanel>
                    </Paper>
                  ))}

                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Fab
                      color="secondary"
                      size="large"
                      onClick={() =>
                        arrayHelpers.push({
                          everyNDays: 1,
                          morning: true,
                          midday: false,
                          afternoon: false,
                          night: false,
                        })
                      }
                    >
                      <AddIcon />
                    </Fab>
                  </Box>
                </>
              )}
            />

            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 4 }}>
              {props.labelSubmit}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
