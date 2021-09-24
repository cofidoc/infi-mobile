import { FieldArray, useField } from "formik";
import { Box, IconButton, Typography, Paper } from "@mui/material";
import { storage } from "../../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import ClearIcon from "@mui/icons-material/Clear";
import { ImgStorage } from "../../ui/ImgStorage";
import { DatePickerField } from "./DatePickerField";
import { CareFormValues } from "../FormCare";
import { ImportPictures } from "./ImportPictures";

export function PictureField({ name }: { name: string }) {
  const { officeId } = useParams<{ officeId: string }>();
  const [field, _, helpers] = useField({ name });
  const pictures = field.value as CareFormValues["pictures"];

  const uploadOrdonnance = async (e: any) => {
    const files = e?.target?.files || [];

    for (const file of files) {
      const path = `/offices/${officeId}/ordonnances/${uuid()}-${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      helpers.setValue([...(pictures || []), { path }]);
    }
  };

  return (
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
    </Paper>
  );
}
