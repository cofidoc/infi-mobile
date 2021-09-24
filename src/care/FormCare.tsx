import { useState, useEffect, useMemo } from "react";
import { Formik, Form, FieldArray, FormikConfig, useFormikContext, useField } from "formik";
import { Box, Button, IconButton, TextField, Typography, Modal, Radio, Paper, Fab } from "@mui/material";
import { OrdonnanceType } from "../types";
import { SwitchField } from "../ui/SwitchField";
import StaticDateRangePicker from "@mui/lab/StaticDateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateRangePickerDay from "@mui/lab/DateRangePickerDay";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { SearchField } from "../ui/SearchField";
import { getGeneratedActs } from "./utils";
import { format } from "date-fns";
import { storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import ClearIcon from "@mui/icons-material/Clear";
import { TogglePanel } from "../ui/TogglePanel";
import { ImgStorage } from "../ui/ImgStorage";

type CareFormValues = Partial<OrdonnanceType>;

type FormPareProps = FormikConfig<CareFormValues> & { labelSubmit: string };

export function FormCare(props: FormPareProps) {
  return (
    <Formik {...props}>
      {({ isSubmitting, values }) => (
        <Form>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <PictureField />

            {console.log(values)}

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
                        <QuotationField name={`cares.${index}.quotation`} />
                        {Boolean(values?.cares?.[index]?.acts?.length) && (
                          <Typography mr={2} fontWeight="bold">
                            {values?.cares?.[index]?.acts?.length} acts
                          </Typography>
                        )}
                      </Box>
                      <DateRangePickerField
                        nameStart={`cares.${index}.start`}
                        nameEnd={`cares.${index}.end`}
                        index={index}
                      />
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

function PictureField() {
  const { officeId } = useParams<{ officeId: string }>();
  const { values, setFieldValue } = useFormikContext<CareFormValues>();

  return (
    <Paper sx={{ px: 1, py: 2, mb: 2 }}>
      <Typography>Impoter vos ordonnaces ou prenez les en photos</Typography>

      <label htmlFor="icon-button-file">
        <input
          id="icon-button-file"
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={async (e: any) => {
            const files = e?.target?.files || [];

            for (const file of files) {
              const path = `/offices/${officeId}/ordonnances/${uuid()}-${file.name}`;
              const storageRef = ref(storage, path);
              await uploadBytes(storageRef, file);
              setFieldValue("pictures", [...(values.pictures || []), { path }]);
            }
          }}
        />
        <IconButton size="large" component="span">
          <FileDownloadIcon />
        </IconButton>
      </label>
      <label htmlFor="icon-button-camera">
        <input
          accept="image/*"
          capture={true}
          multiple
          id="icon-button-camera"
          type="file"
          style={{ display: "none" }}
        />
        <IconButton size="large" component="span">
          <PhotoCamera />
        </IconButton>
      </label>

      <FieldArray
        name="pictures"
        render={(arrayHelpers) => (
          <Box>
            {values.pictures?.map((p, index) => (
              <Box mb={2} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <ImgStorage path={p.path} />
                <DatePickerField name={`pictures.${index}.date`} label="Date de l'ordonnance" />
                <IconButton onClick={() => arrayHelpers.remove(index)}>
                  <ClearIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      />
    </Paper>
  );
}

function DatePickerField({ name, label }: { name: string; label: string }) {
  const [field, _, helpers] = useField({ name });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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

function ActsField({ name, index }: { name: string; index: number }) {
  const { values, setFieldValue } = useFormikContext<CareFormValues>();

  const acts = useMemo(() => getGeneratedActs(values.cares?.[index]), [values]);

  useEffect(() => {
    setFieldValue(name, acts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, setFieldValue, JSON.stringify(acts)]);
  return null;
}

function QuotationField({ name }: { name: string }) {
  const [open, setOpen] = useState(true);

  const [field, _, helpers] = useField({ name });
  const c = field.value;

  const quotations = [
    {
      name: "PSC",
      keyLetter: {
        id: "ami",
        label: "ami",
        price: 5.1,
        priceDOM: 4.3,
      },
      coefficient: {
        id: "1.2",
        value: 1.2,
      },
    },
    {
      name: "Injection",
      keyLetter: {
        id: "ami",
        label: "ami",
        price: 5.1,
        priceDOM: 4.3,
      },
      coefficient: {
        id: "2",
        value: 2,
      },
    },
  ];

  return (
    <>
      {!c && (
        <>
          <Typography sx={{ ml: 2 }}>Cotations</Typography>
          <IconButton color="primary" onClick={() => setOpen(true)}>
            <AddIcon />
          </IconButton>
        </>
      )}

      {c && (
        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }} onClick={() => setOpen(true)}>
          <Typography fontWeight="bold">{`${c?.name}`}</Typography>
          <Box
            mx={1}
            sx={{
              px: 1,
              bgcolor: "primary.main",
              color: "#FFF",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >{`${c?.keyLetter?.label} ${c?.coefficient?.value}`}</Box>
        </Box>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#eee",
            boxShadow: 24,
            p: 1,
            height: "80vh",
            width: "95%",
            borderRadius: 3,
            pt: 2,
          }}
        >
          <Typography variant="h6" component="h2" mb={2}>
            Selectionner une cotation
          </Typography>

          <SearchField />

          <Typography fontWeight="bold" my={2}>
            Top 5
          </Typography>
          <Box>
            {quotations.map((quotation) => (
              <Box key={quotation.name}>
                <Button
                  color={field?.value?.name === quotation?.name ? "secondary" : "primary"}
                  onClick={() => {
                    helpers.setValue(quotation);
                    setOpen(false);
                  }}
                >{`- ${quotation.name} ${quotation.keyLetter.label} ${quotation.coefficient.value}`}</Button>
              </Box>
            ))}
          </Box>

          <Typography fontWeight="bold" my={2}>
            Liste des Cotations
          </Typography>
          <Box mt={2}>
            {quotations.map((quotation) => (
              <Box key={quotation.name}>
                <Button
                  color={field?.value?.name === quotation?.name ? "secondary" : "primary"}
                  onClick={() => {
                    helpers.setValue(quotation);
                    setOpen(false);
                  }}
                >{`- ${quotation.name} ${quotation.keyLetter.label} ${quotation.coefficient.value}`}</Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    </>
  );
}

function DateRangePickerField({ nameStart, nameEnd, index }: { nameStart: string; nameEnd: string; index: number }) {
  const [value, setValue] = useState([null, null] as any);

  const { values, setFieldValue } = useFormikContext<CareFormValues>();
  const acts = values?.cares?.[index]?.acts;
  const dates = useMemo(() => acts?.map((a) => format(a.plannedOn, "dd/MM/yyyy")), [acts?.length]);

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
          // console.log({ dateRangePickerDayProps });
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

function RadioButtonBankHoliday({ name }: { name: string }) {
  const [field, _, helpers] = useField({ name });

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
    </FormControl>
  );
}

export default function GenDayField({ name }: { name: string }) {
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

function DayOfWeekField({ name, label }: { name: string; label: string }) {
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
