import { useContext, useEffect, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Typography,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { doI18n, getAndSetJson } from "pithekos-lib";
import { i18nContext, PanVersificationPicker } from "pankosmia-rcl";
import sx from "../../pages/Selection.styles";
import ListMenuItem from "../../pages/ListMenuItem";

export default function ContentDocument({
  open,
  contentOption,
  setContentOption,
  versification,
  setVersification,
  selectedPlan,
  setSelectedPlan,
}) {
  const { i18nRef } = useContext(i18nContext);
  const [metadataSummaries, setMetadataSummaries] = useState({});
  const planResources = Object.entries(metadataSummaries)
    .filter((r) => r[1].flavor === "x-translationplan")
    .map((r) => r[1].name);

  useEffect(() => {
    if (open) {
      getAndSetJson({
        url: "/burrito/metadata/summaries",
        setter: setMetadataSummaries,
      }).then();
    }
  }, [open]);
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
            value="plan"
            disabled={planResources.length === 0}
            control={<Radio />}
            label={doI18n(
              "pages:core-contenthandler_text_translation:plan_content_radio",
              i18nRef.current,
            )}
          />

          <FormControlLabel
            value="bcv"
            control={<Radio />}
            label={"Book Chapters Verses"}
          />
        </RadioGroup>
      </FormControl>
      {contentOption === "plan" && (
        <>
          <Typography sx={{ padding: 1 }}>
            {doI18n(
              "pages:core-contenthandler_text_translation:helper_template",
              i18nRef.current,
            )}
          </Typography>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel
              id="select-plan-label"
              required
              htmlFor="plan"
              sx={sx.inputLabel}
            >
              {doI18n(
                "pages:core-contenthandler_text_translation:select_plan",
                i18nRef.current,
              )}
            </InputLabel>
            <Select
              variant="outlined"
              required
              labelId="plan-label"
              name="plan"
              inputProps={{
                id: "bookCode",
              }}
              value={selectedPlan}
              label={doI18n(
                "pages:core-contenthandler_text_translation:select_plan",
                i18nRef.current,
              )}
              onChange={(event) => {
                setSelectedPlan(event.target.value);
              }}
              sx={sx.select}
            >
              {Object.entries(metadataSummaries)
                .filter((r) => r[1].flavor === "x-translationplan")
                .map((r) => (
                  <MenuItem key={r[0]} value={r[0]} dense>
                    <ListMenuItem listItem={r[1].name} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </>
      )}
      {contentOption === "bcv" && (
        <>
          <Typography sx={{ padding: 1 }}>
            {doI18n(
              "pages:core-contenthandler_text_translation:helper_template",
              i18nRef.current,
            )}
          </Typography>
        </>
      )}
    </>
  );
}
