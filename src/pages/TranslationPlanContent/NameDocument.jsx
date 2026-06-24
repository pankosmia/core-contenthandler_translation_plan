import {
  FormControl,
  FormControlLabel,
  Grid2,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from "@mui/material";
import { doI18n } from "pankosmia-lib/i18n";
import { i18nContext } from "pankosmia-rcl";
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
    <Grid2 container spacing={2}>
      <Grid2 size={12}>
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
      </Grid2>

      <Grid2 size={12}>
        <SectionDialog titleSection="Copyright">
          <FormControl>
            <RadioGroup
              value={optionCopyright}
              onChange={handleChange}
              row
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="all_rights_reserved"
                control={<Radio />}
                label="All rights reserved"
              />
              <FormControlLabel
                value="public-domain"
                control={<Radio />}
                label={doI18n(
                  "pages:core-contenthandler_translation_plan:public_domain",
                  i18nRef.current,
                )}
              />
            </RadioGroup>
          </FormControl>
          {optionCopyright === "all_rights_reserved" && (
            <>
              <TextField
                id="author_name"
                sx={{ width: "100%" }}
                required
                label={doI18n(
                  "pages:core-contenthandler_translation_plan:author_name",
                  i18nRef.current,
                )}
                value={copyright.author_name}
                onChange={(e) =>
                  setCopyright({ ...copyright, author_name: e.target.value })
                }
              />

              <TextField
                sx={{ width: "100%" }}
                id="year"
                required
                label={doI18n(
                  "pages:core-contenthandler_translation_plan:year",
                  i18nRef.current,
                )}
                value={copyright.year}
                onChange={(e) =>
                  setCopyright({
                    ...copyright,
                    year: e.target.value.replace(/\D/g, "").slice(0, 4),
                  })
                }
              />
            </>
          )}
        </SectionDialog>
      </Grid2>
    </Grid2>
  );
}
