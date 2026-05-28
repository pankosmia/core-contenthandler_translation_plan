import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid2,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { doI18n } from "pithekos-lib";
import { i18nContext } from "pankosmia-rcl";
import { useContext } from "react";

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
  publicDomain,
  setPublicDomain,
}) {
  const regexAbbreviation = /^[A-Za-z0-9][A-Za-z0-9_]{0,6}[A-Za-z0-9]$/;
  const { i18nRef } = useContext(i18nContext);
  return (
    <>
      <Grid2 container spacing={1} justifyItems="flex-end" alignItems="stretch">
        <Grid2 container size={12} spacing={1}>
          <Typography> Name</Typography>
          <Grid2 item size={12}>
            <TextField
              id="name"
              sx={{ width: "100%" }}
              required
              label={doI18n(
                "pages:core-contenthandler_text_translation:name",
                i18nRef.current,
              )}
              value={contentName}
              onChange={(event) => {
                setContentName(event.target.value);
              }}
            />
          </Grid2>
          <Grid2 item size={12}>
            <Tooltip
              open={repoExists}
              slotProps={{
                popper: {
                  modifiers: [{ name: "offset", options: { offset: [0, -7] } }],
                },
              }}
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
                helperText={`${doI18n("pages:core-contenthandler_text_translation:helper_abbreviation", i18nRef.current)}`}
                required
                label={doI18n(
                  "pages:core-contenthandler_text_translation:abbreviation",
                  i18nRef.current,
                )}
                value={contentAbbr}
                onChange={(event) => {
                  const value = event.target.value;
                  setRepoExists(
                    localRepos.map((l) => l.split("/")[2]).includes(value),
                  );
                  setContentAbbr(value);
                  setErrorAbbreviation(!regexAbbreviation.test(value));
                }}
              />
            </Tooltip>
          </Grid2>
        </Grid2>
        <Grid2 container size={12}>
          <Grid2 size={12} spacing={1}>
            <Typography> Copyright</Typography>
          </Grid2>
          <Grid2 size={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    color="secondary"
                    checked={publicDomain}
                    onChange={() => setPublicDomain(!publicDomain)}
                  />
                }
                label={doI18n(
                  "pages:core-contenthandler_translation_plan:public_domain",
                  i18nRef.current,
                )}
              />
            </FormGroup>
          </Grid2>
          <Grid2 item size={6}>
            <TextField
              disabled={publicDomain}
              id="author_name"
              sx={{ width: "100%" }}
              required
              label={doI18n(
                "pages:core-contenthandler_translation_plan:author_name",
                i18nRef.current,
              )}
              value={copyright.author_name}
              onChange={(event) => {
                const value = event.target.value;
                setCopyright({ ...copyright, author_name: value });
              }}
            />
          </Grid2>
          <Grid2 item size={6}>
            <TextField
              disabled={publicDomain}
              sx={{ width: "100%" }}
              id="year"
              required
              label={doI18n(
                "pages:core-contenthandler_translation_plan:year",
                i18nRef.current,
              )}
              value={copyright.year}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "").slice(0, 4);
                setCopyright({
                  ...copyright,
                  year: value,
                });
              }}
            />
          </Grid2>
        </Grid2>

        <TextField
          id="type"
          required
          disabled={true}
          sx={{ display: "none" }}
          value={contentType}
          onChange={(event) => {
            setContentType(event.target.value);
          }}
        />
      </Grid2>
    </>
  );
}
