import { Box, Typography } from "@mui/material";
import { BackButton } from "./BackButton";

export function Header({ text }: { text: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        py: 2,
      }}
    >
      <Box sx={{ position: "absolute", left: 0 }}>
        <BackButton />
      </Box>
      <Typography fontWeight="bold">{text}</Typography>
    </Box>
  );
}
