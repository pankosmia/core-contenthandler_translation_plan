import { useState } from "react";
import { BurritoSelect } from "./BurritoSelect";

import { Box } from "@mui/material";
import { getFirstChapter } from "./findFirstChapter";
import { BcvPicker } from "./BcvPicker";
import BookPicker from "./BookPicker";

export function WrapperNav({ flavor }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
      <BurritoSelect flavor={flavor} />
      <BookPicker setFirstChapter={getFirstChapter(flavor)} />
      <BcvPicker />
    </Box>
  );
}
