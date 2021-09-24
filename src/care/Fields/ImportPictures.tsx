import { Box, IconButton } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

export function ImportPictures({ onChange }: { onChange: (e: any) => void }) {
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
          onChange={onChange}
        />
        <IconButton size="large" component="span">
          <PhotoCamera />
        </IconButton>
      </label>
    </Box>
  );
}
