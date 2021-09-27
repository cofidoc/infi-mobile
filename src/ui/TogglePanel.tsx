import { ReactNode, useState } from "react";
import { Box, IconButton, Collapse } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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
          <Box sx={{ transform: `rotate(${open ? "180deg" : "0deg"})`, transition: "transform 0.2s ease-out" }}>
            <KeyboardArrowDownIcon />
          </Box>
        </IconButton>
      </Box>
      <Collapse in={open}>{children}</Collapse>
    </>
  );
}
