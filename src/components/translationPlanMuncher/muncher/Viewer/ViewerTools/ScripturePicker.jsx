import { FormControl, MenuItem, TextField } from "@mui/material";
import { doI18n } from "pankosmia-lib/i18n";
import { useContext } from "react";

function ScripturePicker({
  burritos,
  selectedBurrito,
  setSelectedBurrito,
  i18nRef,
}) {
  const handleSelectBurrito = (event) => {
    const name = event.target.value;
    const burrito = burritos.find((b) => b.name === name);
    setSelectedBurrito(burrito);
  };
  return (
    <FormControl fullWidth sx={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
      <TextField
        required
        id="burrito-select-label"
        select
        value={selectedBurrito?.name || ""}
        onChange={handleSelectBurrito}
        label={doI18n(
          `pages:core-local-workspace:choose_document`,
          i18nRef.current,
        )}
      >
        {burritos.map((burrito) => (
          <MenuItem key={burrito.path} value={burrito.name}>
            {burrito.name}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  );
}

export default ScripturePicker;
