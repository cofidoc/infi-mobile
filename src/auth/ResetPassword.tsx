import { Box, Button, TextField } from "@mui/material";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Header } from "../ui/Header";

export function ResetPassword() {
  const [email, setEmail] = useState("");
  return (
    <>
      <Header text="Reset Password" />
      <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
        <TextField
          label="Email*"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          sx={{ mt: 2 }}
          disabled={!email}
          variant="contained"
          onClick={async () => {
            await sendPasswordResetEmail(auth, email);
            alert("done");
          }}
        >
          Reset Password
        </Button>
      </Box>
    </>
  );
}
