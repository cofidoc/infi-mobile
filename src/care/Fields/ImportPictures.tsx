import { Box, IconButton } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import LoadingButton from "@mui/lab/LoadingButton";

type ImportPicturesProps = {
  loading?: boolean;
  onChange: (e: any) => void;
};

export function ImportPictures({ loading, onChange }: ImportPicturesProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-around" }}>
      <label htmlFor="icon-button-file">
        <input
          id="icon-button-file"
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={onChange}
        />
        <LoadingButton size="large" component="span" loading={loading}>
          <FileDownloadIcon />
        </LoadingButton>
      </label>
      <label htmlFor="icon-button-camera">
        <input
          accept="image/*"
          capture={true}
          multiple
          id="icon-button-camera"
          type="file"
          style={{ display: "none" }}
          onChange={onChange}
        />
        <LoadingButton size="large" component="span" loading={loading}>
          <PhotoCamera />
        </LoadingButton>
      </label>
    </Box>
  );
}
