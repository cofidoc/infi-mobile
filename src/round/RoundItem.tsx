import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Stack,
  Collapse,
} from "@mui/material";
import { Formik, Form, useField, useFormikContext } from "formik";
import { RoundType, getIncreases, getAge } from "./utils";
import { ActType, Increase, PatientType, SeanceType, Time } from "../types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RoomIcon from "@mui/icons-material/Room";
import PhoneIcon from "@mui/icons-material/Phone";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Link, useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import { useGetActsByDate, useGetIncreases, useSeanceById } from "./api";
import { useAuth } from "../auth/authContext";
import { setDoc, doc, updateDoc } from "@firebase/firestore";
import { db } from "../firebase";
import { omit } from "lodash";
import { iOS } from "../utils/iOS";
import format from "../utils/format";
import { ModalIncrease } from "./ModalIncrease";
import { DataReport, ModalReport } from "./ModalReport";
import { useModal } from "../utils/useModal";

type RoundValues = {
  patient: PatientType;
  plannedOn: Date;
  time: Time;
  increases: Increase[];
  ik: SeanceType["ik"];
  acts: ActType[];
  status: SeanceType["status"];
  price: string;
};

export function RoundItem({ round }: { round: RoundType }) {
  const { officeId } = useParams<{ officeId: string }>();
  const { patient, acts } = round;
  const act = acts?.[0];
  const idSeance = `${patient?.id}-${format(act.plannedOn, "dd-MM-yyyy")}-${act.time}`;

  const { user } = useAuth();
  const { seance } = useSeanceById(idSeance);
  const { data: increases = [] } = useGetIncreases();

  const age = getAge(patient?.birth);
  const title = `${patient?.firstname} ${patient?.lastname} (${age}ans)`;
  const isDone = seance?.doneBy?.email;

  const initialValues: RoundValues = {
    patient,
    plannedOn: act?.plannedOn,
    time: act?.time,
    increases: seance?.increases ?? getIncreases(acts, patient, increases),
    ik: seance?.ik ?? "domicile",
    acts: acts?.map((a) => ({ ...a, status: "done" })),
    status: "to-bill" as const,
    price: "10",
  };

  const submit = async (values: RoundValues, { setSubmitting }: any) => {
    try {
      await setDoc(doc(db, `/offices/${officeId}/seances`, idSeance), {
        ...values,
        doneBy: user,
        doneAt: new Date(),
      });

      for (const act of values.acts) {
        await updateDoc(doc(db, `/offices/${officeId}/acts`, act.id), omit(act, "id"));
      }

      setSubmitting(false);
    } catch (err) {
      console.error(err);
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <Formik initialValues={initialValues} enableReinitialize onSubmit={submit}>
      {({ values, isSubmitting }) => (
        <Form>
          <Paper sx={{ px: 1, py: 2, mb: 2, bgcolor: isDone ? "#07eb1333" : "white" }}>
            <Box sx={{ display: "flex", alignItems: "center" }} onClick={() => setOpen((o) => !o)}>
              <IconButton>
                <KeyboardArrowDownIcon
                  sx={{ transform: `rotate(${open ? "180deg" : "0deg"})`, transition: "transform 0.2s ease-out" }}
                />
              </IconButton>
              <Typography fontWeight={isDone ? "bold" : "normal"}>{title}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {isDone ? (
                <Typography ml={2}>{`Fait par ${seance?.doneBy?.firstname} ${seance?.doneBy?.lastname}`}</Typography>
              ) : (
                <span />
              )}

              <Typography fontWeight={isDone ? "bold" : "normal"}>{values.price}€</Typography>
            </Box>

            <Collapse in={open}>
              <Buttons patient={values.patient} />
              <IkField name="ik" />
              <IncreaseField name="increases" />
              <Box p={1}>
                {round?.acts?.map((act, index) => (
                  <Box key={act.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                    <CheckBoxField name={`acts.${index}.status`} label={act?.quotation?.name || ""} />
                    <Box>
                      <ButtonReportAct actId={act.id} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Collapse>

            <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="outlined" size="small" disabled={isSubmitting}>
                Valider
              </Button>
            </Box>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}

function IncreaseField({ name }: { name: string }) {
  const [field, _, helpers] = useField<Increase[]>({ name });
  const increasesSelected = field.value;
  const [open, setOpen] = useState(false);

  return (
    <Box mt={1}>
      {!Boolean(increasesSelected?.length) && <Button onClick={() => setOpen(true)}>Ajouter une majoration</Button>}
      {Boolean(increasesSelected?.length) && (
        <Box sx={{ display: "flex", flexWrap: "wrap" }} onClick={() => setOpen(true)}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {increasesSelected?.map((i) => (
              <Chip key={i.id} label={i.label} color="primary" variant="outlined" />
            ))}
          </Stack>
        </Box>
      )}
      <ModalIncrease
        open={open}
        onClose={() => setOpen(false)}
        increasesInit={increasesSelected}
        onValidate={helpers.setValue}
      />
    </Box>
  );
}

function Buttons({ patient }: { patient: PatientType }) {
  const { officeId } = useParams<{ officeId: string }>();
  const isIphone = iOS();
  const address = "44 rue des roches 95540 Mery Sur Oise";
  const phoneNumber = "0134638506";
  const location = useLocation();
  const query = location.search || `?date=${format(new Date(), "dd-MM-yyyy")}`;

  return (
    <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center" }} mb={1}>
      <IconButton
        color="primary"
        component="a"
        href={isIphone ? `http://maps.apple.com/maps?daddr=${address}` : `http://maps.google.com/maps?daddr=${address}`}
      >
        <RoomIcon />
      </IconButton>
      <IconButton color="primary" component="a" href={isIphone ? `telprompt:$\{${phoneNumber}}` : `tel:${phoneNumber}`}>
        <PhoneIcon />
      </IconButton>
      <IconButton color="primary" component={Link} to={`/offices/${officeId}/patients/${patient?.id}`}>
        <EmojiPeopleIcon />
      </IconButton>
      <ButtonReportActs />
      <IconButton
        color="primary"
        component={Link}
        to={`/offices/${officeId}/patients/${patient?.id}/ordonnances/create-one${query}`}
      >
        <AddCircleIcon />
      </IconButton>
    </Box>
  );
}

function ButtonReportActs() {
  const { open, openModal, closeModal } = useModal();
  const { officeId } = useParams<{ officeId: string }>();
  const { values } = useFormikContext<RoundValues>();
  const { mutate } = useGetActsByDate();

  const reportActs = async (data: DataReport) => {
    try {
      for (const act of values.acts) {
        const refDoc = doc(db, `/offices/${officeId}/acts`, act.id);
        await updateDoc(refDoc, data);
        await mutate();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <IconButton color="primary" onClick={openModal}>
        <AccessTimeIcon />
      </IconButton>
      <ModalReport title="Reporter tous les acts" open={open} onClose={closeModal} onValidate={reportActs} />
    </>
  );
}

function ButtonReportAct({ actId }: { actId: string }) {
  const { open, openModal, closeModal } = useModal();
  const { officeId } = useParams<{ officeId: string }>();
  const { mutate } = useGetActsByDate();

  const reportAct = async (data: DataReport) => {
    try {
      const refDoc = doc(db, `/offices/${officeId}/acts`, actId);
      await updateDoc(refDoc, data);
      await mutate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <IconButton onClick={openModal}>
        <AccessTimeIcon />
      </IconButton>
      <ModalReport title="Reporter l'act" open={open} onClose={closeModal} onValidate={reportAct} />
    </>
  );
}

function CheckBoxField({ name, label }: { name: string; label?: string }) {
  const [field, _, helpers] = useField({ name });

  return (
    <FormControlLabel
      control={
        <Checkbox
          defaultChecked={field?.value === "done"}
          value={field?.value === "done"}
          onChange={(e) => helpers.setValue(e?.target?.checked ? "done" : "not-do")}
        />
      }
      label={label}
    />
  );
}

function IkField({ name }: { name: string }) {
  const [field, _, helpers] = useField({ name });
  const toggleIk = (_: any, _ik: string) => helpers.setValue(_ik);

  return (
    <ToggleButtonGroup color="primary" value={field.value} exclusive onChange={toggleIk} size="small">
      <ToggleButton value="domicile">A Domicile</ToggleButton>
      <ToggleButton value="cabinet">Au Cabinet</ToggleButton>
    </ToggleButtonGroup>
  );
}
