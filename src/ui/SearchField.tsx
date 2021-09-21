import { Paper, TextField, TextFieldProps } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { Search } from "@mui/icons-material";

export function SearchField(props: TextFieldProps) {
  return (
    <Paper sx={{ p: 1 }}>
      <TextField
        placeholder="Recherche"
        variant="standard"
        sx={{ width: "100%" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        {...props}
      />
    </Paper>
  );
}
