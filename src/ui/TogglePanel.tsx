import { ReactNode, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { ArrowDropDownCircle } from "@mui/icons-material";

export function TogglePanel({ title, children }: { title: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        <IconButton>
          <ArrowDropDownCircle />
        </IconButton>
      </Box>
      {open && children}
    </>
  );
}
