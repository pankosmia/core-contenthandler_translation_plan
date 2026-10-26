import {
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from "@mui/material";
import { doI18n } from "pankosmia-lib/i18n";
import { i18nContext, PanCopyright } from "pankosmia-rcl";
import { useContext } from "react";
import SectionDialog from "../SectionDialog";

export default function NameDocument({
  contentType,
  setContentType,
  repoExists,
  setRepoExists,
  errorAbbreviation,
  setErrorAbbreviation,
  contentName,
  setContentName,
  contentAbbr,
  setContentAbbr,
  localRepos,
  copyright,
  setCopyright,
  optionCopyright,
  setOptionCopyright,
}) {
  const regexAbbreviation = /^[A-Za-z0-9][A-Za-z0-9_]{0,6}[A-Za-z0-9]$/;
  const { i18nRef } = useContext(i18nContext);
  const handleChange = (event) => {
    setOptionCopyright(event.target.value);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <SectionDialog titleSection="Name">
          <TextField
            id="name"
            sx={{ width: "100%" }}
            required
            label={doI18n(
              "pages:core-contenthandler_text_translation:name",
              i18nRef.current,
            )}
            value={contentName}
            onChange={(e) => setContentName(e.target.value)}
          />
          <Tooltip
            open={repoExists}
            title={doI18n(
              "pages:core-contenthandler_text_translation:name_is_taken",
              i18nRef.current,
            )}
            placement="top-start"
          >
            <TextField
              sx={{ width: "100%" }}
              id="abbr"
              error={errorAbbreviation}
              helperText={doI18n(
                "pages:core-contenthandler_text_translation:helper_abbreviation",
                i18nRef.current,
              )}
              required
              label={doI18n(
                "pages:core-contenthandler_text_translation:abbreviation",
                i18nRef.current,
              )}
              value={contentAbbr}
              onChange={(e) => {
                const value = e.target.value;
                setRepoExists(
                  localRepos.map((l) => l.split("/")[2]).includes(value),
                );
                setContentAbbr(value);
                setErrorAbbreviation(!regexAbbreviation.test(value));
              }}
            />
          </Tooltip>
        </SectionDialog>
      </Grid>

      <Grid size={12}>
        <PanCopyright
          optionCopyright={optionCopyright}
          setOptionCopyright={setOptionCopyright}
          copyright={copyright}
          setCopyright={setCopyright}
        />
      </Grid>
    </Grid>
  );
}
