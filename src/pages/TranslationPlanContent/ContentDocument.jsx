import { useContext } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Typography,
} from "@mui/material";
import { doI18n } from "pithekos-lib";
import { i18nContext, PanVersificationPicker } from "pankosmia-rcl";

export default function ContentDocument({
  open,
  contentOption,
  setContentOption,
  versification,
  setVersification,
}) {
  const { i18nRef } = useContext(i18nContext);

  return (
    <>
      <PanVersificationPicker
        versification={versification}
        setVersification={setVersification}
        isOpen={open}
      />
      <FormControl>
        <FormLabel id="book-create-options">
          {doI18n(
            "pages:core-contenthandler_text_translation:add_content",
            i18nRef.current,
          )}
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="book-create-options"
          name="book-create-options-radio-group"
          value={contentOption}
          onChange={(event) => setContentOption(event.target.value)}
        >
          <FormControlLabel
            value="greekSentences"
            control={<Radio />}
            label={"Greek sentences"}
          />
          <FormControlLabel
            value="bcvSentences"
            control={<Radio />}
            label={"Book Chapters Verses"}
          />
        </RadioGroup>
      </FormControl>
      {/* {contentOption === "greekSentences" && (
        <>
          <Typography sx={{ padding: 1 }}>
            {doI18n(
              "pages:core-contenthandler_text_translation:helper_book",
              i18nRef.current,
            )}
          </Typography>
        </>
      )}
      {contentOption === "bcvSentences" && (
        <>
          <Typography sx={{ padding: 1 }}>
            {doI18n(
              "pages:core-contenthandler_text_translation:helper_template",
              i18nRef.current,
            )}
          </Typography>
        </>
      )} */}
    </>
  );
}
