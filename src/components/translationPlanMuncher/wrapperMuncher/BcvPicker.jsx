import { Button, TextField, Stack, Typography } from "@mui/material";
import { postEmptyJson } from "pankosmia-lib/http";
import { useContext, useEffect, useState } from "react";
import { bcvContext, debugContext } from "pankosmia-rcl";

export function BcvPicker() {
  const { bcvRef } = useContext(bcvContext);
  const { debugRef } = useContext(debugContext);

  const [bookCode, setBookCode] = useState(bcvRef.current.bookCode);
  const [chapter, setChapter] = useState(
    Math.max(1, bcvRef.current.chapterNum ?? 1),
  );
  const [verseStart, setVerseStart] = useState(
    Math.max(1, bcvRef.current.verseNum ?? 1),
  );
  const [verseEnd, setVerseEnd] = useState(
    Math.max(1, bcvRef.current.endVerseNum ?? 1),
  );
  useEffect(() => {
    if (bcvRef.current) {
      setBookCode(bcvRef.current.bookCode);
      setChapter(bcvRef.current.chapterNum ?? 1);
      setVerseStart(bcvRef.current.verseNum ?? 1);
      setVerseEnd(bcvRef.current.endVerseNum ?? 1);
    }
  }, [bcvRef.current]);
  const pickerSx = {
    width: 100,
    "& .MuiInputBase-root": {
      height: 40,
    },
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <TextField
        sx={pickerSx}
        size="small"
        label="Chapter"
        type="number"
        value={chapter}
        inputProps={{ min: 1 }}
        onChange={(e) => {
          setChapter(Math.max(1, Number(e.target.value)));
        }}
      />

      <TextField
        sx={pickerSx}
        size="small"
        label="Start"
        type="number"
        value={verseStart}
        inputProps={{ min: 1 }}
        onChange={(e) => {
          const value = Math.max(1, Number(e.target.value));

          setVerseStart(value);
          if (value > verseEnd) {
            setVerseEnd(value);
          }
        }}
      />

      <TextField
        sx={pickerSx}
        size="small"
        label="End"
        type="number"
        value={verseEnd}
        inputProps={{ min: verseStart }}
        onChange={(e) => {
          const value = Math.max(verseStart, Number(e.target.value));
          setVerseEnd(value);
        }}
      />

      <Button
        sx={{ height: 40 }}
        variant="contained"
        onClick={() =>
          postEmptyJson(
            `/api/navigation/bcv/${bookCode}/${chapter}/${verseStart}/${verseEnd}`,
            debugRef.current,
          )
        }
      >
        Go to {bookCode} {chapter}:{verseStart}
        {verseEnd !== verseStart && verseEnd && `-${verseEnd}`}
      </Button>

      <Typography>
        Current BCV is : {bcvRef.current.bookCode} {bcvRef.current.chapterNum}:
        {bcvRef.current.verseNum}
        {bcvRef.current.verseNum !== bcvRef.current.endVerseNum &&
          bcvRef.current.endVerseNum &&
          `-${bcvRef.current.endVerseNum}`}{" "}
      </Typography>
    </Stack>
  );
}
