import { JsonEditor } from "json-edit-react";
import { useState, useEffect, useContext } from "react";
import { Box, Icon } from "@mui/material";
import { getJson, postJson } from "pankosmia-lib/http";
import GraphiteTest from "../../../GraphiteTest";
import { Button } from "@mui/material";
import { doI18n } from "pankosmia-lib/i18n";
import { enqueueSnackbar } from "notistack";
import { IconAdd, IconClose, IconDelete, IconDone, IconEdit } from "./icons";
export default function TranslationPlanEditorMuncher({ debugRef, i18nRef, typographyRef }) {
  console.log("🚀 ~ TranslationPlanEditorMuncher ~ typographyRef:", typographyRef)
  const [data, setData] = useState({});
  const [unsavedData, setUnsavedData] = useState(false);
  console.log(IconAdd, IconEdit);
  let key = "git.door43.org/BurritoTruck/greek_sentence_plan";
  useEffect(() => {
    const doFetch = async () => {
      const planResponse = await getJson(
        `/api/burrito/ingredient/raw/${key}?ipath=plan.json`,
      );
      if (planResponse.ok) {
        const planJson = planResponse?.json ?? {};
        setData(planJson);
      } else {
        enqueueSnackbar(
          `${doI18n("pages:core-contenthandler_text_translation:content_creation_error", i18nRef.current)}: ${planResponse.status}`,
          { variant: "error" },
        );
        return;
      }
    };
    doFetch().then();
  }, [key]);

  const saveData = async () => {
    const payload = JSON.stringify({ payload: JSON.stringify(data) });
    const response = await postJson(
      `/api/burrito/ingredient/raw/${key}?ipath=plan.json`,
      payload,
      debugRef.current,
    );
    if (response.ok) {
      enqueueSnackbar(
        `${doI18n("pages:core-local-workspace:saved", i18nRef.current)}`,
        { variant: "success" },
      );
      setUnsavedData(false);
    } else {
      enqueueSnackbar(
        `${doI18n("pages:core-local-workspace:save_error", i18nRef.current)}: ${response.status}`,
        { variant: "error" },
      );
    }
  };
  const restrictEditFilter = ({ value }) => typeof value !== "string";

  const restrictAddFilter = ({ value }) =>
    value &&
    (typeof value !== "object" ||
      Object.values(value).filter((o) => typeof o !== "string").length > 0);

  const restrictDeleteFilter = ({ value, parentData }) =>
    typeof value !== "string" || Object.keys(parentData).length === 1;

  const isGraphite = GraphiteTest();
  /** adjSelectedFontClass reshapes selectedFontClass if Graphite is absent. */
  const adjSelectedFontClass = isGraphite
    ? typographyRef.current.font_set
    : typographyRef.current.font_set.replace(
      /Pankosmia-AwamiNastaliq(.*)Pankosmia-NotoNastaliqUrdu/gi,
      "Pankosmia-NotoNastaliqUrdu",
    );
  const panksomsiaTheme = {
    styles: {
      container: {
        padding: "0 16px 0 48px",
        backgroundColor: "inherited",
        fontFamily: "",
        fontSize: "xx-large",
        color: "#441650",
      },
      property: "#441650",
      string: "#000",
      bracket: { display: "none" },
      collection: { fontSize: "smaller", color: "#441650" },
      iconCollection: "#441650",
      iconEdit: "#441650",
      iconDelete: "#AA0000",
      iconAdd: "#441650",
      iconCopy: "#441650",
      iconDone: "#441650",
      iconClose: "#AA0000",
      input: ["#000", { fontSize: "100%" }],
      inputHighlight: "#EECCFF",
    },
  };
  const icons = {
    edit: { content : (IconEdit)},
    add: { content: (IconAdd) },
    delete: { content: (IconDelete) },
    close: { content: (IconClose) },
    done: { content: (IconDone) }
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }} className={adjSelectedFontClass}>

      <JsonEditor
        data={data}
        rootName={data?.short_name}
        setData={setData}
        onUpdate={() => setUnsavedData(true)}
        theme={{...panksomsiaTheme,icons}}
        restrictEdit={restrictEditFilter}
        restrictAdd={restrictAddFilter}
        restrictDelete={restrictDeleteFilter}
        showCollectionCount="when-closed"

        translations={{
          ITEM_SINGLE: doI18n(
            "pages:i18n-editor:single_translation",
            i18nRef.current,
          ),
          ITEMS_MULTIPLE: doI18n(
            "pages:i18n-editor:multiple_translations",
            i18nRef.current,
          ),
          KEY_NEW: doI18n(
            "pages:i18n-editor:translation_new",
            i18nRef.current,
          ),
          KEY_SELECT: doI18n(
            "pages:i18n-editor:translation_select",
            i18nRef.current,
          ),
          NO_KEY_OPTIONS: doI18n(
            "pages:i18n-editor:no_translation_options",
            i18nRef.current,
          ),
          ERROR_KEY_EXISTS: doI18n(
            "pages:i18n-editor:error_translation_exists",
            i18nRef.current,
          ),
          ERROR_INVALID_JSON: doI18n(
            "pages:i18n-editor:invalid_json",
            i18nRef.current,
          ),
          ERROR_UPDATE: doI18n(
            "pages:i18n-editor:error_update",
            i18nRef.current,
          ),
          ERROR_DELETE: doI18n(
            "pages:i18n-editor:error_delete",
            i18nRef.current,
          ),
          ERROR_ADD: doI18n("pages:i18n-editor:error_add", i18nRef.current),
          SHOW_LESS: doI18n("pages:i18n-editor:show_less", i18nRef.current),
        }}
      />
      <Button
        sx={{
          color: unsavedData ? "#FFF" : "#AAA",
          ml: 2,
          position: "absolute",
          top: "64px",
          right: "50px",
        }}
        color="secondary"
        size="large"
        variant="contained"
        aria-label="save"
        disabled={!unsavedData}
        onClick={() => {
          saveData();
        }}
      >
        {doI18n("pages:i18n-editor:save_button", i18nRef.current)}
      </Button>
    </Box>
  );
}
