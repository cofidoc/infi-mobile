import { Box, Button, Paper, Typography, TextField, IconButton } from "@mui/material";
import { Header } from "../ui/Header";
import { ImgStorage } from "../ui/ImgStorage";
import { useGetOrdonnance } from "./api";
import { ImportPictures } from "./Fields/ImportPictures";
import { v4 as uuid } from "uuid";
import { storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { useParams } from "react-router-dom";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import StaticDateRangePicker from "@mui/lab/StaticDateRangePicker";
import DateRangePickerDay from "@mui/lab/DateRangePickerDay";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { ReactNode } from "react";
import { CareType, OrdonnanceType } from "../types";
import { Formik, Form, FieldArray } from "formik";
import { DatePickerField } from "./Fields/DatePickerField";
import ClearIcon from "@mui/icons-material/Clear";

export function ShowCare() {
  const { ordonnance } = useGetOrdonnance();

  return (
    <>
      <Header text="Ordonnance" />

      <Box p={1} pb="5em" sx={{ display: "flex", flexDirection: "column" }}>
        <PicturesForm pictures={ordonnance?.pictures} />

        {ordonnance?.cares?.map((care) => (
          <CareItem key={care.id} care={care} />
        ))}

        <Button variant="contained" color="error">
          Supprimer l'ordonnance
        </Button>
      </Box>
    </>
  );
}

function PicturesForm({ pictures }: { pictures?: OrdonnanceType["pictures"] }) {
  const { officeId, patientId, ordonnanceId } =
    useParams<{ officeId: string; patientId: string; ordonnanceId: string }>();
  const { mutate } = useGetOrdonnance();

  const uploadOrdonnance = async (e: any) => {
    const files = e?.target?.files || [];

    for (const file of files) {
      const path = `/offices/${officeId}/ordonnances/${uuid()}-${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const picturesToAdd = [...(pictures || []), { path }];
      await updateDoc(doc(db, `/offices/${officeId}/patients/${patientId}/ordonnances/`, ordonnanceId), {
        pictures: picturesToAdd,
      });
      mutate();
    }
  };

  const initialValues = {
    pictures: pictures?.map((p) => ({ ...p, date: p?.date ? new Date((p?.date as any)?.seconds * 1000) : null })),
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        try {
          console.log(values);
          await updateDoc(doc(db, `/offices/${officeId}/patients/${patientId}/ordonnances/`, ordonnanceId), values);
          setSubmitting(false);
        } catch (err) {
          console.error(err);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Paper sx={{ px: 1, py: 2, mb: 2 }}>
            <Typography>Impoter vos ordonnances ou prenez les en photos</Typography>

            <ImportPictures onChange={uploadOrdonnance} />

            <FieldArray
              name="pictures"
              render={(arrayHelpers) => (
                <Box>
                  {pictures?.map((p, index) => (
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
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" disabled={isSubmitting}>
                Enregistrer
              </Button>
            </Box>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}

function CareItem({ care }: { care: CareType }) {
  return (
    <Paper sx={{ px: 1, py: 2, mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
        <Typography fontWeight="bold">{`${care.quotation.name}`}</Typography>
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
        >{`${care?.quotation?.keyLetter?.label} ${care?.quotation?.coefficient?.value}`}</Box>
      </Box>

      <Box ml={2} mt={1} sx={{ display: "flex" }}>
        {care.morning && <Tag>Matin</Tag>}
        {care.midday && <Tag>Midi</Tag>}
        {care.afternoon && <Tag>Après-midi</Tag>}
        {care.night && <Tag>Soir</Tag>}
      </Box>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDateRangePicker
          toolbarTitle=""
          toolbarFormat="d MMM"
          inputFormat="dd/MM/yyyy"
          minDate={new Date((care.start as any)?.seconds * 1000)}
          maxDate={new Date((care.end as any)?.seconds * 1000)}
          value={[new Date((care.start as any)?.seconds * 1000), new Date((care.end as any)?.seconds * 1000)]}
          onChange={() => false}
          renderDay={(date: Date, dateRangePickerDayProps) => {
            return <DateRangePickerDay {...dateRangePickerDayProps} />;
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
    </Paper>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <Box mr={1} px="5px" py="2px" sx={{ backgroundColor: "#eee", borderRadius: 2 }}>
      <Typography color="#000">{children}</Typography>
    </Box>
  );
}
